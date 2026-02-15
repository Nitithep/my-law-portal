import BannerForm from "@/components/admin/BannerForm";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

export default async function EditBannerPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const banner = await prisma.banner.findUnique({
        where: { id },
    });

    if (!banner) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">แก้ไขแบนเนอร์</h1>
                <p className="text-gray-500">แก้ไขข้อมูลแบนเนอร์</p>
            </div>
            <BannerForm initialData={banner} />
        </div>
    );
}
