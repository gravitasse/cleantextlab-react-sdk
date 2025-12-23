import { tools } from "../config/tools";

export interface Suggestion {
    id: string; // Tool ID
    label: string;
    reason: string;
    confidence: number;
}

const toolMap = new Map(tools.map((tool) => [tool.id, tool]));

function looksLikeJson(value: string) {
    const trimmed = value.trim();
    if (!trimmed.startsWith("{") && !trimmed.startsWith("[")) return false;
    try {
        JSON.parse(trimmed);
        return true;
    } catch {
        return false;
    }
}

function looksLikeCsv(value: string) {
    const lines = value.trim().split(/\r?\n/);
    if (lines.length < 2) return false;
    const commaLines = lines.filter((line) => (line.match(/,/g) || []).length >= 1);
    return commaLines.length >= Math.max(2, Math.floor(lines.length / 2));
}

function looksLikeUrl(value: string) {
    return /(https?:\/\/|www\.)[^\s]+/i.test(value);
}

function looksLikeEmailList(value: string) {
    const lines = value.trim().split(/\r?\n/).filter(Boolean);
    if (lines.length < 2) return false;
    const emailish = lines.filter((line) => /\S+@\S+\.\S+/.test(line));
    return emailish.length >= Math.max(2, Math.floor(lines.length / 2));
}

function looksLikePhoneList(value: string) {
    const lines = value.trim().split(/\r?\n/).filter(Boolean);
    if (lines.length < 2) return false;
    const phoneish = lines.filter((line) => /[\d][\d\-\+\(\)\s\.]{6,}/.test(line));
    return phoneish.length >= Math.max(2, Math.floor(lines.length / 2));
}

function looksLikeBase64(value: string) {
    const trimmed = value.trim();
    if (trimmed.length < 16) return false;
    const base64Regex = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
    return base64Regex.test(trimmed.replace(/\s+/g, ""));
}

function hasAccents(value: string) {
    return /[^\u0000-\u007f]/.test(value);
}

function looksLikePaths(value: string) {
    const lines = value.trim().split(/\r?\n/).filter(Boolean);
    if (lines.length < 2) return false;
    const pathish = lines.filter((line) => /[\\/]/.test(line) && !line.startsWith("http"));
    return pathish.length >= Math.max(2, Math.floor(lines.length / 2));
}

export function detectSuggestions(value: string, currentToolId?: string): Suggestion[] {
    const text = value || "";
    if (text.trim().length < 4) return [];

    const suggestions: Suggestion[] = [];

    if (looksLikeJson(text)) {
        suggestions.push({
            id: "json-formatter",
            label: toolMap.get("json-formatter")?.name || "JSON Formatter",
            reason: "Looks like JSON",
            confidence: 0.95,
        });
    }

    if (looksLikeCsv(text)) {
        suggestions.push({
            id: "sort-remove-duplicates",
            label: toolMap.get("sort-remove-duplicates")?.name || "Sort & Deduplicate",
            reason: "Looks like CSV/rows",
            confidence: 0.65,
        });
        suggestions.push({
            id: "csv-json-converter",
            label: toolMap.get("csv-json-converter")?.name || "CSV ↔ JSON",
            reason: "Convert CSV to JSON",
            confidence: 0.6,
        });
    }

    if (looksLikeEmailList(text)) {
        suggestions.push({
            id: "email-extractor",
            label: toolMap.get("email-extractor")?.name || "Email Extractor",
            reason: "Looks like email list",
            confidence: 0.9,
        });
        suggestions.push({
            id: "sort-remove-duplicates",
            label: "Sort & Dedupe",
            reason: "Clean up list",
            confidence: 0.6,
        });
    }

    if (looksLikePhoneList(text)) {
        suggestions.push({
            id: "phone-number-formatter",
            label: toolMap.get("phone-number-formatter")?.name || "Phone Formatter",
            reason: "Looks like phone numbers",
            confidence: 0.8,
        });
    }

    if (looksLikeUrl(text)) {
        suggestions.push({
            id: "sanitize-url",
            label: toolMap.get("sanitize-url")?.name || "Sanitize URL",
            reason: "Clean tracking params",
            confidence: 0.8,
        });
        suggestions.push({
            id: "url-encode-decode",
            label: "URL Decoder",
            reason: "Decode URL",
            confidence: 0.7,
        });
    }

    // URL Encoded check
    if ((text.match(/%[0-9A-Fa-f]{2}/g) || []).length > 1) {
        suggestions.push({
            id: "url-encode-decode",
            label: "URL Decoder",
            reason: "Encoded chars (%)",
            confidence: 0.9,
        });
    }

    if (looksLikeBase64(text)) {
        suggestions.push({
            id: "base64-encode-decode",
            label: "Base64 Decoder",
            reason: "Looks like Base64",
            confidence: 0.8,
        });
    }

    if (hasAccents(text)) {
        suggestions.push({
            id: "accent-remover",
            label: toolMap.get("accent-remover")?.name || "Accent Remover",
            reason: "Has accents/diacritics",
            confidence: 0.7,
        });
    }

    if (looksLikePaths(text)) {
        suggestions.push({
            id: "ascii-tree-generator",
            label: toolMap.get("ascii-tree-generator")?.name || "ASCII Tree Generator",
            reason: "Looks like file paths",
            confidence: 0.8,
        });
    }

    // De-duplicate by id and drop self-references
    const unique = new Map<string, Suggestion>();
    for (const s of suggestions) {
        if (s.id === currentToolId) continue;
        if (!unique.has(s.id) || unique.get(s.id)!.confidence < s.confidence) {
            unique.set(s.id, s);
        }
    }

    return Array.from(unique.values()).sort((a, b) => b.confidence - a.confidence).slice(0, 3);
}
