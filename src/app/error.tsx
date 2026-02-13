"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <h1 className="text-6xl mb-4">😵</h1>
            <h2 className="text-2xl font-bold text-gray-800">เกิดข้อผิดพลาดบางอย่าง</h2>
            <p className="text-gray-500 mt-2 max-w-md">
                ระบบไม่สามารถดำเนินการตามคำขอของคุณได้ในขณะนี้
                กรุณาลองใหม่อีกครั้ง
            </p>
            <div className="flex gap-4 mt-8">
                <Button onClick={() => reset()} variant="outline">
                    ลองใหม่
                </Button>
                <Button onClick={() => window.location.href = "/"} className="bg-[#1a3c7b] hover:bg-[#15325f]">
                    กลับสู่หน้าแรก
                </Button>
            </div>
        </div>
    );
}
