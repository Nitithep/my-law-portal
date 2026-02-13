"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

const statusOptions = [
    { label: "ทั้งหมด", value: "" },
    { label: "กำลังเปิดรับฟัง", value: "OPEN" },
    { label: "ปิดรับฟังแล้ว", value: "CLOSED" },
];

const draftTypeOptions = [
    { label: "ทั้งหมด", value: "" },
    { label: "ร่างกฎหมาย", value: "draft" },
    { label: "ประเมินผลสัมฤทธิ์", value: "evaluation" },
];

export function FilterSidebar({ agencies }: { agencies: string[] }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const activeStatus = searchParams.get("status") || "";
    const activeAgency = searchParams.get("agency") || "";
    const activeDept = searchParams.get("dept") || "";
    const activeType = searchParams.get("type") || "";

    const handleFilter = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        startTransition(() => {
            router.push(`/?${params.toString()}`);
        });
    };

    const clearFilters = () => {
        startTransition(() => {
            const q = searchParams.get("q");
            router.push(q ? `/?q=${q}` : "/");
        });
    };

    const hasActiveFilters = activeStatus || activeAgency || activeDept || activeType;

    return (
        <div
            className={`bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden ${isPending ? "opacity-70 pointer-events-none" : ""
                }`}
        >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
                    <svg
                        className="h-4 w-4 text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                        />
                    </svg>
                    ตัวกรอง
                </div>
                {hasActiveFilters && (
                    <button
                        onClick={clearFilters}
                        className="flex items-center gap-1.5 text-xs text-[#2b5ea7] hover:text-[#1a3c7b] font-semibold transition-colors"
                    >
                        <svg
                            className="h-3.5 w-3.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2.5"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                        </svg>
                        ล้าง
                    </button>
                )}
            </div>

            <div className="h-px bg-gray-100" />

            {/* Filters */}
            <div className="p-5 space-y-5">
                {/* สถานะการรับฟัง */}
                <FilterDropdown
                    label="สถานะการรับฟัง"
                    value={activeStatus}
                    onChange={(v) => handleFilter("status", v)}
                    options={statusOptions}
                />

                {/* กระทรวง / หน่วยงานอิสระ */}
                <FilterDropdown
                    label="กระทรวง / หน่วยงานอิสระ"
                    value={activeAgency}
                    onChange={(v) => handleFilter("agency", v)}
                    options={[
                        { label: "ทั้งหมด", value: "" },
                        ...agencies.map((a) => ({ label: a, value: a })),
                    ]}
                />

                {/* กรม */}
                <FilterDropdown
                    label="กรม"
                    value={activeDept}
                    onChange={(v) => handleFilter("dept", v)}
                    options={[{ label: "ทั้งหมด", value: "" }]}
                />

                {/* ร่างกฎหมาย / ประเมินผลสัมฤทธิ์ */}
                <FilterDropdown
                    label="ร่างกฎหมาย / ประเมินผลสัมฤทธิ์"
                    value={activeType}
                    onChange={(v) => handleFilter("type", v)}
                    options={draftTypeOptions}
                />
            </div>
        </div>
    );
}

function FilterDropdown({
    label,
    value,
    onChange,
    options,
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    options: { label: string; value: string }[];
}) {
    return (
        <div>
            <label className="block text-xs font-semibold text-gray-600 mb-2">
                {label}
            </label>
            <div className="relative">
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-white hover:border-gray-300 focus:border-[#2b5ea7] focus:ring-2 focus:ring-[#2b5ea7]/10 outline-none transition-all appearance-none cursor-pointer text-gray-700"
                >
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
                {/* Custom dropdown arrow */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 9l-7 7-7-7"
                        />
                    </svg>
                </div>
            </div>
        </div>
    );
}
