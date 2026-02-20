"use client"

import * as React from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { cn } from "@repo/lib/utils"

interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode
    className?: string
    rotationIntensity?: number
}

export const TiltCard = React.forwardRef<HTMLDivElement, TiltCardProps>(
    ({ children, className, rotationIntensity = 15, onMouseMove, onMouseLeave, ...props }, ref) => {
        const internalRef = React.useRef<HTMLDivElement>(null)

        React.useImperativeHandle(ref, () => internalRef.current as HTMLDivElement)

        const x = useMotionValue(0)
        const y = useMotionValue(0)

        const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 })
        const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 })

        const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [rotationIntensity, -rotationIntensity])
        const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-rotationIntensity, rotationIntensity])

        const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
            const rect = internalRef.current?.getBoundingClientRect()
            if (!rect) return

            const width = rect.width
            const height = rect.height
            const mouseX = e.clientX - rect.left
            const mouseY = e.clientY - rect.top

            const xPct = mouseX / width - 0.5
            const yPct = mouseY / height - 0.5

            x.set(xPct)
            y.set(yPct)

            onMouseMove?.(e)
        }

        const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
            x.set(0)
            y.set(0)
            onMouseLeave?.(e)
        }

        return (
            <motion.div
                ref={internalRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d",
                }}
                className={cn("relative transition-transform ease-out", className)}
                {...(props as any)}
            >
                {children}
            </motion.div>
        )
    }
)
TiltCard.displayName = "TiltCard"
