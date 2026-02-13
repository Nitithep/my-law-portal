"use client";

type StatusBadgeProps = {
    status: "OPEN" | "CLOSED";
};

export function StatusBadge({ status }: StatusBadgeProps) {
    if (status === "OPEN") {
        return (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                กำลังเปิดรับฟัง
            </span>
        );
    }

    return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold rounded-full bg-gray-100 text-gray-500 border border-gray-200">
            <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
            ปิดรับฟังแล้ว
        </span>
    );
}
