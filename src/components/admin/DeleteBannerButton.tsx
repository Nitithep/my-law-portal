"use client";

import { useState } from "react";
import { deleteBanner } from "@/actions/banner-actions";
import { useRouter } from "next/navigation";

export default function DeleteBannerButton({ id }: { id: string }) {
    const [isPending, setIsPending] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        if (!confirm("คุณต้องการลบแบนเนอร์นี้ใช่หรือไม่?")) return;

        setIsPending(true);
        try {
            await deleteBanner(id);
            router.refresh();
        } catch (error) {
            alert("เกิดข้อผิดพลาดในการลบ");
        } finally {
            setIsPending(false);
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isPending}
            className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors disabled:opacity-50"
        >
            {isPending ? "กำลังลบ..." : "ลบ"}
        </button>
    );
}
