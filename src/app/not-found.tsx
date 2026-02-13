"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <h1 className="text-9xl font-black text-gray-200">404</h1>
            <div className="bg-[#1a3c7b] text-white text-xs font-bold px-2 py-1 rounded absolute rotate-12 -mt-8 ml-24">
                Page Not Found
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mt-4">ไม่พบหน้าที่คุณต้องการ</h2>
            <p className="text-gray-500 mt-2 max-w-md">
                หน้านี้อาจถูกลบไปแล้ว หรือคุณอาจพิมพ์ URL ผิด
                กรุณาตรวจสอบใหม่อีกครั้ง
            </p>
            <Button asChild className="mt-8 bg-[#1a3c7b] hover:bg-[#15325f]">
                <Link href="/">กลับสู่หน้าแรก</Link>
            </Button>
        </div>
    );
}
