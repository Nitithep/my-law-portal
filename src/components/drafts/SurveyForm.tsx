"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { submitSurvey, SurveySubmission } from "@/actions/survey-actions";
import { useRouter } from "next/navigation";
import ReCAPTCHA from "react-google-recaptcha";

type Question = {
    id: string;
    question: string;
    order: number;
};

type SurveyFormProps = {
    draftId: string;
    title: string;
    description: string;
    questions: Question[];
};

function getSessionId(): string {
    if (typeof window === "undefined") return "";
    let sid = sessionStorage.getItem("survey-session-id");
    if (!sid) {
        sid = crypto.randomUUID();
        sessionStorage.setItem("survey-session-id", sid);
    }
    return sid;
}

export function SurveyForm({ draftId, title, description, questions }: SurveyFormProps) {
    const router = useRouter();
    const [answers, setAnswers] = useState<Record<string, "AGREE" | "DISAGREE">>({});
    const [comments, setComments] = useState<Record<string, string>>({});
    const [showComments, setShowComments] = useState<Record<string, boolean>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [captchaToken, setCaptchaToken] = useState<string | null>(null);
    const recaptchaRef = useRef<ReCAPTCHA>(null);
    const [sessionId, setSessionId] = useState("");

    useEffect(() => {
        setSessionId(getSessionId());
    }, []);

    const answeredCount = Object.keys(answers).length;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (answeredCount === 0) {
            alert("กรุณาตอบอย่างน้อย 1 ข้อ");
            return;
        }

        if (!captchaToken) {
            alert("กรุณายืนยัน CAPTCHA ก่อนส่งแบบสอบถาม");
            return;
        }

        setIsSubmitting(true);

        // Only send answered questions
        const submissions: SurveySubmission[] = Object.entries(answers).map(([qId, answer]) => ({
            questionId: qId,
            answer,
            comment: comments[qId],
        }));

        const result = await submitSurvey(draftId, submissions, sessionId, captchaToken);

        if (result.success) {
            alert("ขอบคุณสำหรับความคิดเห็นของท่าน");
            router.refresh();
        } else {
            alert(result.error || "เกิดข้อผิดพลาดในการส่งข้อมูล");
            // Reset captcha on error
            recaptchaRef.current?.reset();
            setCaptchaToken(null);
        }

        setIsSubmitting(false);
    };

    if (questions.length === 0) {
        return (
            <div className="text-center py-16 text-gray-500 bg-gray-50 rounded-xl border-dashed border-2 border-gray-200">
                <svg className="h-12 w-12 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                <p>ยังไม่มีแบบสำรวจสำหรับร่างกฎหมายนี้</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Survey header */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-3">
                <h3 className="text-[#1a3c7b] font-bold text-lg leading-relaxed">
                    {title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                    {description}
                </p>
            </div>

            {/* Questions */}
            {questions.map((q) => (
                <div key={q.id} className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
                    <h4 className="font-semibold text-[#1a3c7b] leading-relaxed">
                        {q.order}. {q.question}
                    </h4>

                    <div className="space-y-3 pl-4">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${answers[q.id] === "AGREE"
                                    ? "border-[#1a3c7b] bg-[#1a3c7b]"
                                    : "border-gray-300 group-hover:border-[#1a3c7b]/50"
                                }`}>
                                {answers[q.id] === "AGREE" && (
                                    <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </div>
                            <input
                                type="radio"
                                name={q.id}
                                value="AGREE"
                                checked={answers[q.id] === "AGREE"}
                                onChange={() => setAnswers({ ...answers, [q.id]: "AGREE" })}
                                className="sr-only"
                            />
                            <span className="text-gray-700 group-hover:text-[#1a3c7b] transition-colors">เห็นด้วย</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${answers[q.id] === "DISAGREE"
                                    ? "border-[#1a3c7b] bg-[#1a3c7b]"
                                    : "border-gray-300 group-hover:border-[#1a3c7b]/50"
                                }`}>
                                {answers[q.id] === "DISAGREE" && (
                                    <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </div>
                            <input
                                type="radio"
                                name={q.id}
                                value="DISAGREE"
                                checked={answers[q.id] === "DISAGREE"}
                                onChange={() => setAnswers({ ...answers, [q.id]: "DISAGREE" })}
                                className="sr-only"
                            />
                            <span className="text-gray-700 group-hover:text-[#1a3c7b] transition-colors">ไม่เห็นด้วย</span>
                        </label>
                    </div>

                    {/* Collapsible comment area */}
                    <div className="space-y-2 mt-4">
                        <button
                            type="button"
                            onClick={() => setShowComments(prev => ({ ...prev, [q.id]: !prev[q.id] }))}
                            className="flex items-center gap-2 text-sm text-[#1a3c7b] font-medium hover:underline"
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            เขียนความคิดเห็น
                        </button>

                        {showComments[q.id] && (
                            <textarea
                                className="w-full p-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a3c7b]/20 focus:border-[#1a3c7b] transition-all placeholder:text-gray-300 animate-in slide-in-from-top-2 duration-200"
                                rows={3}
                                placeholder="แสดงความคิดเห็นเพิ่มเติม..."
                                value={comments[q.id] || ""}
                                onChange={(e) => setComments({ ...comments, [q.id]: e.target.value })}
                            />
                        )}
                    </div>
                </div>
            ))}

            {/* Progress counter */}
            <div className="flex items-center justify-center pt-2">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <div className="flex items-center gap-1.5">
                        <div className={`w-2 h-2 rounded-full ${answeredCount > 0 ? "bg-[#2b9e76]" : "bg-gray-300"}`} />
                        <span className="font-medium">
                            {answeredCount}/{questions.length} คำถาม
                        </span>
                    </div>
                    {answeredCount === questions.length && (
                        <span className="text-[#2b9e76] text-xs font-medium">✓ ตอบครบแล้ว</span>
                    )}
                </div>
            </div>

            {/* reCAPTCHA */}
            <div className="flex justify-center py-2">
                <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
                    onChange={(token) => setCaptchaToken(token)}
                    onExpired={() => setCaptchaToken(null)}
                />
            </div>

            {/* Submit */}
            <div className="flex justify-center">
                <Button
                    type="submit"
                    className="w-full max-w-md bg-[#2b9e76] hover:bg-[#249068] text-white px-8 py-3 rounded-lg font-medium shadow-sm transition-all text-base"
                    disabled={isSubmitting || answeredCount === 0 || !captchaToken}
                >
                    {isSubmitting ? "กำลังส่งข้อมูล..." : "ส่งความคิดเห็น"}
                </Button>
            </div>
        </form>
    );
}
