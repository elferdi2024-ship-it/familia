"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@repo/lib/utils"

interface ThumbnailCarouselProps {
    images: string[]
    altText?: string
    className?: string
}

export function ThumbnailCarousel({ images, altText = "Property Image", className }: ThumbnailCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [direction, setDirection] = useState(0)

    // Avoid unnecessary rendering if no images
    if (!images || images.length === 0) return null

    // If only one image, render standard image
    if (images.length === 1) {
        return (
            <div className={cn("relative w-full h-full", className)}>
                <img
                    src={images[0]}
                    alt={altText}
                    className="w-full h-full object-cover"
                />
            </div>
        )
    }

    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? "100%" : "-100%",
            opacity: 0,
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? "100%" : "-100%",
            opacity: 0,
        }),
    }

    const swipeConfidenceThreshold = 10000
    const swipePower = (offset: number, velocity: number) => {
        return Math.abs(offset) * velocity
    }

    const paginate = (newDirection: number, e?: React.MouseEvent) => {
        e?.preventDefault()
        e?.stopPropagation()
        setDirection(newDirection)
        setCurrentIndex((prevIndex) => {
            let nextIndex = prevIndex + newDirection
            if (nextIndex < 0) nextIndex = images.length - 1
            if (nextIndex >= images.length) nextIndex = 0
            return nextIndex
        })
    }

    return (
        <div className={cn("relative w-full h-full group overflow-hidden", className)}>
            <AnimatePresence initial={false} custom={direction}>
                <motion.img
                    key={currentIndex}
                    src={images[currentIndex]}
                    alt={`${altText} ${currentIndex + 1}`}
                    className="absolute inset-0 w-full h-full object-cover"
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                        x: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.2 },
                    }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={1}
                    onDragEnd={(e, { offset, velocity }) => {
                        const swipe = swipePower(offset.x, velocity.x)
                        if (swipe < -swipeConfidenceThreshold) {
                            paginate(1)
                        } else if (swipe > swipeConfidenceThreshold) {
                            paginate(-1)
                        }
                    }}
                />
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="absolute inset-0 bg-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none flex items-center justify-between px-2">
                <button
                    className="pointer-events-auto bg-white/70 hover:bg-white dark:bg-black/50 dark:hover:bg-black/80 backdrop-blur-sm shadow-md rounded-full w-7 h-7 flex items-center justify-center text-slate-800 dark:text-white transition-all transform hover:scale-110 active:scale-95"
                    onClick={(e) => paginate(-1, e)}
                >
                    <ChevronLeft className="w-4 h-4 ml-[-1px]" />
                </button>
                <button
                    className="pointer-events-auto bg-white/70 hover:bg-white dark:bg-black/50 dark:hover:bg-black/80 backdrop-blur-sm shadow-md rounded-full w-7 h-7 flex items-center justify-center text-slate-800 dark:text-white transition-all transform hover:scale-110 active:scale-95"
                    onClick={(e) => paginate(1, e)}
                >
                    <ChevronRight className="w-4 h-4 mr-[-1px]" />
                </button>
            </div>

            {/* Dot Indicators */}
            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 z-10">
                {images.map((_, index) => (
                    <div
                        key={index}
                        className={cn(
                            "w-1.5 h-1.5 rounded-full transition-all duration-300 shadow-sm",
                            index === currentIndex
                                ? "bg-white scale-110 opacity-100"
                                : "bg-white/50 opacity-60 hover:opacity-100 hover:scale-110 cursor-pointer"
                        )}
                        onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            setDirection(index > currentIndex ? 1 : -1)
                            setCurrentIndex(index)
                        }}
                    />
                ))}
            </div>
        </div>
    )
}
