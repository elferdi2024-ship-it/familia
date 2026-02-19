"use client"

import * as React from "react"
import { Expand, Download, ZoomIn } from "lucide-react"
import { Button } from "@repo/ui"
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@repo/ui"

export function FloorplanViewer({ imageUrl }: { imageUrl: string }) {
    return (
        <div className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Expand className="h-5 w-5 text-primary" />
                    Plano de Distribución
                </h3>
                <Button variant="outline" size="sm" className="gap-2">
                    <Download className="h-4 w-4" /> PDF
                </Button>
            </div>

            <Dialog>
                <DialogTrigger asChild>
                    <div className="relative group cursor-zoom-in overflow-hidden rounded-lg border bg-slate-50 dark:bg-slate-900 transition-all hover:border-primary/50">
                        <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/10 transition-colors z-10">
                            <div className="opacity-0 group-hover:opacity-100 bg-white/90 text-slate-900 px-4 py-2 rounded-full font-medium shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all flex items-center gap-2">
                                <ZoomIn className="h-4 w-4" /> Ampliar Plano
                            </div>
                        </div>
                        <img
                            src={imageUrl}
                            alt="Plano de la propiedad"
                            className="h-full w-full object-contain max-h-[300px] p-4 group-hover:scale-105 transition-transform duration-500"
                        />
                    </div>
                </DialogTrigger>
                <DialogContent className="max-w-5xl w-full h-[90vh] p-0 overflow-hidden bg-white">
                    <div className="h-full w-full flex items-center justify-center bg-slate-100 p-4">
                        <img
                            src={imageUrl}
                            alt="Plano de la propiedad - Zoom"
                            className="max-h-full max-w-full object-contain"
                        />
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
