"use client"

import * as React from "react"
import { motion, useInView, Variants } from "framer-motion"
import { cn } from "@repo/lib/utils"

interface RevealTextProps {
    text: string
    className?: string
    delay?: number
    duration?: number
    as?: React.ElementType
}

export function RevealText({
    text,
    className,
    delay = 0,
    duration = 0.5,
    as: Component = "h2",
}: RevealTextProps) {
    const ref = React.useRef<HTMLElement>(null)
    const isInView = useInView(ref, { once: true, margin: "-10% 0px" })

    // Split text by lines
    const lines = text.split("\n")

    const containerVariants: Variants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.1,
                delayChildren: delay,
            },
        },
    }

    const childVariants: Variants = {
        hidden: { y: "100%", opacity: 0 },
        visible: {
            y: "0%",
            opacity: 1,
            transition: {
                type: "spring",
                damping: 20,
                stiffness: 100,
                duration: duration,
            },
        },
    }

    // Framer Motion dynamic component typing
    const MotionComponent = motion(Component as React.ElementType) as React.ComponentType<
        React.HTMLAttributes<HTMLElement> & { ref?: React.Ref<HTMLElement>; variants?: Variants; initial?: string; animate?: string }
    >

    return (
        <MotionComponent
            ref={ref}
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className={cn("flex flex-col gap-1 overflow-hidden", className)}
        >
            {lines.map((line, lineIndex) => (
                <span key={lineIndex} className="overflow-hidden inline-block leading-tight">
                    <motion.span variants={childVariants} className="inline-block">
                        {line}
                    </motion.span>
                </span>
            ))}
        </MotionComponent>
    )
}
