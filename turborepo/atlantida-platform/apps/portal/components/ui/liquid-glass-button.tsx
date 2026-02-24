"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

interface LiquidGlassButtonProps {
    href: string;
    children: React.ReactNode;
    className?: string;
}

export function LiquidGlassButton({ href, children, className = "" }: LiquidGlassButtonProps) {
    return (
        <Link href={href} className={`relative inline-block ${className}`}>
            <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative px-6 py-2.5 rounded-full overflow-hidden bg-white/10 dark:bg-slate-800/50 backdrop-blur-md border border-white/20 dark:border-slate-700/50 shadow-[0_4px_30px_rgba(0,0,0,0.1)] group flex items-center gap-2"
            >
                {/* Shine effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />

                {/* Hover Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Content */}
                <div className="relative z-10 flex items-center justify-center font-bold text-sm text-slate-900 dark:text-white group-hover:text-primary dark:group-hover:text-emerald-400 transition-colors">
                    {children}
                </div>

                {/* Inner shadow / Glass edge */}
                <div className="absolute inset-0 rounded-full border border-white/10 dark:border-white/5 pointer-events-none" />
            </motion.div>
        </Link>
    );
}
