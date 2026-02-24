"use client"

import Link from "next/link"
import { Map, BadgeCheck } from "lucide-react"

export function FeedRightSidebar() {
    return (
        <aside className="hidden xl:flex flex-col w-80 shrink-0 gap-6 h-[calc(100vh-80px)] sticky top-[80px] overflow-y-auto custom-scroll pb-10">
            {/* Activity Block */}
            <div className="bg-white dark:bg-black border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden p-4">
                <div className="flex items-center gap-2 mb-4">
                    <Map className="w-5 h-5 text-slate-800 dark:text-slate-200" />
                    <h4 className="font-bold text-[16px] tracking-tight">Actividad en el Barrio</h4>
                </div>
                <div className="rounded-lg h-36 bg-slate-100 dark:bg-slate-900 relative overflow-hidden flex items-center justify-center mb-4">
                    {/* Placeholder Map Pattern */}
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#000000_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>
                    <div className="relative">
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-black dark:bg-white animate-pulse rounded-full"></span>
                        <Map className="w-6 h-6 text-slate-900 dark:text-white" />
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-[13px] text-slate-500 font-medium">Pocitos, Montevideo</span>
                    <span className="text-[13px] font-bold text-slate-900 dark:text-white">8 Agentes</span>
                </div>
            </div>

            {/* Top Agents */}
            <div className="bg-white dark:bg-black border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800">
                    <h4 className="font-bold text-[16px] tracking-tight">Top Agentes</h4>
                </div>

                <div className="p-4 flex flex-col gap-4">
                    {/* Top 1 */}
                    <div className="flex items-center justify-between group cursor-pointer">
                        <div className="flex items-center gap-3">
                            <div className="relative w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center font-bold text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 group-hover:border-slate-400 transition-colors">
                                M
                            </div>
                            <div>
                                <p className="text-[15px] font-bold text-slate-900 dark:text-white leading-tight group-hover:underline">Martín L.</p>
                                <p className="text-[13px] text-slate-500 mt-0.5">12 Ventas</p>
                            </div>
                        </div>
                        <span className="text-[11px] font-bold text-black dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">#1</span>
                    </div>

                    {/* Top 2 */}
                    <div className="flex items-center justify-between group cursor-pointer">
                        <div className="flex items-center gap-3">
                            <div className="relative w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center font-bold text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 group-hover:border-slate-400 transition-colors">
                                J
                            </div>
                            <div>
                                <p className="text-[15px] font-bold text-slate-900 dark:text-white leading-tight group-hover:underline">Juan Pérez</p>
                                <p className="text-[13px] text-slate-500 mt-0.5">9 Ventas</p>
                            </div>
                        </div>
                        <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 px-2 py-1">#2</span>
                    </div>
                </div>

                <Link href="/ranking" className="block p-4 text-[14px] font-medium text-blue-600 dark:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors border-t border-slate-200 dark:border-slate-800">
                    Ver Ranking Completo
                </Link>
            </div>

            {/* Promo Card Premium */}
            <div className="bg-slate-900 dark:bg-white p-6 rounded-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <BadgeCheck className="w-24 h-24 text-white dark:text-black" />
                </div>
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="bg-white text-black dark:bg-black dark:text-white text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wide">Pro</span>
                        <h4 className="font-bold text-white dark:text-black text-xl tracking-tight">Barrio Premium</h4>
                    </div>
                    <p className="text-[14px] text-slate-400 dark:text-slate-600 mb-6 leading-snug">Potencia tus listados. Genera 3x más alcance y consultas verificadas.</p>
                    <Link
                        href="/publish/pricing"
                        className="block w-full bg-white dark:bg-black text-black dark:text-white font-bold py-3 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-center"
                    >
                        Mejorar Plan
                    </Link>
                </div>
            </div>
        </aside>
    )
}
