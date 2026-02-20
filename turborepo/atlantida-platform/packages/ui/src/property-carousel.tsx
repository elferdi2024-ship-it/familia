"use client"

import React, { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@repo/lib/utils"

interface PropertyCarouselProps {
    images: string[]
    altText?: string
    className?: string
}

export function PropertyCarousel({ images, altText = "Property Image", className }: PropertyCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [direction, setDirection] = useState(0)
    const thumbnailContainerRef = useRef<HTMLDivElement>(null)

    // Avoid unnecessary rendering if no images
    if (!images || images.length === 0) return null

    // If only one image, render standard image
    if (images.length === 1) {
        return (
            <div className={cn("relative w-full h-[50vh] lg:h-[70vh]", className)}>
                <img
                    src={images[0]}
                    alt={altText}
                    className="w-full h-full object-cover"
                />
            </div>
        )
    }

    // Auto-scroll thumbnails to keep the active one in view
    useEffect(() => {
        if (!thumbnailContainerRef.current) return
        const container = thumbnailContainerRef.current
        const activeThumbnail = container.children[currentIndex] as HTMLElement
        if (activeThumbnail) {
            const containerCenter = container.clientWidth / 2
            const thumbnailCenter = activeThumbnail.offsetLeft + activeThumbnail.clientWidth / 2
            const scrollPos = thumbnailCenter - containerCenter
            container.scrollTo({ left: scrollPos, behavior: 'smooth' })
        }
    }, [currentIndex])

    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? "100%" : "-100%",
            opacity: 0,
            scale: 1.05
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
            scale: 1
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? "100%" : "-100%",
            opacity: 0,
            scale: 0.95
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
        <div className={cn("relative w-full flex flex-col gap-2", className)}>
            {/* Main Image Viewer */}
            <div className="relative w-full h-[40vh] lg:h-[65vh] rounded-3xl overflow-hidden group shadow-md dark:shadow-none bg-slate-100 dark:bg-slate-900 border border-slate-200/50 dark:border-white/5">
                <AnimatePresence initial={false} custom={direction} mode="popLayout">
                    <motion.img
                        key={currentIndex}
                        src={images[currentIndex]}
                        alt={`${altText} - ${currentIndex + 1}`}
                        className="absolute inset-0 w-full h-full object-cover origin-center"
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: "spring", stiffness: 300, damping: 30 },
                            opacity: { duration: 0.2 },
                            scale: { duration: 0.4 }
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

                {/* Subdued Gradient Overlay for overlay items (like tags/badges if added later) */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                {/* Navigation Buttons */}
                <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                    <button
                        className="pointer-events-auto bg-white/80 hover:bg-white dark:bg-black/60 dark:hover:bg-black/80 backdrop-blur-md shadow-lg rounded-full w-10 h-10 flex items-center justify-center text-slate-900 dark:text-white transition-all transform hover:scale-105 active:scale-95 border border-white/20"
                        onClick={(e) => paginate(-1, e)}
                        aria-label="Previous image"
                    >
                        <ChevronLeft className="w-5 h-5 ml-[-2px]" />
                    </button>
                    <button
                        className="pointer-events-auto bg-white/80 hover:bg-white dark:bg-black/60 dark:hover:bg-black/80 backdrop-blur-md shadow-lg rounded-full w-10 h-10 flex items-center justify-center text-slate-900 dark:text-white transition-all transform hover:scale-105 active:scale-95 border border-white/20"
                        onClick={(e) => paginate(1, e)}
                        aria-label="Next image"
                    >
                        <ChevronRight className="w-5 h-5 mr-[-2px]" />
                    </button>
                </div>

                {/* Image Counter Badge */}
                <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full border border-white/10 pointer-events-none">
                    {currentIndex + 1} / {images.length}
                </div>
            </div>

            {/* Thumbnail Strip */}
            <div
                ref={thumbnailContainerRef}
                className="w-full flex items-center gap-2 overflow-x-auto no-scrollbar py-2 px-1 scroll-smooth"
            >
                {images.map((img, index) => (
                    <button
                        key={index}
                        onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            if (index !== currentIndex) {
                                setDirection(index > currentIndex ? 1 : -1)
                                setCurrentIndex(index)
                            }
                        }}
                        className={cn(
                            "relative flex-shrink-0 w-24 h-16 sm:w-28 sm:h-20 rounded-xl overflow-hidden transition-all duration-300 cursor-pointer border-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 dark:focus:ring-offset-background",
                            index === currentIndex
                                ? "border-primary opacity-100 scale-100 dark:border-primary grayscale-0 ring-4 ring-primary/20"
                                : "border-transparent opacity-60 hover:opacity-100 scale-95 hover:scale-[0.98] grayscale-[30%] hover:grayscale-0"
                        )}
                        aria-label={`View image ${index + 1}`}
                    >
                        <img
                            src={img}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-full h-full object-cover transition-transform duration-500"
                        />
                        {/* Selected Indicator Overlay */}
                        {index === currentIndex && (
                            <div className="absolute inset-0 bg-primary/10 transition-opacity" />
                        )}
                    </button>
                ))}
            </div>
        </div>
    )
}
