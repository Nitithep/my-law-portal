"use client";

import { useEffect, useState } from "react";
import { getSurveyResponses, SurveyResponseResult } from "@/actions/admin-actions";

export function SurveyResponseTable({ draftId }: { draftId: string }) {
    const [responses, setResponses] = useState<SurveyResponseResult[]>([]);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState<string | null>(null);

    useEffect(() => {
        async function load() {
            try {
                const data = await getSurveyResponses(draftId);
                setResponses(data);
            } catch (err) {
                console.error(err);
                alert("โหลดข้อมูลไม่สำเร็จ");
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [draftId]);

    const toggleExpand = (sessionId: string) => {
        setExpanded(expanded === sessionId ? null : sessionId);
    };

    if (loading) {
        return (
            <div className="py-12 text-center text-gray-500">
                <svg className="h-8 w-8 mx-auto mb-3 animate-spin text-gray-300" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                กำลังโหลดข้อมูลผู้ตอบแบบสอบถาม...
            </div>
        );
    }

    if (responses.length === 0) {
        return (
            <div className="py-16 text-center border-2 border-dashed border-gray-100 rounded-xl">
                <div className="h-12 w-12 mx-auto mb-3 bg-gray-50 rounded-full flex items-center justify-center">
                    <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                </div>
                <p className="text-gray-500">ยังไม่มีผู้ตอบแบบสอบถาม</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                <h3 className="font-semibold text-gray-700">รายการผู้ตอบ ({responses.length})</h3>
                <div className="flex items-center gap-3">
                    <a
                        href={`/api/admin/drafts/${draftId}/export?type=survey`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                    >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Export CSV
                    </a>
                    <button
                        onClick={() => window.location.reload()}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-100 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        รีเฟรช
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 font-medium">
                        <tr>
                            <th className="px-6 py-3 w-10"></th>
                            <th className="px-6 py-3">วันที่เวลา</th>
                            <th className="px-6 py-3">ผู้ใช้งาน</th>
                            <th className="px-6 py-3 text-center">จำนวนข้อที่ตอบ</th>
                            <th className="px-6 py-3">User ID / Session</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {responses.map((r, idx) => (
                            <>
                                <tr
                                    key={r.sessionId}
                                    onClick={() => toggleExpand(r.sessionId)}
                                    className={`cursor-pointer hover:bg-blue-50/30 transition-colors ${expanded === r.sessionId ? "bg-blue-50/50" : ""}`}
                                >
                                    <td className="px-6 py-4 text-gray-400">
                                        <svg
                                            className={`h-4 w-4 transform transition-transform ${expanded === r.sessionId ? "rotate-90 text-blue-600" : ""}`}
                                            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">
                                        {new Date(r.createdAt).toLocaleString("th-TH")}
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-800">
                                        {r.userName}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                                            {r.responseCount} ข้อ
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-xs font-mono text-gray-400">
                                        {r.sessionId.substring(0, 8)}...
                                    </td>
                                </tr>
                                {expanded === r.sessionId && (
                                    <tr className="bg-gray-50/30">
                                        <td colSpan={5} className="px-6 py-4 pl-16">
                                            <div className="space-y-4">
                                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">รายละเอียดคำตอบ</h4>
                                                <div className="grid gap-3">
                                                    {r.answers
                                                        .sort((a, b) => a.order - b.order)
                                                        .map((ans) => (
                                                            <div key={ans.questionId} className="bg-white p-3 rounded-lg border border-gray-200">
                                                                <div className="flex justify-between items-start gap-4">
                                                                    <div className="flex-1">
                                                                        <p className="text-sm font-medium text-gray-800 mb-1">
                                                                            {ans.order}. {ans.question}
                                                                        </p>
                                                                        {ans.comment && (
                                                                            <div className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                                                                                <span className="font-semibold text-xs text-gray-400 block mb-0.5">ความคิดเห็น:</span>
                                                                                "{ans.comment}"
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <div className="flex-shrink-0">
                                                                        <span
                                                                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${ans.answer === 'AGREE'
                                                                                ? "bg-green-50 text-green-700 border-green-200"
                                                                                : "bg-red-50 text-red-700 border-red-200"}`}
                                                                        >
                                                                            {ans.answer === 'AGREE' ? 'เห็นด้วย' : 'ไม่เห็นด้วย'}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
