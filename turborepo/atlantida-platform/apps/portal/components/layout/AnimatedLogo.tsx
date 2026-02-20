"use client";

import React from 'react';

interface AnimatedLogoProps {
    className?: string;
    isDark?: boolean;
}

export const AnimatedLogo = ({ className = "h-10 w-auto", isDark = false }: AnimatedLogoProps) => {
    // Using mix-blend-mode to try to remove the background of the MP4.
    // If the video has a white background, mix-blend-multiply removes the white.
    // If the video has a black background, mix-blend-screen removes the black.
    // We apply conditional styling based on isDark assuming the video needs to adapt.

    return (
        <video
            src="/portal.mp4"
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
