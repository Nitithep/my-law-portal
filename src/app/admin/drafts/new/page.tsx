"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createLawDraft } from "@/actions/admin-actions";

export default function NewDraftPage() {
    const router = useRouter();
    const [isPending, setIsPending] = useState(false);
    const [step, setStep] = useState(1);
    const [form, setForm] = useState({
        title: "",
        description: "",
        agency: "",
        startDate: "",
        endDate: "",
        category: "การศึกษา",
        image: "",
        affectedParties: "",
        hearingTime: "ครั้งที่ 1",
    });
    const [sections, setSections] = useState([
        { sectionNo: "มาตรา 1", content: "" },
    ]);
    const [questions, setQuestions] = useState([
        { question: "", order: 1 }
    ]);

    const addSection = () => {
        setSections([
            ...sections,
            { sectionNo: `มาตรา ${sections.length + 1}`, content: "" },
        ]);
    };

    const removeSection = (idx: number) => {
        setSections(sections.filter((_, i) => i !== idx));
    };

    const updateSection = (
        idx: number,
        field: "sectionNo" | "content",
        value: string
    ) => {
        const updated = [...sections];
        updated[idx][field] = value;
        setSections(updated);
    };

    const addQuestion = () => {
        setQuestions([
            ...questions,
            { question: "", order: questions.length + 1 }
        ]);
    };

    const removeQuestion = (idx: number) => {
        setQuestions(questions.filter((_, i) => i !== idx));
    };

    const updateQuestion = (idx: number, value: string) => {
        const updated = [...questions];
        updated[idx].question = value;
        setQuestions(updated);
    };

    const handleSubmit = async () => {
        setIsPending(true);
        try {
            await createLawDraft({
                ...form,
                sections: sections.filter((s) => s.content.trim()),
                surveyQuestions: questions.filter((q) => q.question.trim()),
            });
            router.push("/admin");
        } catch (error) {
            alert("เกิดข้อผิดพลาดในการสร้าง");
        } finally {
            setIsPending(false);
        }
    };

    const canNext = () => {
        if (step === 1) return form.title && form.description && form.agency && form.startDate && form.endDate;
        if (step === 2) return sections.some((s) => s.content.trim());
        if (step === 3) return true; // Survey step is optional
        return true;
    };

    return (
        <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-xl font-bold text-gray-800">สร้างร่างกฎหมายใหม่</h1>
                <p className="text-sm text-gray-500 mt-0.5">
                    กรอกข้อมูลร่างกฎหมายและมาตราที่ต้องการรับฟังความคิดเห็น
                </p>
            </div>

            {/* Step indicator */}
            <div className="flex items-center gap-2 mb-6">
                {[
                    { num: 1, label: "ข้อมูลทั่วไป" },
                    { num: 2, label: "มาตรา" },
                    { num: 3, label: "แบบสำรวจ" },
                    { num: 4, label: "ตรวจสอบ" },
                ].map((s, i) => (
                    <div key={s.num} className="flex items-center gap-2 flex-1">
                        <div className="flex items-center gap-2 flex-1">
                            <div
                                className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors flex-shrink-0 ${step >= s.num
                                    ? "bg-[#1a3c7b] text-white"
                                    : "bg-gray-200 text-gray-400"
                                    }`}
                            >
                                {step > s.num ? (
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : (
                                    s.num
                                )}
                            </div>
                            <span
                                className={`text-xs font-medium ${step >= s.num ? "text-[#1a3c7b]" : "text-gray-400"
                                    }`}
                            >
                                {s.label}
                            </span>
                        </div>
                        {i < 3 && <div className="h-0.5 flex-1 bg-gray-100 mx-2" />}
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                {step === 1 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    ชื่อร่างกฎหมาย <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1a3c7b]/20 focus:border-[#1a3c7b] transition-all text-sm"
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    รายละเอียดย่อ (ความเป็นมา/หลักการและเหตุผล) <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    required
                                    rows={4}
                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1a3c7b]/20 focus:border-[#1a3c7b] transition-all text-sm"
                                    value={form.description}
                                    onChange={(e) =>
                                        setForm({ ...form, description: e.target.value })
                                    }
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        หน่วยงานรับผิดชอบ <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1a3c7b]/20 focus:border-[#1a3c7b] transition-all text-sm"
                                        value={form.agency}
                                        onChange={(e) => setForm({ ...form, agency: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        หมวดหมู่
                                    </label>
                                    <select
                                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1a3c7b]/20 focus:border-[#1a3c7b] transition-all text-sm"
                                        value={form.category}
                                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                                    >
                                        <option value="การศึกษา">การศึกษา</option>
                                        <option value="เศรษฐกิจ">เศรษฐกิจ</option>
                                        <option value="สังคม">สังคม</option>
                                        <option value="สาธารณสุข">สาธารณสุข</option>
                                        <option value="สิ่งแวดล้อม">สิ่งแวดล้อม</option>
                                        <option value="กฎหมายและกระบวนการยุติธรรม">กฎหมายและกระบวนการยุติธรรม</option>
                                        <option value="อื่นๆ">อื่นๆ</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        URL รูปภาพปก (ถ้ามี)
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="https://..."
                                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1a3c7b]/20 focus:border-[#1a3c7b] transition-all text-sm"
                                        value={form.image}
                                        onChange={(e) => setForm({ ...form, image: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        การรับฟังครั้งที่
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="เช่น ครั้งที่ 1"
                                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1a3c7b]/20 focus:border-[#1a3c7b] transition-all text-sm"
                                        value={form.hearingTime}
                                        onChange={(e) => setForm({ ...form, hearingTime: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    กลุ่มเป้าหมาย/ผู้ได้รับผลกระทบ
                                </label>
                                <input
                                    type="text"
                                    placeholder="เช่น นักเรียน, ครู, ผู้ปกครอง"
                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1a3c7b]/20 focus:border-[#1a3c7b] transition-all text-sm"
                                    value={form.affectedParties}
                                    onChange={(e) => setForm({ ...form, affectedParties: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        วันที่เริ่มรับฟัง <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1a3c7b]/20 focus:border-[#1a3c7b] transition-all text-sm text-gray-600"
                                        value={form.startDate}
                                        onChange={(e) =>
                                            setForm({ ...form, startDate: e.target.value })
                                        }
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        วันที่สิ้นสุดรับฟัง <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1a3c7b]/20 focus:border-[#1a3c7b] transition-all text-sm text-gray-600"
                                        value={form.endDate}
                                        onChange={(e) =>
                                            setForm({ ...form, endDate: e.target.value })
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="text-sm font-bold text-gray-700">รายการมาตรา</h2>
                            <button
                                onClick={addSection}
                                className="text-xs font-semibold text-[#1a3c7b] hover:underline flex items-center gap-1"
                            >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                </svg>
                                เพิ่มมาตรา
                            </button>
                        </div>
                        <div className="space-y-4">
                            {sections.map((section, idx) => (
                                <div
                                    key={idx}
                                    className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 space-y-3 relative group"
                                >
                                    <div className="flex justify-between">
                                        <input
                                            type="text"
                                            className="bg-transparent border-none text-sm font-bold text-gray-800 focus:ring-0 p-0 w-1/3 placeholder:text-gray-400"
                                            value={section.sectionNo}
                                            onChange={(e) =>
                                                updateSection(idx, "sectionNo", e.target.value)
                                            }
                                            placeholder="เช่น มาตรา 1"
                                        />
                                        {sections.length > 1 && (
                                            <button
                                                onClick={() => removeSection(idx)}
                                                className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                    <textarea
                                        rows={3}
                                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1a3c7b]/20 focus:border-[#1a3c7b] transition-all text-sm bg-white"
                                        placeholder="เนื้อหากฎหมาย..."
                                        value={section.content}
                                        onChange={(e) =>
                                            updateSection(idx, "content", e.target.value)
                                        }
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="text-sm font-bold text-gray-700">แบบสำรวจความเห็น</h2>
                            <button
                                onClick={addQuestion}
                                className="text-xs font-semibold text-[#1a3c7b] hover:underline flex items-center gap-1"
                            >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                </svg>
                                เพิ่มคำถาม
                            </button>
                        </div>
                        <div className="space-y-4">
                            {questions.length === 0 && (
                                <div className="text-center py-8 text-gray-400 text-sm italic">
                                    ยังไม่มีคำถามสำหรับแบบสำรวจ (ผู้ใช้จะไม่สามารถทำแบบสำรวจได้)
                                </div>
                            )}
                            {questions.map((q, idx) => (
                                <div
                                    key={idx}
                                    className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 space-y-3 relative group"
                                >
                                    <div className="flex justify-between items-center gap-4">
                                        <span className="text-sm font-bold text-gray-500 whitespace-nowrap">
                                            ข้อที่ {idx + 1}
                                        </span>
                                        <button
                                            onClick={() => removeQuestion(idx)}
                                            className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                    <textarea
                                        rows={2}
                                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1a3c7b]/20 focus:border-[#1a3c7b] transition-all text-sm bg-white"
                                        placeholder="คำถาม..."
                                        value={q.question}
                                        onChange={(e) =>
                                            updateQuestion(idx, e.target.value)
                                        }
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}


                {step === 4 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="bg-blue-50/50 rounded-xl p-6 border border-blue-100">
                            <h3 className="font-bold text-[#1a3c7b] text-lg mb-2">{form.title}</h3>
                            <p className="text-sm text-gray-600 mb-4">{form.description}</p>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-500 block text-xs">หน่วยงาน</span>
                                    <span className="font-medium text-gray-800">{form.agency}</span>
                                </div>
                                <div>
                                    <span className="text-gray-500 block text-xs">ระยะเวลารับฟัง</span>
                                    <span className="font-medium text-gray-800">
                                        {new Date(form.startDate).toLocaleDateString("th-TH", {
                                            day: "numeric",
                                            month: "short",
                                        }) ?? "-"}{" "}
                                        -{" "}
                                        {new Date(form.endDate).toLocaleDateString("th-TH", {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                        }) ?? "-"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-bold text-gray-800 text-sm mb-3">
                                มาตรา ({sections.length})
                            </h4>
                            <div className="space-y-3">
                                {sections.map((s, i) => (
                                    <div key={i} className="flex gap-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
                                        <span className="text-xs font-bold text-gray-500 shrink-0 mt-0.5">
                                            {s.sectionNo}
                                        </span>
                                        <p className="text-sm text-gray-600 line-clamp-2">{s.content}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h4 className="font-bold text-gray-800 text-sm mb-3">
                                คำถามแบบสำรวจ ({questions.length})
                            </h4>
                            <div className="space-y-3">
                                {questions.map((q, i) => (
                                    <div key={i} className="flex gap-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
                                        <span className="text-xs font-bold text-gray-500 shrink-0 mt-0.5">
                                            ข้อ {i + 1}
                                        </span>
                                        <p className="text-sm text-gray-600 line-clamp-2">{q.question}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="mt-6 flex items-center justify-between">
                {step > 1 ? (
                    <button
                        onClick={() => setStep(step - 1)}
                        disabled={isPending}
                        className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                        ย้อนกลับ
                    </button>
                ) : (
                    <div />
                )}

                {step < 4 ? (
                    <button
                        onClick={() => setStep(step + 1)}
                        disabled={!canNext()}
                        className="px-5 py-2.5 rounded-xl bg-[#1a3c7b] text-white text-sm font-semibold hover:bg-[#15325f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-blue-900/10"
                    >
                        ถัดไป
                    </button>
                ) : (
                    <button
                        onClick={handleSubmit}
                        disabled={isPending}
                        className="px-6 py-2.5 rounded-xl bg-[#2b9e76] text-white text-sm font-semibold hover:bg-[#249068] transition-colors shadow-sm shadow-green-900/10 flex items-center gap-2"
                    >
                        {isPending ? (
                            <>
                                <svg
                                    className="animate-spin -ml-1 h-4 w-4 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                                กำลังสร้าง...
                            </>
                        ) : (
                            "ยืนยันการสร้าง"
                        )}
                    </button>
                )}
            </div>
        </div>
    );
}
