"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { cn } from "@repo/lib/utils"

interface NavItem {
    name: string
    url: string
}

interface TubelightNavbarProps {
    items: NavItem[]
    className?: string
}

export function TubelightNavbar({ items, className }: TubelightNavbarProps) {
    const [activeTab, setActiveTab] = useState(items[0].name)
    const [isMounted, setIsMounted] = useState(false)
    const pathname = usePathname()
    const searchParams = useSearchParams()

    useEffect(() => {
        setIsMounted(true)
        const currentPath = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "")

        // Sort items by length descending so more specific routes match first
        const sortedItems = [...items].sort((a, b) => b.url.length - a.url.length)

        const currentTab = sortedItems.find(item => {
            if (item.url === "/") return currentPath === "/"
            if (item.url.includes("?")) {
                // Need exact or prefixed match for query parameters
                return currentPath === item.url || currentPath.startsWith(item.url + "&")
            }
            return currentPath.startsWith(item.url) && item.url !== "/" && item.url !== "#contacto"
        })

        if (currentTab) {
            setActiveTab(currentTab.name)
        }
    }, [pathname, searchParams, items])

    return (
        <div className={cn("flex items-center gap-1 py-1 px-1 border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/50 backdrop-blur-md rounded-full shadow-sm", className)}>
            {items.map((item) => {
                const isActive = activeTab === item.name

                return (
                    <Link
                        key={item.name}
                        href={item.url}
                        onClick={() => setActiveTab(item.name)}
                        className={cn(
                            "relative cursor-pointer text-sm font-semibold px-5 py-2 rounded-full transition-colors",
                            isActive
                                ? "text-primary dark:text-sky-400"
                                : "text-slate-500 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100"
                        )}
                    >
                        <span className="relative z-10">{item.name}</span>
                        {isActive && isMounted && (
                            <motion.div
                                layoutId="lamp"
                                className="absolute inset-0 w-full bg-slate-100 dark:bg-slate-800 rounded-full -z-10"
                                initial={false}
                                transition={{
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 30,
                                }}
                            />
                        )}
                    </Link>
                )
            })}
        </div>
    )
}
