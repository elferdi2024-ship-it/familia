"use client"

export function PropertyCardSkeleton() {
    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm animate-pulse">
            {/* Image placeholder */}
            <div className="aspect-[4/3] md:aspect-[3/4] bg-slate-200 dark:bg-slate-800" />
            {/* Content */}
            <div className="p-4 space-y-3">
                {/* Price */}
                <div className="h-5 w-28 bg-slate-200 dark:bg-slate-700 rounded" />
                {/* Title */}
                <div className="space-y-1.5">
                    <div className="h-4 w-full bg-slate-200 dark:bg-slate-700 rounded" />
                    <div className="h-4 w-2/3 bg-slate-200 dark:bg-slate-700 rounded" />
                </div>
                {/* Details */}
                <div className="flex gap-3 pt-1">
                    <div className="h-3 w-14 bg-slate-200 dark:bg-slate-700 rounded" />
                    <div className="h-3 w-14 bg-slate-200 dark:bg-slate-700 rounded" />
                    <div className="h-3 w-14 bg-slate-200 dark:bg-slate-700 rounded" />
                </div>
                {/* Location */}
                <div className="h-3 w-40 bg-slate-100 dark:bg-slate-800 rounded" />
            </div>
        </div>
    )
}

export function PropertyGridSkeleton({ count = 6 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-4 md:gap-6">
            {Array.from({ length: count }).map((_, i) => (
                <PropertyCardSkeleton key={i} />
            ))}
        </div>
    )
}

export function PropertyDetailSkeleton() {
    return (
        <div className="animate-pulse space-y-8 max-w-7xl mx-auto px-4 py-8">
            {/* Gallery */}
            <div className="h-[50vh] bg-slate-200 dark:bg-slate-800 rounded-xl" />
            {/* Title */}
            <div className="space-y-3">
                <div className="flex gap-2">
                    <div className="h-5 w-20 bg-slate-200 dark:bg-slate-700 rounded" />
                    <div className="h-5 w-32 bg-slate-200 dark:bg-slate-700 rounded" />
                </div>
                <div className="h-8 w-2/3 bg-slate-200 dark:bg-slate-700 rounded" />
                <div className="h-4 w-44 bg-slate-200 dark:bg-slate-700 rounded" />
            </div>
            {/* Stats grid */}
            <div className="grid grid-cols-3 gap-4">
                <div className="h-24 bg-slate-100 dark:bg-slate-800 rounded-xl" />
                <div className="h-24 bg-slate-100 dark:bg-slate-800 rounded-xl" />
                <div className="h-24 bg-slate-100 dark:bg-slate-800 rounded-xl" />
            </div>
            {/* Features */}
            <div className="grid grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-20 bg-slate-100 dark:bg-slate-800 rounded-xl" />
                ))}
            </div>
            {/* Description */}
            <div className="space-y-2">
                <div className="h-6 w-48 bg-slate-200 dark:bg-slate-700 rounded" />
                <div className="h-4 w-full bg-slate-200 dark:bg-slate-700 rounded" />
                <div className="h-4 w-full bg-slate-200 dark:bg-slate-700 rounded" />
                <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-700 rounded" />
            </div>
        </div>
    )
}
