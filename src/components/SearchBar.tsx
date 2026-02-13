"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

const hashtags = [
    { label: "#ล่าสุด", param: "sort", value: "latest" },
    { label: "#ตอบมากที่สุด", param: "sort", value: "popular" },
    { label: "#ความคืบหน้า", param: "sort", value: "progress" },
    { label: "#ประเมินผลสัมฤทธิ์", param: "sort", value: "results" },
];

export function SearchBar({ totalResults }: { totalResults: number }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [query, setQuery] = useState(searchParams.get("q") || "");
    const [isPending, startTransition] = useTransition();
    const activeSort = searchParams.get("sort") || "";

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams(searchParams.toString());
        if (query.trim()) {
            params.set("q", query.trim());
        } else {
            params.delete("q");
        }
        startTransition(() => {
            router.push(`/?${params.toString()}`);
        });
    };

    const handleHashtag = (param: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (params.get(param) === value) {
            params.delete(param);
        } else {
            params.set(param, value);
        }
        startTransition(() => {
            router.push(`/?${params.toString()}`);
        });
    };

    const clearSearch = () => {
        setQuery("");
        startTransition(() => {
            router.push("/");
        });
    };

    return (
        <div className="bg-white border-b border-gray-100">
            <div className="container mx-auto px-4 py-5">
                {/* Search Input */}
                <form onSubmit={handleSearch} className="relative max-w-3xl mx-auto">
                    <div className="flex items-center bg-gray-50 border-2 border-gray-200 rounded-full overflow-hidden focus-within:border-[#2b5ea7] focus-within:ring-2 focus-within:ring-[#2b5ea7]/10 transition-all">
                        <div className="pl-4 text-gray-400">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="พิมพ์คำค้นหากฎหมาย..."
                            className="flex-1 px-3 py-3 text-sm bg-transparent outline-none placeholder:text-gray-400"
                        />
                        {query && (
                            <button
                                type="button"
                                onClick={clearSearch}
                                className="px-2 text-gray-400 hover:text-gray-600"
                            >
                                ✕
                            </button>
                        )}
                        <button
                            type="submit"
                            disabled={isPending}
                            className="h-full px-5 py-3 bg-[#2b5ea7] hover:bg-[#1a3c7b] text-white transition-colors flex items-center gap-1.5"
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>
                    </div>
                </form>

                {/* Hashtag Chips */}
                <div className="flex flex-wrap items-center gap-2 mt-3 max-w-3xl mx-auto">
                    {hashtags.map((tag) => (
                        <button
                            key={tag.value}
                            onClick={() => handleHashtag(tag.param, tag.value)}
                            className={`px-3 py-1 text-xs font-medium rounded-full border transition-all ${activeSort === tag.value
                                    ? "bg-[#2b5ea7] text-white border-[#2b5ea7] shadow-sm"
                                    : "bg-white text-[#2b5ea7] border-[#2b5ea7]/30 hover:bg-[#2b5ea7]/5 hover:border-[#2b5ea7]/50"
                                }`}
                        >
                            {tag.label}
                        </button>
                    ))}
                </div>

                {/* Results count */}
                <div className="mt-4 max-w-3xl mx-auto">
                    <p className="text-sm text-gray-500">
                        ผลการค้นหา ={" "}
                        <span className="font-semibold text-[#1a3c7b]">{totalResults}</span>{" "}
                        รายการ
                    </p>
                </div>
            </div>
        </div>
    );
}
