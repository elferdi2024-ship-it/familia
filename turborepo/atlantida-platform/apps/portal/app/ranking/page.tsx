"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, ChevronDown, CheckCircle2, TrendingUp, TrendingDown, Minus, MousePointerClick, MessageCircle, MapPin, Users, Activity, Clock } from "lucide-react"
import { Navbar } from "@/components/layout/Navbar"
import { AgentProfileSummary } from "@/components/feed/AgentProfileSummary"

// Mock Data
const kpis = [
    {
        title: "Total Leads (Monthly)",
        value: "24,582",
        trend: "+12.5%",
        trendUp: true,
        icon: <MousePointerClick className="w-5 h-5 text-emerald-500" />
    },
    {
        title: "Top Performing Barrio",
        value: "Pocitos",
        trend: "",
        icon: <MapPin className="w-5 h-5 text-primary" />
    },
    {
        title: "Active Pro Agents",
        value: "1,204",
        trend: "+3%",
        trendUp: true,
        icon: <Users className="w-5 h-5 text-emerald-500" />
    }
]

const agents = [
    {
        id: 1,
        rank: 1,
        trend: "up",
        name: "Santiago Rodriguez",
        agency: "Remax Gold - Carrasco",
        avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop",
        was: "842",
        clicks: "3.2k",
        plan: "ELITE",
        score: "12,850",
    },
    {
        id: 2,
        rank: 2,
        trend: "neutral",
        name: "Valentina Silva",
        agency: "Zillow Uruguay - Pocitos", // Just mock data based on screenshot
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop",
        was: "710",
        clicks: "4.1k",
        plan: "PRO PLUS",
        score: "11,420",
    },
    {
        id: 3,
        rank: 3,
        trend: "up",
        name: "Matías Méndez",
        agency: "Independent - Punta Carretas",
        avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop",
        was: "640",
        clicks: "2.8k",
        plan: "PRO",
        score: "9,850",
    },
    {
        id: 4,
        rank: 4,
        trend: "down",
        name: "Lucía Martínez",
        agency: "Propiedades UY - Malvín",
        avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop",
        was: "512",
        clicks: "2.1k",
        plan: "FREE",
        score: "7,210",
    }
]

