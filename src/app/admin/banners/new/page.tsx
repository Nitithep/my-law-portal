import BannerForm from "@/components/admin/BannerForm";

export default function NewBannerPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">เพิ่มแบนเนอร์ใหม่</h1>
                <p className="text-gray-500">สร้างแบนเนอร์เพื่อแสดงในหน้าแรก</p>
            </div>
            <BannerForm />
        </div>
    );
}
