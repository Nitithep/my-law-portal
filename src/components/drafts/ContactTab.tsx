export function ContactTab({ agency }: { agency: string }) {
    return (
        <div className="space-y-8 animate-in fade-in duration-300">
            <div className="bg-white rounded-xl border border-gray-100 p-8 flex flex-col items-center justify-center text-center space-y-6">
                {/* Logo Placeholder - In a real app, this would be dynamic or mapped from agency name */}
                <div className="w-48 h-48 bg-purple-100 rounded-full flex items-center justify-center mb-4 relative overflow-hidden ring-4 ring-purple-50">
                    {/* Using a generic government icon/logo or text if image not available */}
                    <div className="text-center p-4">
                        <svg className="h-24 w-24 text-purple-800 mx-auto mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <span className="text-xs font-bold text-purple-900 uppercase tracking-widest">{agency}</span>
                    </div>
                </div>

                <div className="space-y-2 max-w-md mx-auto">
                    <h3 className="text-[#1a3c7b] font-bold text-lg">ข้อมูลการติดต่อ</h3>
                    <p className="text-gray-600 font-medium">{agency}</p>
                </div>

                <div className="w-full border-t border-gray-100 pt-6 mt-2 max-w-lg mx-auto text-left space-y-4">
                    <div className="flex items-start gap-3 text-sm text-gray-600">
                        <svg className="h-5 w-5 text-[#1a3c7b] mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>อาคารพระจอมเกล้า ถนนพระราม 6 แขวงทุ่งพญาไท เขตราชเทวี กรุงเทพฯ 10400</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                        <svg className="h-5 w-5 text-[#1a3c7b] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span>0 2333 3700</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
