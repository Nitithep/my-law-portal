"use client";

import { useState, useEffect } from "react";

type CookieCategory = {
    id: string;
    label: string;
    required: boolean;
    enabled: boolean;
    icon: "required" | "analytics" | "functional";
};

const defaultCategories: CookieCategory[] = [
    {
        id: "necessary",
        label: "คุกกี้ที่มีความจำเป็นอย่างเคร่งครัด",
        required: true,
        enabled: true,
        icon: "required",
    },
    {
        id: "analytics",
        label: "คุกกี้เพื่อประสิทธิภาพหรือคุกกี้เพื่อการวิเคราะห์",
        required: false,
        enabled: false,
        icon: "analytics",
    },
    {
        id: "functional",
        label: "คุกกี้เพื่อฟังก์ชั่น",
        required: false,
        enabled: false,
        icon: "functional",
    },
];

function CookieIcon({ type }: { type: CookieCategory["icon"] }) {
    if (type === "required") {
        return (
            <div className="h-5 w-5 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                <svg className="h-3 w-3 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            </div>
        );
    }
    return (
        <div className="h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
            <svg className="h-3 w-3 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
        </div>
    );
}

export function CookieConsent() {
    const [visible, setVisible] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [categories, setCategories] = useState(defaultCategories);
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem("cookie-consent");
        if (!consent) {
            // Show banner after a short delay
            const timer = setTimeout(() => setShowBanner(true), 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAcceptAll = () => {
        const updated = categories.map((c) => ({ ...c, enabled: true }));
        setCategories(updated);
        localStorage.setItem("cookie-consent", JSON.stringify(updated));
        setShowBanner(false);
        setVisible(false);
    };

    const handleSave = () => {
        localStorage.setItem("cookie-consent", JSON.stringify(categories));
        setShowBanner(false);
        setVisible(false);
    };

    const toggleCategory = (id: string) => {
        setCategories((prev) =>
            prev.map((c) =>
                c.id === id && !c.required ? { ...c, enabled: !c.enabled } : c
            )
        );
    };

    const openSettings = () => {
        setVisible(true);
        setShowBanner(false);
    };

    return (
        <>
            {/* Initial Banner */}
            {showBanner && (
                <div className="fixed bottom-0 left-0 right-0 z-[100] animate-slide-up">
                    <div className="bg-white border-t border-gray-200 shadow-2xl">
                        <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row items-center gap-4">
                            <div className="flex items-center gap-3 flex-1">
                                <div className="h-10 w-10 rounded-full bg-[#1a3c7b]/10 flex items-center justify-center flex-shrink-0">
                                    <span className="text-xl">🍪</span>
                                </div>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    เว็บไซต์นี้ใช้คุกกี้เพื่อเพิ่มประสิทธิภาพและประสบการณ์ที่ดีในการใช้งาน
                                    คุณสามารถเลือกตั้งค่าความยินยอมได้
                                </p>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <button
                                    onClick={openSettings}
                                    className="px-4 py-2 text-sm font-medium text-[#1a3c7b] border border-[#1a3c7b]/30 rounded-lg hover:bg-[#1a3c7b]/5 transition-colors"
                                >
                                    ตั้งค่า
                                </button>
                                <button
                                    onClick={handleAcceptAll}
                                    className="px-5 py-2 text-sm font-semibold text-white bg-[#1a3c7b] rounded-lg hover:bg-[#15325f] transition-colors shadow-sm"
                                >
                                    ยอมรับทั้งหมด
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Detail Modal */}
            {visible && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={() => setVisible(false)}
                    />

                    {/* Modal */}
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in">
                        {/* Header */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                            <h3 className="text-base font-bold text-[#1a3c7b]">
                                สรุปความยินยอมทั้งหมด
                            </h3>
                            <button
                                onClick={() => setVisible(false)}
                                className="h-8 w-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                            >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Content */}
                        <div className="px-5 py-4">
                            <p className="text-xs font-semibold text-gray-500 mb-3">
                                สถานะความยินยอมของคุณ
                            </p>

                            {/* Cookie Categories */}
                            <div className="space-y-3">
                                {categories.map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => toggleCategory(cat.id)}
                                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${cat.enabled
                                                ? "bg-emerald-50/50 border border-emerald-100"
                                                : "bg-gray-50 border border-gray-100 hover:bg-gray-100"
                                            } ${cat.required ? "cursor-default" : "cursor-pointer"}`}
                                    >
                                        <CookieIcon type={cat.icon} />
                                        <span className="text-sm text-gray-700 leading-snug">
                                            {cat.label}
                                        </span>
                                        {/* Toggle indicator */}
                                        <div className="ml-auto flex-shrink-0">
                                            <div
                                                className={`h-5 w-9 rounded-full transition-colors relative ${cat.enabled ? "bg-emerald-500" : "bg-gray-300"
                                                    } ${cat.required ? "opacity-60" : ""}`}
                                            >
                                                <div
                                                    className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${cat.enabled ? "translate-x-4" : "translate-x-0.5"
                                                        }`}
                                                />
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>

                            {/* Show details link */}
                            <button
                                onClick={() => setShowDetails(!showDetails)}
                                className="mt-3 text-xs text-[#2b5ea7] hover:text-[#1a3c7b] underline underline-offset-2 transition-colors"
                            >
                                {showDetails ? "ซ่อนรายละเอียดความยินยอม" : "แสดงรายละเอียดความยินยอม"}
                            </button>

                            {showDetails && (
                                <div className="mt-3 p-3 bg-gray-50 rounded-xl text-xs text-gray-500 leading-relaxed space-y-2">
                                    <p>
                                        <strong>คุกกี้ที่จำเป็น:</strong> ใช้สำหรับการทำงานพื้นฐานของเว็บไซต์
                                        เช่น การจัดการ session และความปลอดภัย
                                    </p>
                                    <p>
                                        <strong>คุกกี้เพื่อการวิเคราะห์:</strong> ช่วยให้เราเข้าใจ
                                        พฤติกรรมการใช้งานเว็บไซต์เพื่อปรับปรุงประสิทธิภาพ
                                    </p>
                                    <p>
                                        <strong>คุกกี้เพื่อฟังก์ชั่น:</strong> ช่วยจดจำการตั้งค่า
                                        และปรับแต่งประสบการณ์การใช้งาน
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Footer Actions */}
                        <div className="px-5 pb-5 space-y-2">
                            <button
                                onClick={handleSave}
                                className="w-full py-3 text-sm font-bold text-white bg-[#1a3c7b] rounded-xl hover:bg-[#15325f] transition-colors shadow-sm"
                            >
                                เปลี่ยนแปลงความยินยอม
                            </button>
                            <button
                                onClick={() => setVisible(false)}
                                className="w-full py-2 text-xs font-medium text-gray-500 hover:text-[#1a3c7b] transition-colors"
                            >
                                นโยบายคุกกี้
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Floating Cookie Button (always visible after consent) */}
            {!showBanner && !visible && (
                <button
                    onClick={openSettings}
                    className="fixed bottom-5 right-5 z-[90] h-12 w-12 rounded-full bg-white border border-gray-200 shadow-lg hover:shadow-xl flex items-center justify-center transition-all hover:scale-110 group"
                    title="ตั้งค่าคุกกี้"
                >
                    <span className="text-xl group-hover:animate-bounce">🍪</span>
                </button>
            )}
        </>
    );
}
