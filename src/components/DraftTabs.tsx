"use client";

import { useState } from "react";
import { SurveyForm } from "@/components/drafts/SurveyForm";
import { ContactTab } from "@/components/drafts/ContactTab";
import { DraftLawTab } from "@/components/drafts/DraftLawTab";
import { HearingSummaryModal } from "@/components/drafts/HearingSummaryModal";

type Tab = "info" | "sections" | "survey" | "contact";

type DraftTabsProps = {
    draft: {
        id: string;
        title: string;
        description: string;
        agency: string;
        affectedParties: string | null;
        projectDetails: string | null;
        sections: any[];
        surveyQuestions: any[];
        attachments: { id: string; fileName: string; fileUrl: string }[];
        hearingSummary: string | null;
        hearingSummaryPublished: boolean;
    };
    isOpen: boolean;
};

export function DraftTabs({ draft, isOpen }: DraftTabsProps) {
    const [activeTab, setActiveTab] = useState<Tab>("info");

    const tabs: { id: Tab; label: string }[] = [
        { id: "info", label: "ข้อมูลการรับฟังความเห็น" },
        { id: "sections", label: "ร่างกฎหมาย" },
        { id: "survey", label: "แบบสำรวจ" },
        { id: "contact", label: "ข้อมูลติดต่อหน่วยงาน" },
    ];

    return (
        <div className="space-y-6">
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8 overflow-x-auto" aria-label="Tabs">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                                whitespace-nowrap border-b-2 py-4 px-2 text-sm font-medium transition-all duration-200
                                ${activeTab === tab.id
                                    ? "border-[#1a3c7b] text-[#1a3c7b] font-bold"
                                    : "border-transparent text-gray-500 hover:border-gray-200 hover:text-gray-700"
                                }
                            `}
                        >
                            {tab.label}
                        </button>
                    ))}

                    {/* Action button: Survey or Summary */}
                    {draft.hearingSummaryPublished && draft.hearingSummary ? (
                        <HearingSummaryModal summary={draft.hearingSummary} draftTitle={draft.title}>
                            <button
                                className="whitespace-nowrap ml-auto bg-[#2b9e76] text-white rounded-md px-6 py-2 self-center hover:bg-[#249068] text-sm font-medium transition-shadow shadow-sm hover:shadow-md flex items-center gap-2"
                            >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                อ่านสรุปผลการรับฟัง
                            </button>
                        </HearingSummaryModal>
                    ) : (
                        <button
                            onClick={() => setActiveTab("survey")}
                            className={`whitespace-nowrap ml-auto bg-[#1a3c7b] text-white rounded-md px-6 py-2 self-center hover:bg-[#15325f] text-sm font-medium transition-shadow shadow-sm hover:shadow-md flex items-center gap-2 ${activeTab === "survey" ? "ring-2 ring-offset-2 ring-[#1a3c7b]" : ""}`}
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            ทำแบบสอบถาม
                        </button>
                    )}
                </nav>
            </div>

            <div className="animate-in fade-in duration-300 slide-in-from-bottom-2 min-h-[400px]">
                {activeTab === "info" && (
                    <div className="space-y-8">
                        <section>
                            <h3 className="text-[#1a3c7b] font-bold text-lg mb-3 flex items-center gap-2">
                                ชื่อการรับฟัง
                            </h3>
                            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                                <p className="text-gray-700 leading-relaxed">
                                    {draft.title}
                                </p>
                            </div>
                        </section>

                        {draft.affectedParties && (
                            <section>
                                <h3 className="text-[#1a3c7b] font-bold text-lg mb-3 flex items-center gap-2">
                                    ผู้ได้รับผลกระทบ
                                </h3>
                                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                                    <p className="text-gray-700 leading-relaxed">
                                        {draft.affectedParties}
                                    </p>
                                </div>
                            </section>
                        )}

                        <section>
                            <h3 className="text-[#1a3c7b] font-bold text-lg mb-3 flex items-center gap-2">
                                ความเป็นมา (สภาพปัญหาและเป้าหมาย)
                            </h3>
                            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                    {draft.description}
                                </p>
                            </div>
                        </section>

                        {draft.projectDetails && (
                            <section>
                                <h3 className="text-[#1a3c7b] font-bold text-lg mb-3 flex items-center gap-2">
                                    รายละเอียดโครงการ
                                </h3>
                                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                        {draft.projectDetails}
                                    </p>
                                </div>
                            </section>
                        )}
                    </div>
                )}

                {activeTab === "sections" && (
                    <DraftLawTab
                        draftTitle={draft.title}
                        sections={draft.sections}
                        attachments={draft.attachments || []}
                    />
                )}

                {activeTab === "survey" && (
                    <SurveyForm
                        draftId={draft.id}
                        title={draft.title}
                        description={draft.description}
                        questions={draft.surveyQuestions || []}
                    />
                )}

                {activeTab === "contact" && (
                    <ContactTab agency={draft.agency} />
                )}
            </div>
        </div>
    );
}