export default function RankingPage() {
    const [timeFilter, setTimeFilter] = useState("Monthly")
    const [summaryAgent, setSummaryAgent] = useState<any | null>(null)

    return (
        <div className="min-h-screen bg-[#f8fafc] dark:bg-[#020617] selection:bg-primary/20 flex flex-col">
            <Navbar />

            {/* Agent Summary Modal */}
            {summaryAgent && (
                <AgentProfileSummary
                    isOpen={!!summaryAgent}
                    onClose={() => setSummaryAgent(null)}
                    agent={summaryAgent}
                    onViewPosts={() => {
                        window.location.href = `/feed?authorId=${summaryAgent.id}`
                    }}
                />
            )}

            <main className="flex-1 w-full max-w-6xl mx-auto px-4 pt-28 pb-24">

                {/* Header Title Space */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">Agent Ranking</h1>
                    <p className="text-slate-500 mt-2 font-medium">Top performers across Barrio.uy</p>
                </div>

                {/* KPIs */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {kpis.map((kpi, index) => (
                        <div key={index} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex items-center gap-5">
                            <div className="w-14 h-14 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0 shadow-inner">
                                {kpi.icon}
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">{kpi.title}</p>
                                <div className="flex items-baseline gap-2">
                                    <h3 className="text-2xl font-black text-slate-900 dark:text-white">{kpi.value}</h3>
                                    {kpi.trend && (
                                        <span className={`text-sm font-black ${kpi.trendUp ? "text-emerald-500" : "text-rose-500"}`}>
                                            {kpi.trend}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Filters & Search */}
                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-4 md:p-6 mb-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                        <div className="relative w-full md:w-72">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search agents..."
                                className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                            />
                        </div>
                        <div className="relative w-full md:w-48">
                            <select className="w-full appearance-none pl-4 pr-10 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer">
                                <option>All Barrios</option>
                                <option>Pocitos</option>
                                <option>Carrasco</option>
                                <option>Punta Carretas</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                            {['Monthly', 'Weekly', 'All Time'].map((tab) => (
                                <button
                                    key={tab}
                                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${timeFilter === tab
                                        ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                                        : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                                        }`}
                                    onClick={() => setTimeFilter(tab)}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400 shrink-0">
                            <Clock className="w-3.5 h-3.5" />
                            Updated: 2 mins ago
                        </div>
                    </div>
                </div>

                {/* Table/List View */}
                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">

                    {/* Table Header */}
                    <div className="grid grid-cols-12 gap-4 p-6 border-b border-slate-100 dark:border-slate-800 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50 dark:bg-slate-800/20 hidden md:grid">
                        <div className="col-span-1">Rank</div>
                        <div className="col-span-4">Agent Profile</div>
                        <div className="col-span-3">Lead Intent Breakdown</div>
                        <div className="col-span-2">Plan Status</div>
                        <div className="col-span-2 text-right pr-8">Merit Score</div>
                    </div>

                    {/* Table Body */}
                    <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
                        {agents.map((agent) => {
                            const formatRank = agent.rank.toString().padStart(2, '0')
                            return (
                                <div
                                    key={agent.id}
                                    className="grid grid-cols-1 md:grid-cols-12 gap-4 p-6 items-center hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group cursor-pointer relative"
                                    onClick={() => setSummaryAgent({
                                        id: agent.id.toString(),
                                        name: agent.name,
                                        avatar: agent.avatar,
                                        verified: true, // Assuming top ranked are verified or logic exists
                                        plan: agent.plan.toLowerCase(),
                                        agency: agent.agency
                                    })}
                                >

                                    {/* Rank */}
                                    <div className="col-span-1 flex items-center gap-3">
                                        <span className="text-xl font-black text-slate-900 dark:text-white">{formatRank}</span>
                                        {agent.trend === "up" && <TrendingUp className="w-4 h-4 text-emerald-500" />}
                                        {agent.trend === "neutral" && <Minus className="w-4 h-4 text-slate-300 dark:text-slate-600" />}
                                        {agent.trend === "down" && <TrendingDown className="w-4 h-4 text-rose-500" />}
                                    </div>

                                    {/* Profile */}
                                    <div className="col-span-4 flex items-center gap-4">
                                        <img src={agent.avatar} alt={agent.name} className="w-12 h-12 rounded-full object-cover shadow-sm bg-slate-100" />
                                        <div>
                                            <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-tight">{agent.name}</h4>
                                            <p className="text-[11px] font-medium text-slate-500 mt-0.5">{agent.agency}</p>
                                        </div>
                                    </div>

                                    {/* Lead Intent */}
                                    <div className="col-span-3 flex items-center gap-4 mt-4 md:mt-0">
                                        <div className="flex items-center gap-1.5">
                                            <MessageCircle className="w-4 h-4 text-emerald-500 fill-emerald-500/20" />
                                            <span className="font-black text-xs text-slate-900 dark:text-white">{agent.was}</span>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase">WAs</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <MousePointerClick className="w-4 h-4 text-primary fill-primary/20" />
                                            <span className="font-black text-xs text-slate-900 dark:text-white">{agent.clicks}</span>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase">Clicks</span>
                                        </div>
                                    </div>

                                    {/* Plan */}
                                    <div className="col-span-2 mt-4 md:mt-0">
                                        <span className={`inline-flex px-3 py-1 border text-[10px] font-black uppercase tracking-widest rounded-full ${agent.plan === 'ELITE' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30 dark:bg-emerald-500/20 dark:text-emerald-400' :
                                            agent.plan === 'PRO PLUS' ? 'bg-primary/10 text-primary border-primary/30 dark:bg-primary/20 dark:text-blue-400' :
                                                agent.plan === 'PRO' ? 'bg-indigo-500/10 text-indigo-500 border-indigo-500/30 dark:bg-indigo-500/20 dark:text-indigo-400' :
                                                    'bg-slate-500/10 text-slate-500 border-slate-500/30 dark:bg-slate-500/20 dark:text-slate-400'
                                            }`}>
                                            {agent.plan}
                                        </span>
                                    </div>

                                    {/* Merit Score */}
                                    <div className="col-span-2 flex items-center justify-between md:justify-end mt-4 md:mt-0 gap-8">
                                        <div className={`text-lg md:text-xl font-black ${agent.plan === 'ELITE' ? 'text-emerald-500' : 'text-slate-900 dark:text-white'
                                            }`}>
                                            {agent.score}
                                        </div>
                                        <div className="w-6 h-6 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:bg-primary group-hover:text-white transition-colors border border-slate-200 dark:border-slate-700 group-hover:border-primary shrink-0">
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* Pagination Footer */}
                    <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-50/30 dark:bg-slate-800/10">
                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                            Showing 1-4 of 482 Agents
                        </p>
                        <div className="flex items-center gap-2">
                            <button className="px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-xl text-xs font-bold text-slate-400 cursor-not-allowed">
                                Previous
                            </button>
                            <button className="px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm">
                                Next Page
                            </button>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    )
}
