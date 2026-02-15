"use client";

import { useState } from "react";
import { Check, Copy, Share2 } from "lucide-react";

export function ShareButton({ title, url }: { title: string; url: string }) {
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: title,
                    text: `ร่วมแสดงความคิดเห็นต่อร่างกฎหมาย: ${title}`,
                    url: url,
                });
            } catch (error) {
                console.error("Error sharing:", error);
            }
        } else {
            // Fallback: Copy to clipboard
            try {
                await navigator.clipboard.writeText(url);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch (err) {
                console.error("Failed to copy:", err);
            }
        }
    };

    return (
        <button
            onClick={handleShare}
            className="p-2.5 rounded-full border border-gray-200 text-gray-400 hover:text-[#1a3c7b] hover:border-[#1a3c7b]/30 hover:bg-blue-50 transition-all relative group"
            title="แชร์"
        >
            {copied ? (
                <Check className="h-5 w-5 text-green-500" />
            ) : (
                <Share2 className="h-5 w-5" />
            )}

            {/* Tooltip for desktop only if copy fallback is expected */}
            {copied && (
                <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2 py-1 rounded shadow-lg whitespace-nowrap">
                    คัดลอกลิงก์แล้ว
                </span>
            )}
        </button>
    );
}
