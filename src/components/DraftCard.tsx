import Link from "next/link";
import { StatusBadge } from "@/components/StatusBadge";

type DraftCardProps = {
    id: string;
    title: string;
    description: string;
    agency: string;
    status: "OPEN" | "CLOSED";
    startDate: Date;
    endDate: Date;
    sectionCount: number;
    voteCount?: number;
    commentCount?: number;
};

export function DraftCard({
    id,
    title,
    description,
    agency,
    status,
    startDate,
    endDate,
    sectionCount,
    voteCount = 0,
    commentCount = 0,
}: DraftCardProps) {
    const formatDate = (d: Date) =>
        new Date(d).toLocaleDateString("th-TH", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });

    const now = new Date();
    const end = new Date(endDate);
    const start = new Date(startDate);
    const totalDays = Math.max(1, (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const elapsedDays = (now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
    const progress = Math.min(100, Math.max(0, (elapsedDays / totalDays) * 100));
    const daysLeft = Math.max(0, Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

    return (
        <Link href={`/drafts/${id}`} className="block group">
            <div className="bg-white rounded-xl border border-gray-200 hover:border-[#2b5ea7]/40 hover:shadow-lg transition-all duration-300 overflow-hidden">
                {/* Top accent */}
                <div
                    className={`h-1 w-full ${status === "OPEN"
                            ? "bg-gradient-to-r from-[#2b9e76] to-[#34c38f]"
                            : "bg-gray-300"
                        }`}
                />

                <div className="p-4 md:p-5">
                    {/* Header: status + agency */}
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <StatusBadge status={status} />
                            {status === "OPEN" && daysLeft > 0 && (
                                <span className="text-[11px] text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full font-medium">
                                    เหลือ {daysLeft} วัน
                                </span>
                            )}
                        </div>
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            {agency}
                        </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-semibold text-gray-800 group-hover:text-[#1a3c7b] transition-colors leading-snug mb-2 line-clamp-2">
                        {title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed mb-4">
                        {description}
                    </p>

                    {/* Meta row */}
                    <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                        <span className="flex items-center gap-1">
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {formatDate(startDate)} — {formatDate(endDate)}
                        </span>
                        <span className="flex items-center gap-1">
                            📋 {sectionCount} มาตรา
                        </span>
                        {voteCount > 0 && (
                            <span className="flex items-center gap-1">
                                🗳️ {voteCount} โหวต
                            </span>
                        )}
                        {commentCount > 0 && (
                            <span className="flex items-center gap-1">
                                💬 {commentCount} ความเห็น
                            </span>
                        )}
                    </div>

                    {/* Progress bar */}
                    {status === "OPEN" && (
                        <div>
                            <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                                <span>ระยะเวลารับฟัง</span>
                                <span>{Math.round(progress)}%</span>
                            </div>
                            <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
                                <div
                                    className="h-full rounded-full bg-gradient-to-r from-[#2b9e76] to-[#34c38f] transition-all duration-500"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
}
