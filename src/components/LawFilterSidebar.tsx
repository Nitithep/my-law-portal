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

export function LawFilterSidebar({ agencies = [] }: { agencies?: string[] }) {
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
        <div className={`bg-white rounded-2xl border border-gray-100 p-5 sticky top-24 ${isPending ? "opacity-70 pointer-events-none" : ""}`}>
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-700 flex items-center gap-2">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                    ตัวกรอง
                </h3>
                {hasActiveFilters && (
                    <button
                        onClick={clearFilters}
                        className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                    >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        ล้าง
                    </button>
                )}
            </div>

            <div className="space-y-4">
                <FilterGroup
                    label="สถานะการรับฟัง"
                    options={statusOptions.map(o => o.label)}
                    values={statusOptions.map(o => o.value)}
                    activeValue={activeStatus}
                    onChange={(v) => handleFilter("status", v)}
                />
                <FilterGroup
                    label="กระทรวง / หน่วยงานอิสระ"
                    options={["ทั้งหมด", ...agencies]}
                    values={["", ...agencies]}
                    activeValue={activeAgency}
                    onChange={(v) => handleFilter("agency", v)}
                />
                <FilterGroup
                    label="กรม"
                    options={["ทั้งหมด"]}
                    values={[""]}
                    activeValue={activeDept}
                    onChange={(v) => handleFilter("dept", v)}
                    disabled
                />
                <FilterGroup
                    label="ร่างกฎหมาย / ประเมินผลสัมฤทธิ์"
                    options={draftTypeOptions.map(o => o.label)}
                    values={draftTypeOptions.map(o => o.value)}
                    activeValue={activeType}
                    onChange={(v) => handleFilter("type", v)}
                />
            </div>
        </div>
    );
}

function FilterGroup({
    label,
    options,
    values = [],
    activeValue = "",
    onChange,
    disabled = false
}: {
    label: string,
    options: string[],
    values?: string[],
    activeValue?: string,
    onChange?: (v: string) => void,
    disabled?: boolean
}) {
    // If values are not provided, assume options are values
    const optionValues = values.length === options.length ? values : options;

    return (
        <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5 ml-1">
                {label}
            </label>
            <div className="relative">
                <select
                    disabled={disabled}
                    value={activeValue}
                    onChange={(e) => onChange && onChange(e.target.value)}
                    className="w-full appearance-none bg-white border border-gray-200 text-gray-700 py-2.5 px-4 pr-8 rounded-xl leading-tight focus:outline-none focus:bg-white focus:border-[#1a3c7b] text-sm disabled:bg-gray-50 disabled:text-gray-400 transition-colors"
                >
                    {options.map((opt, i) => (
                        <option key={i} value={optionValues[i]}>{opt}</option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                </div>
            </div>
        </div>
    );
}
