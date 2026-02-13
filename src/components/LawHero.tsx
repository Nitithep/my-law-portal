import Link from "next/link";

export function LawHero() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-8">
            {/* Banner 1: Law Reform Guidelines (Brown) */}
            <div className="md:col-span-5 relative overflow-hidden rounded-2xl bg-[#a07963] text-white p-6 flex flex-col justify-center min-h-[160px] group cursor-pointer shadow-sm hover:shadow-md transition-all">
                <div className="absolute right-0 bottom-0 opacity-20 transform translate-x-1/4 translate-y-1/4">
                    <svg className="w-48 h-48" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
                        <path d="M14 3v5h5" />
                        <path d="M16 13H8" />
                        <path d="M16 17H8" />
                        <path d="M10 9H8" />
                    </svg>
                </div>
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </span>
                        <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider shadow-sm">
                            New
                        </span>
                    </div>
                    <p className="text-sm font-medium opacity-90 mb-0.5">ครม. มีมติเมื่อวันที่ 21 ก.ค. 63 เห็นชอบ</p>
                    <h2 className="text-2xl font-bold tracking-tight">แนวทางการปฏิรูปกฎหมาย</h2>
                </div>
            </div>

            {/* Banner 2: Search Promo (Blue) */}
            <div className="md:col-span-4 relative overflow-hidden rounded-2xl bg-[#cfebfb] text-[#1a3c7b] p-6 flex flex-col justify-center min-h-[160px] group cursor-pointer shadow-sm hover:shadow-md transition-all">
                <div className="absolute top-0 right-0 p-4 opacity-50">
                    <svg className="w-24 h-24 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <div className="relative z-10 text-center">
                    <p className="text-sm font-semibold mb-1">สามารถค้นหาข้อมูลกฎหมายใน</p>
                    <h2 className="text-3xl font-extrabold mb-3 text-[#1a3c7b]">#LAW</h2>
                    <div className="inline-flex items-center bg-white rounded-full px-4 py-1.5 shadow-sm mx-auto text-xs font-medium gap-2">
                        <span>พิมพ์ข้อความ...</span>
                        <span className="text-gray-400">จากปุ่มค้นหา 🔍</span>
                    </div>
                </div>
            </div>

            {/* Banner 3: User Guide (White/Pattern) */}
            <div className="md:col-span-3 relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-100 text-[#1a3c7b] p-6 flex flex-col justify-center min-h-[160px] group cursor-pointer shadow-sm hover:shadow-md transition-all">
                <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
                    <svg width="100%" height="100%">
                        <pattern id="pattern-circles" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                            <circle cx="2" cy="2" r="1" className="text-[#1a3c7b]" fill="currentColor" />
                        </pattern>
                        <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern-circles)" />
                    </svg>
                </div>
                <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="mb-3 p-3 bg-blue-50 rounded-full">
                        <svg className="w-8 h-8 text-[#1a3c7b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                    <h2 className="text-lg font-bold leading-tight">
                        คู่มือการใช้งาน
                        <br />
                        <span className="text-sm font-medium text-gray-500">สำหรับประชาชน</span>
                    </h2>
                </div>
            </div>
        </div>
    );
}
