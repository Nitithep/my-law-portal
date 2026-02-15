"use client";

import { useState } from "react";
import { summarizeDraft } from "@/actions/ai-actions";

export function AISummary({ draftId }: { draftId: string }) {
    const [summary, setSummary] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSummarize = async () => {
        setLoading(true);
        try {
            const data = await summarizeDraft(draftId);
            setSummary(data);
        } catch (error) {
            console.error("Failed to summarize", error);
        } finally {
            setLoading(false);
        }
    };

    if (summary) {
        return (
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" /><path d="M12 6a1 1 0 0 0-1 1v4.59l-3.29-3.3a1 1 0 0 0-1.42 1.42l5 5a1 1 0 0 0 1.42 0l5-5a1 1 0 0 0-1.42-1.42L13 11.59V7a1 1 0 0 0-1-1z" /></svg>
                </div>
                <div className="relative z-10">
                    <h4 className="flex items-center gap-2 font-bold text-indigo-900 mb-3">
                        <span className="text-xl">🤖</span>
                        บทสรุปจาก AI
                    </h4>
                    <div className="prose prose-sm prose-indigo max-w-none text-indigo-800 whitespace-pre-line leading-relaxed">
                        {summary}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <button
            onClick={handleSummarize}
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-medium py-3 rounded-xl shadow-md hover:shadow-lg hover:opacity-90 transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-wait"
        >
            {loading ? (
                <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    กำลังประมวลผล...
                </>
            ) : (
                <>
                    <svg className="h-5 w-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    สรุปเนื้อหาด้วย AI
                </>
            )}
        </button>
    );
}
