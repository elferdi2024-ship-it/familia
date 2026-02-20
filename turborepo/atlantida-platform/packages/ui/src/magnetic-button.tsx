"use client"

import * as React from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { cn } from "@repo/lib/utils"

interface MagneticWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode
    className?: string
    magneticStrength?: number
}

export const MagneticWrapper = React.forwardRef<HTMLDivElement, MagneticWrapperProps>(
    ({ children, className, magneticStrength = 0.2, onMouseMove, onMouseLeave, ...props }, ref) => {
        const internalRef = React.useRef<HTMLDivElement>(null)

        // Use the provided ref if it exists, otherwise use internalRef
        React.useImperativeHandle(ref, () => internalRef.current as HTMLDivElement)

        const mouseX = useMotionValue(0)
        const mouseY = useMotionValue(0)

        const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
            const rect = internalRef.current?.getBoundingClientRect()
            if (rect) {
                const x = e.clientX - rect.left - rect.width / 2
                const y = e.clientY - rect.top - rect.height / 2
                mouseX.set(x * magneticStrength)
                mouseY.set(y * magneticStrength)
            }
            onMouseMove?.(e)
        }

        const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
            mouseX.set(0)
            mouseY.set(0)
            onMouseLeave?.(e)
        }

        // Add spring physics to make the movement smooth
        const springConfig = { damping: 15, stiffness: 150, mass: 0.1 }
        const x = useSpring(mouseX, springConfig)
        const y = useSpring(mouseY, springConfig)

        return (
            <motion.div
                ref={internalRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{ x, y }}
                className={cn("relative transition-colors inline-block", className)}
                {...(props as any)}
            >
                {/* Child wrapper to reverse the magnetic effect slightly for parallax inside the button itself */}
                <motion.div style={{ x: useTransform(x, (val) => val * 0.5), y: useTransform(y, (val) => val * 0.5) }}>
                    {children}
                </motion.div>
            </motion.div>
        )
    }
)
MagneticWrapper.displayName = "MagneticWrapper"
