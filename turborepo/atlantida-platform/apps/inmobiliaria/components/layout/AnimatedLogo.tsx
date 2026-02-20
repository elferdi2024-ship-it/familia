"use client";

import React from 'react';

interface AnimatedLogoProps {
    className?: string;
    isDark?: boolean;
}

export const AnimatedLogo = ({ className = "h-10 w-auto", isDark = false }: AnimatedLogoProps) => {
    return (
        <video
            src="/inmobiliaria.mp4"
            autoPlay
            loop
            muted
            playsInline
            className={`${className} object-contain transition-all duration-300 ${isDark ? "mix-blend-screen contrast-125" : "mix-blend-multiply"
                }`}
            style={{
                pointerEvents: 'none',
            }}
        />
    );
};
