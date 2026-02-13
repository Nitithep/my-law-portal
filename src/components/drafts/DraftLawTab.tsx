"use client";

import { useState } from "react";

type Attachment = {
    id: string;
    fileName: string;
    fileUrl: string;
};

type Section = {
    id: string;
    sectionNo: string;
    content: string;
};

type DraftLawTabProps = {
    draftTitle: string;
    sections: Section[];
    attachments: Attachment[];
};

export function DraftLawTab({ draftTitle, sections, attachments }: DraftLawTabProps) {
    const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

    const toggleSection = (id: string) => {
        setExpandedSections((prev) => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <h3 className="text-[#1a3c7b] font-bold text-lg">ร่างกฎหมาย</h3>

            {/* Accordion sections */}
            <div className="space-y-3">
                {sections.map((section) => {
                    const isExpanded = expandedSections.has(section.id);
                    return (
                        <div
                            key={section.id}
                            className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm"
                        >
                            <button
                                onClick={() => toggleSection(section.id)}
                                className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <svg
                                        className={`h-5 w-5 text-gray-400 transition-transform duration-200 flex-shrink-0 ${isExpanded ? "rotate-90" : ""}`}
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                    </svg>
                                    <span className="text-sm text-[#1a3c7b] font-medium leading-relaxed">
                                        {draftTitle}
                                    </span>
                                </div>
                            </button>

                            {isExpanded && (
                                <div className="px-5 pb-5 border-t border-gray-100 animate-in slide-in-from-top-2 duration-200">
                                    <div className="pt-4 space-y-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="inline-flex items-center px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-md border border-blue-100">
                                                {section.sectionNo}
                                            </span>
                                        </div>
                                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                                            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                                                {section.content}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* PDF Attachments */}
            {attachments.length > 0 && (
                <div className="space-y-3">
                    {attachments.map((attachment) => (
                        <a
                            key={attachment.id}
                            href={attachment.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:border-[#1a3c7b]/30 hover:shadow-sm transition-all group"
                        >
                            <div className="flex-shrink-0 w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center border border-red-100">
                                <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                </svg>
                            </div>
                            <span className="text-sm text-[#1a3c7b] group-hover:underline font-medium">
                                {attachment.fileName}
                            </span>
                            <svg className="h-4 w-4 text-gray-300 ml-auto flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                        </a>
                    ))}
                </div>
            )}

            {sections.length === 0 && attachments.length === 0 && (
                <div className="text-center py-16 text-gray-500 bg-gray-50 rounded-xl border-dashed border-2 border-gray-200">
                    <svg className="h-12 w-12 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p>ยังไม่มีร่างกฎหมายสำหรับโครงการนี้</p>
                </div>
            )}
        </div>
    );
}
