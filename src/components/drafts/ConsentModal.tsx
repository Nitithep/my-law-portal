"use client";

import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function ConsentModal() {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        // Check if consent has been given in this session
        const hasConsented = sessionStorage.getItem("law-portal-consent");
        if (!hasConsented) {
            // Small delay for better UX
            const timer = setTimeout(() => setOpen(true), 500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        sessionStorage.setItem("law-portal-consent", "true");
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-md text-center p-8 [&>button]:hidden">
                <DialogHeader>
                    <DialogTitle className="sr-only">ข้อตกลงการใช้งาน</DialogTitle>
                    <DialogDescription className="sr-only">
                        คำชี้แจงเกี่ยวกับนโยบายความเป็นส่วนตัวและการเก็บข้อมูล
                    </DialogDescription>
                </DialogHeader>
                <div className="flex justify-center mb-4">
                    <div className="h-16 w-16 rounded-full bg-orange-100 flex items-center justify-center">
                        <span className="text-4xl text-orange-400">!</span>
                    </div>
                </div>

                <div className="space-y-4">
                    <p className="text-gray-600 leading-relaxed text-sm">
                        ระบบกลางไม่มีนโยบายให้หน่วยงานที่มารับฟังความคิดเห็น
                        ขอข้อมูลส่วนบุคคลจากผู้ตอบแบบสอบถาม หากหน่วยงาน
                        ถามคำถามเพื่อขอข้อมูลส่วนบุคคล ท่านมีสิทธิที่จะไม่ตอบ
                        คำถามนั้น
                    </p>
                </div>

                <DialogFooter className="sm:justify-center mt-6">
                    <Button
                        type="button"
                        onClick={handleAccept}
                        className="bg-[#1a3c7b] hover:bg-[#15325f] text-white px-8 min-w-[120px]"
                    >
                        ตกลง
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
