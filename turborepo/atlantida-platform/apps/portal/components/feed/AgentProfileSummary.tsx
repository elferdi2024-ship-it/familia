"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@repo/ui/dialog"
import { BadgeCheck, Phone, MapPin, Building2, User2, MessageSquare, ExternalLink } from "lucide-react"
import { AgentPlan } from "@repo/types"

interface AgentProfileSummaryProps {
    isOpen: boolean
    onClose: () => void
    agent: {
        id: string
        name: string
        avatar: string
        verified: boolean
        plan: AgentPlan | string
        agency?: string
        neighborhood?: string
        phone?: string
        listingsCount?: number
    }
    onViewPosts: (agentId: string) => void
}

export function AgentProfileSummary({ isOpen, onClose, agent, onViewPosts }: AgentProfileSummaryProps) {
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[420px] p-0 overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl rounded-xl">
                {/* Header/Cover Placeholder */}
                <div className={`h-24 w-full ${agent.plan === 'elite' || agent.plan === 'ELITE' ? 'bg-gradient-to-r from-purple-600 to-indigo-600' :
                        agent.plan === 'pro' || agent.plan === 'PRO' ? 'bg-gradient-to-r from-emerald-600 to-teal-600' :
                            'bg-slate-200 dark:bg-slate-800'
                    }`} />

                <div className="px-6 pb-8 pt-0 -mt-12 relative flex flex-col items-center">
                    {/* Avatar */}
                    <div className={`relative w-24 h-24 rounded-full border-4 border-white dark:border-slate-900 overflow-hidden bg-slate-100 dark:bg-slate-800 shadow-lg ring-2 ${agent.plan === 'elite' || agent.plan === 'ELITE' ? 'ring-purple-500' :
                            agent.plan === 'pro' || agent.plan === 'PRO' ? 'ring-emerald-500' :
                                'ring-transparent'
                        }`}>
                        {agent.avatar ? (
                            <img src={agent.avatar} alt={agent.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                                <User2 className="w-10 h-10" />
                            </div>
                        )}
                    </div>

                    {/* Agent Info */}
                    <div className="mt-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                            <h3 className="text-xl font-semibold text-slate-900 dark:text-white tracking-tight">
                                {agent.name}
                            </h3>
                            {agent.verified && (
                                <BadgeCheck className={`w-5 h-5 ${agent.plan === 'elite' || agent.plan === 'ELITE' ? 'text-purple-500' : 'text-emerald-500'
                                    }`} />
                            )}
                        </div>
                        <p className="text-[12px] font-medium text-slate-500 mt-1">
                            {String(agent.plan).toLowerCase() === "elite" ? "premium" : agent.plan}
                        </p>
                    </div>

                    {/* Detail Grid */}
                    <div className="w-full mt-6 space-y-3">
                        {agent.agency && (
                            <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800">
                                <Building2 className="w-4 h-4 text-slate-400" />
                                <span className="text-[14px] font-medium text-slate-700 dark:text-slate-300">{agent.agency}</span>
                            </div>
                        )}
                        {agent.neighborhood && (
                            <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800">
                                <MapPin className="w-4 h-4 text-slate-400" />
                                <span className="text-[14px] font-medium text-slate-700 dark:text-slate-300">{agent.neighborhood}</span>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="w-full mt-8 grid grid-cols-2 gap-3">
                        <a
                            href={`https://wa.me/${agent.phone?.replace(/\D/g, '')}`}
                            target="_blank"
                            className="flex items-center justify-center gap-2 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-semibold text-sm transition-all shadow-md shadow-emerald-500/20 active:scale-95"
                        >
                            <Phone className="w-4 h-4" /> WhatsApp
                        </a>
                        <button
                            onClick={() => {
                                onViewPosts(agent.id)
                                onClose()
                            }}
                            className="flex items-center justify-center gap-2 py-3 bg-slate-900 dark:bg-white text-white dark:text-black rounded-lg font-semibold text-sm transition-all shadow-md active:scale-95"
                        >
                            <MessageSquare className="w-4 h-4" /> Ver Posts
                        </button>
                    </div>

                    <button
                        onClick={() => {
                            // Link to full profile or dashboard if applicable
                            window.location.href = `/profile/${agent.id}`
                        }}
                        className="mt-6 flex items-center gap-1.5 text-[12px] font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                    >
                        <span>Ver Perfil Completo</span>
                        <ExternalLink className="w-3 h-3" />
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
