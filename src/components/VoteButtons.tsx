"use client";

import { useState, useTransition, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { castVote, removeVote } from "@/actions/vote-actions";

type VoteButtonsProps = {
    sectionId: string;
    agreeCount: number;
    disagreeCount: number;
    userVote?: "AGREE" | "DISAGREE" | null;
    isOpen: boolean;
};

function getSessionId(): string {
    if (typeof window === "undefined") return "";
    let sid = sessionStorage.getItem("survey-session-id");
    if (!sid) {
        sid = crypto.randomUUID();
        sessionStorage.setItem("survey-session-id", sid);
    }
    return sid;
}

export function VoteButtons({
    sectionId,
    agreeCount,
    disagreeCount,
    userVote,
    isOpen,
}: VoteButtonsProps) {
    const [isPending, startTransition] = useTransition();
    const [optimisticVote, setOptimisticVote] = useState(userVote);
    const [optimisticAgree, setOptimisticAgree] = useState(agreeCount);
    const [optimisticDisagree, setOptimisticDisagree] = useState(disagreeCount);
    const [sessionId, setSessionId] = useState("");

    useEffect(() => {
        setSessionId(getSessionId());
    }, []);

    const total = optimisticAgree + optimisticDisagree;
    const agreePercent = total > 0 ? Math.round((optimisticAgree / total) * 100) : 0;
    const disagreePercent = total > 0 ? 100 - agreePercent : 0;

    const handleVote = (type: "AGREE" | "DISAGREE") => {
        if (!isOpen || !sessionId) return;

        // Optimistic update
        if (optimisticVote === type) {
            // Remove vote
            setOptimisticVote(null);
            if (type === "AGREE") setOptimisticAgree((p) => p - 1);
            else setOptimisticDisagree((p) => p - 1);
            startTransition(() => removeVote(sectionId, sessionId));
        } else {
            // Cast / switch vote
            if (optimisticVote === "AGREE") setOptimisticAgree((p) => p - 1);
            if (optimisticVote === "DISAGREE") setOptimisticDisagree((p) => p - 1);
            setOptimisticVote(type);
            if (type === "AGREE") setOptimisticAgree((p) => p + 1);
            else setOptimisticDisagree((p) => p + 1);
            startTransition(() => castVote(sectionId, type, sessionId));
        }
    };

    return (
        <div className="space-y-3">
            {/* Vote progress bar */}
            {total > 0 && (
                <div className="space-y-1.5">
                    <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-muted">
                        <div
                            className="bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-500"
                            style={{ width: `${agreePercent}%` }}
                        />
                        <div
                            className="bg-gradient-to-r from-rose-400 to-rose-500 transition-all duration-500"
                            style={{ width: `${disagreePercent}%` }}
                        />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>
                            เห็นด้วย {agreePercent}% ({optimisticAgree})
                        </span>
                        <span>
                            ไม่เห็นด้วย {disagreePercent}% ({optimisticDisagree})
                        </span>
                    </div>
                </div>
            )}

            {/* Vote buttons */}
            <div className="flex gap-2">
                <Button
                    onClick={() => handleVote("AGREE")}
                    disabled={!isOpen || isPending}
                    size="sm"
                    variant={optimisticVote === "AGREE" ? "default" : "outline"}
                    className={`flex-1 h-9 text-xs font-medium transition-all ${optimisticVote === "AGREE"
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/20"
                        : "hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300"
                        }`}
                >
                    👍 เห็นด้วย {optimisticAgree > 0 && `(${optimisticAgree})`}
                </Button>
                <Button
                    onClick={() => handleVote("DISAGREE")}
                    disabled={!isOpen || isPending}
                    size="sm"
                    variant={optimisticVote === "DISAGREE" ? "default" : "outline"}
                    className={`flex-1 h-9 text-xs font-medium transition-all ${optimisticVote === "DISAGREE"
                        ? "bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-500/20"
                        : "hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300"
                        }`}
                >
                    👎 ไม่เห็นด้วย {optimisticDisagree > 0 && `(${optimisticDisagree})`}
                </Button>
            </div>
        </div>
    );
}
