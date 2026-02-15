import { getAllBannersAdmin } from "@/actions/banner-actions";
import Link from "next/link";
import DeleteBannerButton from "@/components/admin/DeleteBannerButton";

export const dynamic = "force-dynamic";

export default async function AdminBannersPage() {
    const banners = await getAllBannersAdmin();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">จัดการแบนเนอร์</h1>
                    <p className="text-gray-500">จัดการภาพสไลด์หน้าแรกของเว็บไซต์</p>
                </div>
                <Link
                    href="/admin/banners/new"
                    className="bg-[#1a3c7b] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#15325f] transition-colors flex items-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    เพิ่มแบนเนอร์
                </Link>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-gray-700">รูปภาพ</th>
                            <th className="px-6 py-4 font-semibold text-gray-700">หัวข้อ</th>
                            <th className="px-6 py-4 font-semibold text-gray-700">สถานะ</th>
                            <th className="px-6 py-4 font-semibold text-gray-700">ลำดับ</th>
                            <th className="px-6 py-4 font-semibold text-gray-700 text-right">จัดการ</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {banners.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-gray-400 italic">
                                    ยังไม่มีแบนเนอร์ในระบบ
                                </td>
                            </tr>
                        ) : (
                            banners.map((banner) => (
                                <tr key={banner.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="h-12 w-20 rounded bg-gray-100 overflow-hidden border border-gray-200">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={banner.image}
                                                alt={banner.title || "Banner"}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-800">
                                        {banner.title || <span className="text-gray-400">-</span>}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${banner.isActive
                                                ? "bg-green-100 text-green-800"
                                                : "bg-gray-100 text-gray-800"
                                                }`}
                                        >
                                            {banner.isActive ? "ใช้งาน" : "ปิดใช้งาน"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{banner.order}</td>
                                    <td className="px-6 py-4 text-right space-x-4">
                                        <Link
                                            href={`/admin/banners/${banner.id}/edit`}
                                            className="text-[#1a3c7b] hover:text-[#15325f] font-medium transition-colors"
                                        >
                                            แก้ไข
                                        </Link>
                                        <DeleteBannerButton id={banner.id} />
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
