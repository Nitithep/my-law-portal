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
    category?: string;
    draftType?: string | null;
    hearingRound?: number;
    image?: string | null;
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
    category = "ทั่วไป",
    draftType = "พระราชบัญญัติ",
    hearingRound = 1,
    image,
}: DraftCardProps) {
    const formatDate = (d: Date) =>
        new Date(d).toLocaleDateString("th-TH", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });

    // Calculate progress
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    const totalDuration = end.getTime() - start.getTime();
    const elapsed = now.getTime() - start.getTime();
    const progressPercent = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
    const daysLeft = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    // Icon Mapping based on category
    const getIcon = (cat: string) => {
        // Default to "Bus" icon as requested for the example style
        return (
            <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.4 1.5-1.4 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z" />
            </svg>
        );
    };

    // Ensure values have defaults if they come in as null/undefined
    const displayCategory = category || "ทั่วไป";
    const displayRound = hearingRound || 1;
    const displayType = draftType || "พระราชบัญญัติ";

    return (
        <div className="bg-white rounded-xl border border-gray-100 hover:shadow-md transition-all duration-300 relative group overflow-hidden p-5">

            {/* Heart Button */}
            <button className="absolute top-5 right-5 text-gray-300 hover:text-red-500 transition-colors z-10">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
            </button>

            <div className="flex gap-5">
                {/* Left: Icon & Agency Badge */}
                <div className="flex flex-col items-center gap-2 flex-shrink-0 w-20">
                    <div className="h-16 w-16 rounded-full bg-[#1a3c7b] flex items-center justify-center text-white shadow-sm border-4 border-blue-50">
                        {getIcon(displayCategory)}
                    </div>
                    <div className="px-2 py-0.5 bg-gray-100 rounded-full border border-gray-200 w-full text-center">
                        <span className="text-[10px] font-bold text-[#1a3c7b] block truncate">
                            {agency.split(" ")[0]}
                        </span>
                    </div>
                </div>

                {/* Right: Content */}
                <div className="flex-1 min-w-0 pt-1">
                    <Link href={`/drafts/${id}`} className="block pr-8">
                        <h3 className="text-lg font-bold text-[#1a3c7b] hover:underline mb-3 line-clamp-1">
                            {title}
                        </h3>
                    </Link>

                    {/* Metadata Row 1: Category | Co-sponsors | Round */}
                    <div className="flex items-center gap-4 mb-4 text-xs font-medium text-gray-600">
                        <div className="flex items-center gap-1.5">
                            <span className="text-gray-400">
                                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12zM10 9h8v2h-8zm0 3h4v2h-4zm0-6h8v2h-8z" />
                                </svg>
                            </span>
                            {displayCategory}
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="text-gray-400">
                                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                                </svg>
                            </span>
                            ร่วมเสนอ {voteCount + 79}
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="text-gray-400">
                                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                                </svg>
                            </span>
                            ครั้งที่ {displayRound}
                        </div>
                    </div>

                    {/* Metadata Row 2: Type | Date | Progress | Date | Expand */}
                    <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-100 pt-3">
                        {/* Left Side: Type & Start Date */}
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1 text-[#1a3c7b] font-bold">
                                <svg className="h-3.5 w-3.5 transform -rotate-45" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z" />
                                </svg>
                                {displayType}
                            </div>
                            <div className="flex items-center gap-1">
                                <svg className="h-3.5 w-3.5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2zm-7 5h5v5h-5z" />
                                </svg>
                                {formatDate(startDate)}
                            </div>
                        </div>

                        {/* Center: Progress Bar */}
                        <div className="flex-1 mx-3 max-w-[120px] relative group cursor-help">
                            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full ${daysLeft > 0 ? 'bg-gray-500' : 'bg-red-500'}`}
                                    style={{ width: `${progressPercent}%` }}
                                />
                            </div>
                            {daysLeft > 0 && <div className="absolute -top-1 left-1/2 -translate-x-1/2 -translate-y-full bg-green-600 text-white text-[9px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap mb-1">
                                เหลือ {daysLeft} วัน
                            </div>}
                        </div>

                        {/* Right Side: End Date & Expand */}
                        <div className="flex items-center gap-3">
                            <div>
                                {formatDate(endDate)}
                            </div>
                            <Link href={`/drafts/${id}`} className="flex items-center gap-1 text-[#1a3c7b] font-bold hover:underline">
                                <span className="bg-[#1a3c7b] text-white text-[10px] px-1.5 py-0.5 rounded">
                                    {sectionCount}
                                </span>
                                ขยาย
                                <div className="h-5 w-5 rounded-full bg-blue-50 flex items-center justify-center text-[#1a3c7b]">
                                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
