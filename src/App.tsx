import React, { useState } from "react";
import { tools } from "./config/tools";
import type { Tool } from "./types";
import { runCleanTextLabTool } from "./services/cleanTextLabApi";
import { detectSuggestions } from "./utils/detectContent";
import { Copy, Terminal, ChevronRight, Wand2 } from "lucide-react";

function App() {
    const [selectedTool, setSelectedTool] = useState<Tool>(tools[0]);
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const categories = Array.from(new Set(tools.map((t) => t.category)));

    const handleRun = async () => {
        if (!input.trim()) return;

        setLoading(true);
        setError(null);
        setOutput("");

        try {
            const response = await runCleanTextLabTool({
                input,
                steps: [selectedTool.apiStep],
            });
            setOutput(response.result);
        } catch (err) {
            const error = err as Error;
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(output);
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-6 md:p-12">
            <div className="max-w-5xl mx-auto space-y-8">
                {/* Header */}
                <header className="flex items-center space-x-3 pb-6 border-b border-slate-200">
                    <div className="p-2 bg-blue-600 rounded-lg text-white">
                        <Terminal size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">CleanTextLab POC</h1>
                        <p className="text-slate-500 text-sm">
                            Official React Starter Kit for CleanTextLab API
                        </p>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    {/* Sidebar */}
                    <aside className="md:col-span-3 space-y-6">
                        <div className="space-y-1">
                            <h3 className="text-xs font-semibold uppercase text-slate-400 tracking-wider mb-3">
                                Select Tool
                            </h3>
                            {categories.map((cat) => (
                                <div key={cat} className="space-y-1">
                                    <h4 className="text-sm font-medium text-slate-900 px-2 mt-4 mb-2">
                                        {cat}
                                    </h4>
                                    {tools
                                        .filter((t) => t.category === cat)
                                        .map((tool) => (
                                            <button
                                                key={tool.id}
                                                onClick={() => {
                                                    setSelectedTool(tool);
                                                    setError(null);
                                                    setOutput("");
                                                }}
                                                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${selectedTool.id === tool.id
                                                    ? "bg-blue-50 text-blue-700 font-medium"
                                                    : "text-slate-600 hover:bg-slate-100"
                                                    }`}
                                            >
                                                {tool.name}
                                            </button>
                                        ))}
                                </div>
                            ))}
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="md:col-span-9 space-y-6">
                        {/* Tool Header */}
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <div className="flex items-center space-x-2 text-sm text-slate-500 mb-2">
                                <span>{selectedTool.category}</span>
                                <ChevronRight size={14} />
                                <span className="font-medium text-slate-900">
                                    {selectedTool.name}
                                </span>
                            </div>
                            <p className="text-slate-600">{selectedTool.description}</p>
                        </div>

                        {/* Playground */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Input */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-medium text-slate-700">
                                        Input
                                    </label>
                                    {input && (
                                        <div className="flex gap-2">
                                            {detectSuggestions(input, selectedTool.id).map((s) => (
                                                <button
                                                    key={s.id}
                                                    onClick={() => {
                                                        const tool = tools.find(t => t.id === s.id);
                                                        if (tool) {
                                                            setSelectedTool(tool);
                                                            setError(null);
                                                            setOutput("");
                                                        }
                                                    }}
                                                    className="flex items-center gap-1 text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 transition-colors animate-fadeIn"
                                                >
                                                    <Wand2 size={10} />
                                                    {s.reason}: <strong>{s.label}</strong>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <textarea
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder={selectedTool.placeholder}
                                    className="w-full h-64 p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm"
                                />
                            </div>

                            {/* Output */}
                            <div className="space-y-2 relative">
                                <label className="text-sm font-medium text-slate-700 flex justify-between items-center">
                                    <span>Output</span>
                                    {output && (
                                        <button
                                            onClick={copyToClipboard}
                                            className="text-xs flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium"
                                        >
                                            <Copy size={12} /> Copy
                                        </button>
                                    )}
                                </label>
                                <div
                                    className={`w-full h-64 p-4 rounded-xl border ${error
                                        ? "border-red-200 bg-red-50 text-red-600"
                                        : "border-slate-200 bg-slate-50 text-slate-700"
                                        } font-mono text-sm overflow-auto whitespace-pre-wrap`}
                                >
                                    {loading ? (
                                        <div className="h-full flex items-center justify-center text-slate-400 animate-pulse">
                                            Processing via API...
                                        </div>
                                    ) : error ? (
                                        error
                                    ) : (
                                        output || (
                                            <span className="text-slate-400 italic">
                                                Result will appear here...
                                            </span>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Action Bar */}
                        <div className="flex justify-end pt-4">
                            <button
                                onClick={handleRun}
                                disabled={loading || !input.trim()}
                                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
                            >
                                <Wand2 size={18} />
                                {loading ? "Processing..." : "Run Tool"}
                            </button>
                        </div>

                        <p className="text-center text-xs text-slate-400 pt-8">
                            Powered by <a href="https://cleantextlab.com" target="_blank" className="underline hover:text-slate-600">CleanTextLab API</a>
                        </p>
                    </main>
                </div>
            </div>
        </div>
    );
}

export default App;
