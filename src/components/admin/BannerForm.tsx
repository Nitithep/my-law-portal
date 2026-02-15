"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBanner, updateBanner } from "@/actions/banner-actions";

type BannerData = {
    id?: string;
    title: string | null;
    image: string;
    link: string | null;
    isActive: boolean;
    order: number;
};

export default function BannerForm({ initialData }: { initialData?: BannerData | null }) {
    const router = useRouter();
    const [isPending, setIsPending] = useState(false);
    const [form, setForm] = useState<BannerData>(
        initialData || {
            title: "",
            image: "",
            link: "",
            isActive: true,
            order: 0,
        }
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsPending(true);
        try {
            if (initialData?.id) {
                await updateBanner(initialData.id, form);
            } else {
                await createBanner(form);
            }
            router.push("/admin/banners");
            router.refresh();
        } catch (error) {
            console.error(error);
            alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
        } finally {
            setIsPending(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        หัวข้อ (Optional)
                    </label>
                    <input
                        type="text"
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1a3c7b]/20 focus:border-[#1a3c7b] transition-all text-sm"
                        value={form.title || ""}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        placeholder="ข้อความที่จะแสดงบนแบนเนอร์"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        รูปภาพ URL <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        required
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1a3c7b]/20 focus:border-[#1a3c7b] transition-all text-sm"
                        value={form.image}
                        onChange={(e) => setForm({ ...form, image: e.target.value })}
                        placeholder="https://example.com/image.jpg"
                    />
                    {form.image && (
                        <div className="mt-2 relative aspect-[21/9] w-full rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={form.image}
                                alt="Preview"
                                className="object-cover w-full h-full"
                                onError={(e) => (e.currentTarget.style.display = "none")}
                            />
                        </div>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        ลิงก์ (Optional)
                    </label>
                    <input
                        type="text"
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1a3c7b]/20 focus:border-[#1a3c7b] transition-all text-sm"
                        value={form.link || ""}
                        onChange={(e) => setForm({ ...form, link: e.target.value })}
                        placeholder="https://example.com/target-page (ถ้ามี)"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            ลำดับการแสดงผล
                        </label>
                        <input
                            type="number"
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1a3c7b]/20 focus:border-[#1a3c7b] transition-all text-sm"
                            value={form.order}
                            onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
                        />
                    </div>

                    <div className="flex items-center pt-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                className="w-4 h-4 text-[#1a3c7b] rounded border-gray-300 focus:ring-[#1a3c7b]"
                                checked={form.isActive}
                                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                            />
                            <span className="text-sm font-medium text-gray-700">เปิดใช้งาน (Active)</span>
                        </label>
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                    ยกเลิก
                </button>
                <button
                    type="submit"
                    disabled={isPending}
                    className="px-4 py-2 rounded-lg bg-[#1a3c7b] text-white text-sm font-medium hover:bg-[#15325f] transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                    {isPending ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
                </button>
            </div>
        </form>
    );
}
