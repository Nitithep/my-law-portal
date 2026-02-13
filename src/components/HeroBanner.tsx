"use client";

import { useState, useEffect, useCallback } from "react";

const slides = [
    {
        id: 1,
        bg: "from-[#1a3c7b] to-[#2b5ea7]",
        icon: "🏛️",
        title: "สร้างโอกาสด้วยการรับฟัง",
        subtitle: "แพลตฟอร์มกลางสำหรับประชาชน ร่วมแสดงความคิดเห็นต่อร่างกฎหมาย",
        accent: "bg-white/20",
    },
    {
        id: 2,
        bg: "from-[#2b5ea7] to-[#4a90d9]",
        icon: "📋",
        title: "ร่างกฎหมายใหม่เปิดรับฟัง",
        subtitle: "พ.ร.บ.คุ้มครองข้อมูลส่วนบุคคล และ พ.ร.บ.ส่งเสริมพลังงานสะอาด",
        accent: "bg-white/15",
    },
    {
        id: 3,
        bg: "from-[#15325f] to-[#1a3c7b]",
        icon: "⚖️",
        title: "แนวทางการปฏิรูปกฎหมาย",
        subtitle: "ประชาชนสามารถค้นหาข้อมูลกฎหมายรับฟังความคิดเห็นได้ที่นี่",
        accent: "bg-white/10",
    },
];

export function HeroBanner() {
    const [current, setCurrent] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const next = useCallback(() => {
        setCurrent((prev) => (prev + 1) % slides.length);
    }, []);

    useEffect(() => {
        if (isPaused) return;
        const timer = setInterval(next, 5000);
        return () => clearInterval(timer);
    }, [isPaused, next]);

    return (
        <div
            className="relative w-full overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {/* Slides */}
            <div className="relative h-[200px] md:h-[240px]">
                {slides.map((slide, index) => (
                    <div
                        key={slide.id}
                        className={`absolute inset-0 flex items-center transition-all duration-700 ease-in-out bg-gradient-to-r ${slide.bg} ${index === current
                                ? "opacity-100 translate-x-0"
                                : index < current
                                    ? "opacity-0 -translate-x-full"
                                    : "opacity-0 translate-x-full"
                            }`}
                    >
                        {/* Decorative circles */}
                        <div className={`absolute -right-10 -top-10 w-60 h-60 rounded-full ${slide.accent} blur-sm`} />
                        <div className={`absolute -left-20 -bottom-20 w-80 h-80 rounded-full ${slide.accent} blur-sm`} />

                        <div className="container mx-auto px-4 relative z-10">
                            <div className="flex items-center gap-6 max-w-3xl">
                                {/* Icon */}
                                <div className="hidden md:flex items-center justify-center h-20 w-20 rounded-2xl bg-white/15 backdrop-blur-sm text-4xl flex-shrink-0 shadow-lg border border-white/20">
                                    {slide.icon}
                                </div>

                                {/* Text */}
                                <div>
                                    <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-2 leading-tight">
                                        {slide.title}
                                    </h2>
                                    <p className="text-sm md:text-base text-blue-100/90 leading-relaxed max-w-lg">
                                        {slide.subtitle}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrent(index)}
                        className={`h-2 rounded-full transition-all duration-300 ${index === current
                                ? "bg-white w-6"
                                : "bg-white/40 w-2 hover:bg-white/60"
                            }`}
                    />
                ))}
            </div>

            {/* Nav arrows */}
            <button
                onClick={() => setCurrent((prev) => (prev - 1 + slides.length) % slides.length)}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 h-8 w-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors backdrop-blur-sm"
            >
                ‹
            </button>
            <button
                onClick={() => next()}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 h-8 w-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors backdrop-blur-sm"
            >
                ›
            </button>
        </div>
    );
}
