"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

type HearingSummaryModalProps = {
    summary: string;
    draftTitle: string;
    children: React.ReactNode;
};

export function HearingSummaryModal({ summary, draftTitle, children }: HearingSummaryModalProps) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-[#1a3c7b] text-lg font-bold flex items-center gap-2">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        สรุปผลการรับฟัง
                    </DialogTitle>
                    <DialogDescription className="text-sm text-gray-500 mt-1">
                        {draftTitle}
                    </DialogDescription>
                </DialogHeader>

                <div className="mt-4 space-y-4">
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm">
                            {summary}
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
