type AdminStatCardProps = {
    icon: React.ReactNode;
    label: string;
    value: number | string;
    color: "blue" | "emerald" | "orange" | "purple" | "rose" | "teal";
    subtitle?: string;
};

const colorClasses = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    orange: "bg-orange-50 text-orange-600 border-orange-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
    rose: "bg-rose-50 text-rose-600 border-rose-100",
    teal: "bg-teal-50 text-teal-600 border-teal-100",
};

const iconBg = {
    blue: "bg-blue-100",
    emerald: "bg-emerald-100",
    orange: "bg-orange-100",
    purple: "bg-purple-100",
    rose: "bg-rose-100",
    teal: "bg-teal-100",
};

export function AdminStatCard({
    icon,
    label,
    value,
    color,
    subtitle,
}: AdminStatCardProps) {
    return (
        <div
            className={`relative overflow-hidden rounded-2xl border p-5 ${colorClasses[color]}`}
        >
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-xs font-semibold opacity-70 mb-1">{label}</p>
                    <p className="text-3xl font-bold tracking-tight">{value}</p>
                    {subtitle && (
                        <p className="text-[10px] mt-1 opacity-60">{subtitle}</p>
                    )}
                </div>
                <div
                    className={`h-10 w-10 rounded-xl ${iconBg[color]} flex items-center justify-center`}
                >
                    {icon}
                </div>
            </div>
            {/* Background decoration */}
            <div className="absolute -right-4 -bottom-4 h-20 w-20 rounded-full opacity-10 bg-current" />
        </div>
    );
}
