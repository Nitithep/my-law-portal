"use client";

import { useState, useEffect, useCallback } from "react";
import { Banner } from "@prisma/client";

export function HeroBanner({ banners }: { banners: Banner[] }) {
    const [current, setCurrent] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const next = useCallback(() => {
        if (banners.length === 0) return;
        setCurrent((prev) => (prev + 1) % banners.length);
    }, [banners.length]);

    useEffect(() => {
        if (isPaused || banners.length <= 1) return;
        const timer = setInterval(next, 5000);
        return () => clearInterval(timer);
    }, [isPaused, next, banners.length]);

    if (banners.length === 0) return null;

    return (
        <div
            className="md:col-span-5 relative overflow-hidden rounded-2xl bg-gray-900 text-white min-h-[160px] group cursor-pointer shadow-sm hover:shadow-md transition-all h-full"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {/* Slides */}
            <div className="absolute inset-0">
                {banners.map((banner, index) => (
                    <a
                        key={banner.id}
                        href={banner.link || "#"}
                        target={banner.link ? "_blank" : undefined}
                        rel={banner.link ? "noopener noreferrer" : undefined}
                        className={`absolute inset-0 flex items-center transition-all duration-700 ease-in-out ${index === current
                            ? "opacity-100 translate-x-0"
                            : index < current
                                ? "opacity-0 -translate-x-full"
                                : "opacity-0 translate-x-full"
                            }`}
                    >
                        {/* Background Image */}
                        <div className="absolute inset-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={banner.image}
                                alt={banner.title || "Banner"}
                                className="w-full h-full object-cover"
                            />
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        </div>

                        {/* Content */}
                        <div className="relative z-10 w-full px-6 pt-12">
                            {banner.title && (
                                <h2 className="text-2xl font-bold text-white mb-2 leading-tight drop-shadow-md line-clamp-2">
                                    {banner.title}
                                </h2>
                            )}
                        </div>
                    </a>
                ))}
            </div>

            {/* Dots */}
            {banners.length > 1 && (
                <div className="absolute bottom-4 left-6 flex gap-2 z-20">
                    {banners.map((_, index) => (
                        <button
                            key={index}
                            onClick={(e) => {
                                e.preventDefault();
                                setCurrent(index);
                            }}
                            className={`h-1.5 rounded-full transition-all duration-300 ${index === current
                                ? "bg-white w-6"
                                : "bg-white/40 w-2 hover:bg-white/60"
                                }`}
                        />
                    ))}
                </div>
            )}

            {/* Arrows */}
            {banners.length > 1 && (
                <>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            setCurrent((prev) => (prev - 1 + banners.length) % banners.length)
                        }}
                        className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        ‹
                    </button>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            next();
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        ›
                    </button>
                </>
            )}
        </div>
    );
}
