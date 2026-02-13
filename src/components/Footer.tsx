import Link from "next/link";

export function Footer() {
    return (
        <footer className="bg-white border-t border-gray-200 py-12 text-sm text-gray-500">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div className="col-span-1 md:col-span-2 space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-[#1a3c7b] shadow-sm">
                                <svg viewBox="0 0 24 24" className="h-4 w-4 text-white" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 3L3 7v2h18V7L12 3z" />
                                    <path d="M5 9v8h2V9M10 9v8h2V9M17 9v8h2V9" />
                                    <path d="M3 17h18v2H3z" />
                                </svg>
                            </div>
                            <span className="text-lg font-bold text-[#1a3c7b]">LAW Portal</span>
                        </div>
                        <p className="max-w-md leading-relaxed">
                            ระบบกลางทางกฎหมาย เป็นแพลตฟอร์มสำหรับรับฟังความคิดเห็นจากประชาชนต่อร่างกฎหมาย
                            ตามมาตรา 77 ของรัฐธรรมนูญแห่งราชอาณาจักรไทย
                            เพื่อการมีส่วนร่วมที่โปร่งใสและตรวจสอบได้
                        </p>
                    </div>

                    <div className="space-y-3">
                        <h4 className="font-semibold text-gray-900">เกี่ยวกับเรา</h4>
                        <ul className="space-y-2">
                            <li><Link href="#" className="hover:text-[#1a3c7b]">ความเป็นมา</Link></li>
                            <li><Link href="#" className="hover:text-[#1a3c7b]">ขั้นตอนการรับฟัง</Link></li>
                            <li><Link href="#" className="hover:text-[#1a3c7b]">หน่วยงานที่เกี่ยวข้อง</Link></li>
                            <li><Link href="#" className="hover:text-[#1a3c7b]">ติดต่อสอบถาม</Link></li>
                        </ul>
                    </div>

                    <div className="space-y-3">
                        <h4 className="font-semibold text-gray-900">นโยบาย</h4>
                        <ul className="space-y-2">
                            <li><Link href="#" className="hover:text-[#1a3c7b]">ข้อกำหนดการใช้งาน</Link></li>
                            <li><Link href="#" className="hover:text-[#1a3c7b]">นโยบายความเป็นส่วนตัว</Link></li>
                            <li><Link href="#" className="hover:text-[#1a3c7b]">การคุ้มครองข้อมูลส่วนบุคคล</Link></li>
                            <li><Link href="/admin" className="hover:text-[#1a3c7b]">สำหรับเจ้าหน้าที่</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p>© 2024 Law Portal. สงวนลิขสิทธิ์.</p>
                    <div className="flex gap-4">
                        <Link href="#" className="text-gray-400 hover:text-[#1a3c7b]">
                            <span className="sr-only">Facebook</span>
                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" /></svg>
                        </Link>
                        <Link href="#" className="text-gray-400 hover:text-[#1a3c7b]">
                            <span className="sr-only">Twitter</span>
                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" /></svg>
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
