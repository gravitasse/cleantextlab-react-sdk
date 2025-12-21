import type { CleanTextLabRequest, CleanTextLabResponse } from "../types";

const API_Base = "https://cleantextlab.com/api/v1";

export async function runCleanTextLabTool(
    request: CleanTextLabRequest
): Promise<CleanTextLabResponse> {
    const apiKey = import.meta.env.VITE_CLEANTEXTLAB_API_KEY;

    if (!apiKey) {
        throw new Error(
            "API Key is missing. Please set VITE_CLEANTEXTLAB_API_KEY in .env.local"
        );
    }

    try {
        const response = await fetch(`${API_Base}/run`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": apiKey,
            },
            body: JSON.stringify(request),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `API Error: ${response.status}`);
        }

        return await response.json();
    } catch (err) {
        const error = err as Error;
        console.error("Tool execution failed:", error);
        throw new Error(error.message || "Network error occurred");
    }
}
