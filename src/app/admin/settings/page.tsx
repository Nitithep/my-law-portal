export default function AdminSettingsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-xl font-bold text-gray-800">ตั้งค่า</h1>
                <p className="text-sm text-gray-500 mt-0.5">
                    ตั้งค่าระบบและการแสดงผล
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Site Info */}
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-100">
                        <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                            <span className="text-base">🌐</span>
                            ข้อมูลเว็บไซต์
                        </h3>
                    </div>
                    <div className="p-5 space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-2">
                                ชื่อเว็บไซต์
                            </label>
                            <input
                                type="text"
                                defaultValue="LAW — ระบบกลางทางกฎหมาย"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-[#1a3c7b] focus:ring-2 focus:ring-[#1a3c7b]/10 outline-none transition-all"
                                readOnly
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-2">
                                คำอธิบาย
                            </label>
                            <textarea
                                defaultValue="แพลตฟอร์มสำหรับประชาชนในการเข้าถึง อ่าน และแสดงความคิดเห็นต่อร่างกฎหมาย"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-[#1a3c7b] focus:ring-2 focus:ring-[#1a3c7b]/10 outline-none transition-all resize-none"
                                rows={3}
                                readOnly
                            />
                        </div>
                    </div>
                </div>

                {/* System Info */}
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-100">
                        <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                            <span className="text-base">⚙️</span>
                            ข้อมูลระบบ
                        </h3>
                    </div>
                    <div className="p-5 space-y-3">
                        <div className="flex items-center justify-between py-2 border-b border-gray-50">
                            <span className="text-xs text-gray-500">Framework</span>
                            <span className="text-xs font-medium text-gray-700">Next.js 16</span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-gray-50">
                            <span className="text-xs text-gray-500">Database</span>
                            <span className="text-xs font-medium text-gray-700">PostgreSQL + Prisma</span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-gray-50">
                            <span className="text-xs text-gray-500">Authentication</span>
                            <span className="text-xs font-medium text-gray-700">NextAuth.js v5</span>
                        </div>
                        <div className="flex items-center justify-between py-2">
                            <span className="text-xs text-gray-500">สถานะ</span>
                            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                ทำงานปกติ
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Notice */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
                <div className="flex items-start gap-3">
                    <span className="text-lg">💡</span>
                    <div>
                        <p className="text-sm font-medium text-amber-800">หมายเหตุ</p>
                        <p className="text-xs text-amber-600 mt-1 leading-relaxed">
                            หน้าตั้งค่าอยู่ระหว่างการพัฒนา ฟีเจอร์เพิ่มเติม เช่น การจัดการบทบาทผู้ใช้ การตั้งค่าการแจ้งเตือน
                            และการส่งออกข้อมูลจะเปิดให้ใช้งานในเวอร์ชันถัดไป
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
