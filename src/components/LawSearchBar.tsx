"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function LawSearchBar() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [query, setQuery] = useState(searchParams.get("q") || "");

    const handleSearch = () => {
        if (query.trim()) {
            router.push(`/?q=${encodeURIComponent(query)}`);
        } else {
            router.push("/");
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    const tags = [
        { label: "#ล่าสุด", color: "bg-blue-50 text-blue-600" },
        { label: "#ตอบมากที่สุด", color: "bg-red-50 text-red-600" },
        { label: "#ความคืบหน้า", color: "bg-green-50 text-green-600" },
        { label: "#ประเมินผลสัมฤทธิ์", color: "bg-gray-100 text-gray-600" },
    ];

    return (
        <div className="mb-10">
            <div className="relative max-w-4xl mx-auto">
                <div className="relative group">
                    <input
                        type="text"
                        placeholder="พิมพ์คำค้นหากฎหมาย"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="w-full h-14 pl-6 pr-16 rounded-full border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1a3c7b]/20 focus:border-[#1a3c7b] text-gray-700 placeholder:text-gray-400 text-lg transition-all"
                    />
                    <button
                        onClick={handleSearch}
                        className="absolute right-2 top-2 h-10 w-10 bg-[#1a3c7b] rounded-full flex items-center justify-center text-white hover:bg-[#15325f] transition-colors shadow-sm"
                    >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </button>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
                    {tags.map((tag, idx) => (
                        <button
                            key={idx}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-transform hover:scale-105 ${tag.color}`}
                        >
                            {tag.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
