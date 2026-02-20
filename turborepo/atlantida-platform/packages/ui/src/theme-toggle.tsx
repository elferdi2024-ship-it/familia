"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { motion } from "framer-motion"
import { cn } from "@repo/lib/utils"

interface ThemeToggleProps extends React.HTMLAttributes<HTMLButtonElement> {
    className?: string;
}

export function ThemeToggle({ className, ...props }: ThemeToggleProps) {
    const { setTheme, theme, resolvedTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    // Ensure we only render the toggle after hydration to avoid mismatch
    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return <div className={`w-14 h-8 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 opacity-0 ${className || ""}`} />
    }

    const isDark = resolvedTheme === "dark"

    const toggleTheme = () => {
        setTheme(isDark ? "light" : "dark")
    }

    return (
        <button
            onClick={toggleTheme}
            className={cn(
                "relative flex items-center w-14 h-8 rounded-full p-1 transition-colors duration-500 focus:outline-none focus:ring-2 focus:ring-primary/20",
                isDark
                    ? "bg-slate-900 border border-slate-800 shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]"
                    : "bg-slate-200 border border-slate-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]",
                className
            )}
            aria-label="Toggle theme"
            {...props}
        >
            <span className="sr-only">Cambiar tema ({isDark ? 'Oscuro' : 'Claro'})</span>

            {/* Background Icons (Static) */}
            <div className="absolute inset-x-0 mx-2 flex justify-between items-center z-0 pointer-events-none">
                <Moon className={cn("w-3.5 h-3.5 transition-opacity duration-300 delay-100", isDark ? "opacity-30 text-sky-400" : "opacity-0")} />
                <Sun className={cn("w-3.5 h-3.5 transition-opacity duration-300 delay-100", !isDark ? "opacity-30 text-amber-500" : "opacity-0")} />
            </div>

            {/* The Switch Handle */}
            <motion.div
                className={cn(
                    "relative z-10 flex items-center justify-center w-6 h-6 rounded-full shadow-[0_1px_3px_rgba(0,0,0,0.3)]",
                    isDark ? "bg-slate-800" : "bg-white"
                )}
                layout
                initial={false}
                animate={{
                    x: isDark ? "24px" : "0px",
                }}
                transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                    mass: 0.8
                }}
            >
                {/* Inner Icon on Handle */}
                <motion.div
                    initial={false}
                    animate={{ rotate: isDark ? -90 : 0, scale: isDark ? 1 : 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="absolute inset-0 flex items-center justify-center text-sky-400"
                >
                    {isDark && <Moon className="w-3.5 h-3.5" />}
                </motion.div>

                <motion.div
                    initial={false}
                    animate={{ rotate: isDark ? 0 : 90, scale: isDark ? 0 : 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="absolute inset-0 flex items-center justify-center text-amber-500"
                >
                    {!isDark && <Sun className="w-3.5 h-3.5" />}
                </motion.div>

                {/* 3D Lighting effect over the handle */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent to-white/20 dark:to-white/5 pointer-events-none" />
            </motion.div>
        </button>
    )
}
