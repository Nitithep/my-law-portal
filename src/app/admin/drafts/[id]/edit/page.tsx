"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { StatusBadge } from "@/components/StatusBadge";
import { updateLawDraft, addSection, deleteSection } from "@/actions/admin-actions";

type DraftData = {
    id: string;
    title: string;
    description: string;
    agency: string;
    status: "OPEN" | "CLOSED";
    startDate: string;
    endDate: string;
    version: number;
    projectDetails: string | null;
    hearingSummary: string | null;
    hearingSummaryPublished: boolean;
    sections: {
        id: string;
        sectionNo: string;
        content: string;
        _count?: { votes: number; comments: number };
    }[];
};

const tabs = [
    { id: "info", label: "ข้อมูลทั่วไป", icon: "📋" },
    { id: "sections", label: "มาตรา", icon: "📄" },
    { id: "summary", label: "สรุปผลรับฟัง", icon: "📝" },
    { id: "stats", label: "สถิติ", icon: "📊" },
];

export default function EditDraftPage() {
    const router = useRouter();
    const params = useParams();
    const [draft, setDraft] = useState<DraftData | null>(null);
    const [isPending, setIsPending] = useState(false);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("info");
    const [editingSection, setEditingSection] = useState<string | null>(null);
    const [editContent, setEditContent] = useState("");
    const [newSectionNo, setNewSectionNo] = useState("");
    const [newSectionContent, setNewSectionContent] = useState("");
    const [showAddSection, setShowAddSection] = useState(false);
    const [saveMessage, setSaveMessage] = useState("");

    useEffect(() => {
        async function loadDraft() {
            const res = await fetch(`/api/admin/drafts/${params.id}`);
            if (res.ok) {
                const data = await res.json();
                setDraft(data);
            }
            setLoading(false);
        }
        loadDraft();
    }, [params.id]);

    const reload = async () => {
        const res = await fetch(`/api/admin/drafts/${params.id}`);
        if (res.ok) setDraft(await res.json());
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="flex flex-col items-center gap-3">
                    <svg className="h-8 w-8 text-gray-300 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <p className="text-sm text-gray-400">กำลังโหลด...</p>
                </div>
            </div>
        );
    }

    if (!draft) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <p className="text-lg font-medium text-gray-600">ไม่พบร่างกฎหมาย</p>
                    <button
                        onClick={() => router.push("/admin")}
                        className="mt-3 text-sm text-[#1a3c7b] hover:underline"
                    >
                        กลับหน้าแดชบอร์ด
                    </button>
                </div>
            </div>
        );
    }

    const handleUpdate = async () => {
        setIsPending(true);
        try {
            await updateLawDraft(draft.id, {
                title: draft.title,
                description: draft.description,
                agency: draft.agency,
                status: draft.status,
                startDate: draft.startDate,
                endDate: draft.endDate,
                version: draft.version,
                projectDetails: draft.projectDetails || undefined,
                hearingSummary: draft.hearingSummary || undefined,
                hearingSummaryPublished: draft.hearingSummaryPublished,
            });
            setSaveMessage("บันทึกสำเร็จ!");
            setTimeout(() => setSaveMessage(""), 2000);
        } catch (error) {
            alert("เกิดข้อผิดพลาดในการบันทึก");
        } finally {
            setIsPending(false);
        }
    };

    const handleToggleStatus = async () => {
        const newStatus = draft.status === "OPEN" ? "CLOSED" : "OPEN";
        setDraft({ ...draft, status: newStatus });
        await updateLawDraft(draft.id, { status: newStatus });
    };

    const handleAddSection = async () => {
        if (!newSectionNo.trim() || !newSectionContent.trim()) return;
        await addSection(draft.id, {
            sectionNo: newSectionNo,
            content: newSectionContent,
        });
        setNewSectionNo("");
        setNewSectionContent("");
        setShowAddSection(false);
        await reload();
    };

    const handleDeleteSection = async (sectionId: string) => {
        await deleteSection(sectionId);
        await reload();
    };

    const totalVotes = draft.sections.reduce(
        (acc, s) => acc + (s._count?.votes || 0),
        0
    );
    const totalComments = draft.sections.reduce(
        (acc, s) => acc + (s._count?.comments || 0),
        0
    );

    return (
        <div className="max-w-4xl mx-auto space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <StatusBadge status={draft.status} />
                    </div>
                    <h1 className="text-lg font-bold text-gray-800 line-clamp-1">
                        {draft.title}
                    </h1>
                    <p className="text-xs text-gray-500 mt-0.5">
                        🏛️ {draft.agency} • สร้างเมื่อ{" "}
                        {new Date(draft.startDate).toLocaleDateString("th-TH")}
                    </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                    <a
                        href={`/api/admin/drafts/${draft.id}/export`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                    >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Export CSV
                    </a>
                    <button
                        onClick={handleToggleStatus}
                        className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${draft.status === "OPEN"
                            ? "text-orange-600 bg-orange-50 hover:bg-orange-100 border border-orange-200"
                            : "text-emerald-600 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200"
                            }`}
                    >
                        {draft.status === "OPEN" ? (
                            <>
                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                ปิดรับฟัง
                            </>
                        ) : (
                            <>
                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                                </svg>
                                เปิดรับฟัง
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="flex border-b border-gray-100">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium transition-colors relative ${activeTab === tab.id
                                ? "text-[#1a3c7b]"
                                : "text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            <span className="text-base">{tab.icon}</span>
                            {tab.label}
                            {activeTab === tab.id && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1a3c7b] rounded-t" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Tab: info */}
                {activeTab === "info" && (
                    <div className="p-6 space-y-5">
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-2">
                                ชื่อร่างกฎหมาย
                            </label>
                            <input
                                value={draft.title}
                                onChange={(e) =>
                                    setDraft({ ...draft, title: e.target.value })
                                }
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-[#1a3c7b] focus:ring-2 focus:ring-[#1a3c7b]/10 outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-2">
                                คำอธิบาย
                            </label>
                            <textarea
                                value={draft.description}
                                onChange={(e) =>
                                    setDraft({ ...draft, description: e.target.value })
                                }
                                rows={4}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-[#1a3c7b] focus:ring-2 focus:ring-[#1a3c7b]/10 outline-none transition-all resize-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-2">
                                หน่วยงาน
                            </label>
                            <input
                                value={draft.agency}
                                onChange={(e) =>
                                    setDraft({ ...draft, agency: e.target.value })
                                }
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-[#1a3c7b] focus:ring-2 focus:ring-[#1a3c7b]/10 outline-none transition-all"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-2">
                                    วันเริ่มรับฟัง
                                </label>
                                <input
                                    type="date"
                                    value={draft.startDate?.split("T")[0]}
                                    onChange={(e) =>
                                        setDraft({ ...draft, startDate: e.target.value })
                                    }
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-[#1a3c7b] focus:ring-2 focus:ring-[#1a3c7b]/10 outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-2">
                                    วันสิ้นสุดรับฟัง
                                </label>
                                <input
                                    type="date"
                                    value={draft.endDate?.split("T")[0]}
                                    onChange={(e) =>
                                        setDraft({ ...draft, endDate: e.target.value })
                                    }
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-[#1a3c7b] focus:ring-2 focus:ring-[#1a3c7b]/10 outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-2">
                            {saveMessage && (
                                <span className="text-xs font-medium text-emerald-600 flex items-center gap-1">
                                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                    {saveMessage}
                                </span>
                            )}
                            <button
                                onClick={handleUpdate}
                                disabled={isPending}
                                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#1a3c7b] rounded-xl hover:bg-[#15325f] transition-colors disabled:opacity-50 shadow-sm"
                            >
                                {isPending ? (
                                    <>
                                        <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        บันทึก...
                                    </>
                                ) : (
                                    "บันทึกการเปลี่ยนแปลง"
                                )}
                            </button>
                        </div>
                    </div>
                )}

                {/* Tab: sections */}
                {activeTab === "sections" && (
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-sm text-gray-500">
                                {draft.sections.length} มาตรา
                            </p>
                            <button
                                onClick={() => setShowAddSection(!showAddSection)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded-lg hover:bg-blue-100 transition-colors"
                            >
                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                </svg>
                                เพิ่มมาตรา
                            </button>
                        </div>

                        {/* Add Section Form */}
                        {showAddSection && (
                            <div className="mb-4 p-4 rounded-xl border-2 border-dashed border-blue-200 bg-blue-50/50 space-y-3">
                                <input
                                    placeholder="เช่น มาตรา 6"
                                    value={newSectionNo}
                                    onChange={(e) => setNewSectionNo(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white outline-none focus:border-blue-400"
                                />
                                <textarea
                                    placeholder="เนื้อหาของมาตรา..."
                                    value={newSectionContent}
                                    onChange={(e) => setNewSectionContent(e.target.value)}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white outline-none focus:border-blue-400 resize-none"
                                />
                                <div className="flex justify-end gap-2">
                                    <button
                                        onClick={() => setShowAddSection(false)}
                                        className="px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-700"
                                    >
                                        ยกเลิก
                                    </button>
                                    <button
                                        onClick={handleAddSection}
                                        className="px-3 py-1.5 text-xs font-semibold text-white bg-[#1a3c7b] rounded-lg hover:bg-[#15325f]"
                                    >
                                        เพิ่ม
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Section List */}
                        <div className="space-y-2">
                            {draft.sections.map((section, idx) => (
                                <div
                                    key={section.id}
                                    className="group rounded-xl border border-gray-100 hover:border-blue-200 transition-colors overflow-hidden"
                                >
                                    <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50/80">
                                        <div className="flex items-center gap-2">
                                            <span className="h-6 w-6 rounded-md bg-[#1a3c7b] text-white flex items-center justify-center text-[10px] font-bold">
                                                {idx + 1}
                                            </span>
                                            <span className="text-sm font-semibold text-[#1a3c7b]">
                                                {section.sectionNo}
                                            </span>
                                            {section._count && (
                                                <span className="text-[10px] text-gray-400 ml-2">
                                                    {section._count.votes} โหวต • {section._count.comments} ความเห็น
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => {
                                                    setEditingSection(section.id);
                                                    setEditContent(section.content);
                                                }}
                                                className="h-7 w-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                                            >
                                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => handleDeleteSection(section.id)}
                                                className="h-7 w-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50"
                                            >
                                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>

                                    {editingSection === section.id ? (
                                        <div className="p-4 bg-yellow-50/50 border-t border-yellow-200">
                                            <textarea
                                                value={editContent}
                                                onChange={(e) => setEditContent(e.target.value)}
                                                rows={4}
                                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white outline-none focus:border-blue-400 resize-none"
                                            />
                                            <div className="flex justify-end gap-2 mt-2">
                                                <button
                                                    onClick={() => setEditingSection(null)}
                                                    className="px-3 py-1.5 text-xs font-medium text-gray-500"
                                                >
                                                    ยกเลิก
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        // TODO: implement section content update
                                                        setEditingSection(null);
                                                    }}
                                                    className="px-3 py-1.5 text-xs font-semibold text-white bg-[#1a3c7b] rounded-lg"
                                                >
                                                    บันทึก
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="px-4 py-3">
                                            <p className="text-sm text-gray-600 leading-relaxed">
                                                {section.content}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Tab: summary */}
                {activeTab === "summary" && (
                    <div className="p-6 space-y-5">
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-2">
                                สรุปผลการรับฟังความคิดเห็น
                            </label>
                            <textarea
                                value={draft.hearingSummary || ""}
                                onChange={(e) =>
                                    setDraft({ ...draft, hearingSummary: e.target.value })
                                }
                                rows={8}
                                placeholder="กรอกสรุปผลการรับฟังความคิดเห็น..."
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-[#1a3c7b] focus:ring-2 focus:ring-[#1a3c7b]/10 outline-none transition-all resize-none"
                            />
                        </div>

                        <div className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 bg-gray-50">
                            <button
                                onClick={() =>
                                    setDraft({
                                        ...draft,
                                        hearingSummaryPublished: !draft.hearingSummaryPublished,
                                    })
                                }
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${draft.hearingSummaryPublished ? "bg-[#2b9e76]" : "bg-gray-300"
                                    }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${draft.hearingSummaryPublished ? "translate-x-6" : "translate-x-1"
                                        }`}
                                />
                            </button>
                            <div>
                                <p className="text-sm font-medium text-gray-700">
                                    เผยแพร่สรุปผลการรับฟัง
                                </p>
                                <p className="text-xs text-gray-500">
                                    {draft.hearingSummaryPublished
                                        ? "กำลังแสดงสรุปผลบนหน้ารายละเอียด"
                                        : "ยังไม่ได้เผยแพร่สรุปผล"}
                                </p>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-2">
                                รายละเอียดโครงการ
                            </label>
                            <textarea
                                value={draft.projectDetails || ""}
                                onChange={(e) =>
                                    setDraft({ ...draft, projectDetails: e.target.value })
                                }
                                rows={4}
                                placeholder="กรอกรายละเอียดโครงการ (ถ้ามี)..."
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-[#1a3c7b] focus:ring-2 focus:ring-[#1a3c7b]/10 outline-none transition-all resize-none"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-2">
                                    ครั้งที่ (version)
                                </label>
                                <input
                                    type="number"
                                    min={1}
                                    value={draft.version}
                                    onChange={(e) =>
                                        setDraft({ ...draft, version: parseInt(e.target.value) || 1 })
                                    }
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-[#1a3c7b] focus:ring-2 focus:ring-[#1a3c7b]/10 outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-2">
                            {saveMessage && (
                                <span className="text-xs font-medium text-emerald-600 flex items-center gap-1">
                                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                    {saveMessage}
                                </span>
                            )}
                            <button
                                onClick={handleUpdate}
                                disabled={isPending}
                                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#1a3c7b] rounded-xl hover:bg-[#15325f] transition-colors disabled:opacity-50 shadow-sm"
                            >
                                {isPending ? "บันทึก..." : "บันทึกการเปลี่ยนแปลง"}
                            </button>
                        </div>
                    </div>
                )}

                {/* Tab: stats */}
                {activeTab === "stats" && (
                    <div className="p-6">
                        {/* Overview */}
                        <h3 className="text-sm font-bold text-gray-700">ภาพรวม</h3>
                        <div className="grid grid-cols-3 gap-3 mb-6">
                            <div className="p-4 rounded-xl bg-purple-50 border border-purple-100 text-center">
                                <p className="text-2xl font-bold text-purple-700">{totalVotes}</p>
                                <p className="text-xs text-purple-500 mt-1">โหวตทั้งหมด</p>
                            </div>
                            <div className="p-4 rounded-xl bg-rose-50 border border-rose-100 text-center">
                                <p className="text-2xl font-bold text-rose-700">{totalComments}</p>
                                <p className="text-xs text-rose-500 mt-1">ความเห็นทั้งหมด</p>
                            </div>
                            <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 text-center">
                                <p className="text-2xl font-bold text-blue-700">{draft.sections.length}</p>
                                <p className="text-xs text-blue-500 mt-1">มาตราทั้งหมด</p>
                            </div>
                        </div>

                        {/* Per-section stats */}
                        <h3 className="text-sm font-bold text-gray-700 mb-3">
                            สถิติรายมาตรา
                        </h3>
                        <div className="space-y-2">
                            {draft.sections.map((section, idx) => {
                                const votes = section._count?.votes || 0;
                                const comments = section._count?.comments || 0;
                                const maxVotes = Math.max(
                                    ...draft.sections.map((s) => s._count?.votes || 0),
                                    1
                                );
                                return (
                                    <div
                                        key={section.id}
                                        className="p-3 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium text-gray-700">
                                                {section.sectionNo}
                                            </span>
                                            <div className="flex items-center gap-3 text-xs text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <span className="h-2 w-2 rounded-full bg-purple-400" />
                                                    {votes} โหวต
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <span className="h-2 w-2 rounded-full bg-rose-400" />
                                                    {comments} ความเห็น
                                                </span>
                                            </div>
                                        </div>
                                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-purple-400 to-purple-600 rounded-full transition-all"
                                                style={{
                                                    width: `${(votes / maxVotes) * 100}%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
