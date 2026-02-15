"use client"

import * as React from "react"
import { Search, MapPin, Building2, TrendingUp, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

type Suggestion = {
    id: string
    label: string
    type: "location" | "property" | "feature"
    icon?: React.ReactNode
    value?: string
}

export function SmartSearch() {
    const router = useRouter()
    const [query, setQuery] = React.useState("")
    const [isOpen, setIsOpen] = React.useState(false)
    const [selectedTags, setSelectedTags] = React.useState<Suggestion[]>([])
    const [suggestions, setSuggestions] = React.useState<Suggestion[]>([])
    const [loading, setLoading] = React.useState(false)
    const containerRef = React.useRef<HTMLDivElement>(null)

    // Debounce search
    React.useEffect(() => {
        const timer = setTimeout(() => {
            if (query.length >= 2) {
                fetchSuggestions(query)
            } else {
                setSuggestions([])
            }
        }, 300)

        return () => clearTimeout(timer)
    }, [query])

    const fetchSuggestions = async (q: string) => {
        setLoading(true)
        try {
            const res = await fetch(`/api/search/suggestions?q=${encodeURIComponent(q)}`)
            const data = await res.json()
            setSuggestions(data.suggestions || [])
        } catch (error) {
            console.error("Error fetching suggestions:", error)
        } finally {
            setLoading(false)
        }
    }

    const getIcon = (type: string) => {
        switch (type) {
            case 'location': return <MapPin className="h-4 w-4 text-blue-500" />
            case 'property': return <Building2 className="h-4 w-4 text-emerald-500" />
            default: return <TrendingUp className="h-4 w-4 text-purple-500" />
        }
    }

    const handleSelect = (suggestion: Suggestion) => {
        if (!selectedTags.find(t => t.id === suggestion.id)) {
            setSelectedTags([...selectedTags, suggestion])
        }
        setQuery("")
        setIsOpen(false)
    }

    const removeTag = (id: string) => {
        setSelectedTags(selectedTags.filter((tag) => tag.id !== id))
    }

    const handleSearch = () => {
        const params = new URLSearchParams()

        selectedTags.forEach(tag => {
            if (tag.type === 'location') params.append('location', tag.value || tag.label)
            if (tag.type === 'property') params.append('type', tag.value || tag.label)
        })

        if (query) params.append('q', query)

        router.push(`/search?${params.toString()}`)
    }

    // Close on click outside
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    return (
        <div className="relative w-full max-w-2xl" ref={containerRef}>
            <div
                className={cn(
                    "relative flex w-full flex-col gap-2 rounded-2xl border border-white/10 bg-white/10 p-2 shadow-2xl backdrop-blur-xl transition-all",
                    "focus-within:bg-white/20 focus-within:ring-1 focus-within:ring-white/30",
                    isOpen && "rounded-b-none bg-slate-900/90 ring-1 ring-slate-700"
                )}
            >
                <div className="flex flex-wrap items-center gap-2 px-3 pb-1 pt-2 sm:flex-nowrap">
                    <Search className="h-5 w-5 shrink-0 text-slate-300" />

                    <div className="flex flex-1 flex-wrap items-center gap-2">
                        {selectedTags.map(tag => (
                            <Badge key={tag.id} variant="secondary" className="gap-1 bg-white/20 text-white hover:bg-white/30">
                                {tag.label}
                                <X
                                    className="h-3 w-3 cursor-pointer"
                                    onClick={(e) => { e.stopPropagation(); removeTag(tag.id); }}
                                />
                            </Badge>
                        ))}
                        <Input
                            type="text"
                            value={query}
                            onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}
                            onFocus={() => setIsOpen(true)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            placeholder={selectedTags.length > 0 ? "Agregar más filtros..." : "Buscar por ubicación, tipo (ej. Pocitos)..."}
                            className="h-10 min-w-[150px] flex-1 border-0 bg-transparent p-0 text-lg text-white placeholder:text-slate-300 focus-visible:ring-0"
                        />
                    </div>

                    <Button
                        size="lg"
                        onClick={handleSearch}
                        className="hidden h-10 rounded-xl bg-blue-600 px-6 font-semibold text-white hover:bg-blue-700 sm:flex"
                    >
                        Buscar
                    </Button>
                </div>
            </div>

            {/* Dropdown Suggestions */}
            <AnimatePresence>
                {isOpen && (suggestions.length > 0 || query.length > 1) && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 right-0 z-50 overflow-hidden rounded-b-2xl border border-t-0 border-white/10 bg-slate-900/95 backdrop-blur-xl shadow-xl"
                    >
                        <div className="p-2">
                            {suggestions.map((suggestion) => (
                                <button
                                    key={suggestion.id}
                                    onClick={() => handleSelect(suggestion)}
                                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm text-slate-200 hover:bg-white/10 transition-colors"
                                >
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800">
                                        {getIcon(suggestion.type)}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-medium">{suggestion.label}</span>
                                        <span className="text-xs text-slate-400 capitalize">{suggestion.type}</span>
                                    </div>
                                </button>
                            ))}

                            {suggestions.length === 0 && query.length > 1 && !loading && (
                                <div className="p-4 text-center text-sm text-slate-400">
                                    No se encontraron resultados para "{query}"
                                </div>
                            )}

                            {loading && (
                                <div className="p-4 text-center text-sm text-slate-400">
                                    Buscando...
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
