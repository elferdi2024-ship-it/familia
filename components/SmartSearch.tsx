"use client"

import * as React from "react"
import { Search, MapPin, Building2, TrendingUp, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

type Suggestion = {
    id: string
    label: string
    type: "location" | "property" | "feature"
    icon: React.ReactNode
}

const MOCK_SUGGESTIONS: Suggestion[] = [
    { id: "pocitos", label: "Pocitos, Montevideo", type: "location", icon: <MapPin className="h-4 w-4 text-blue-500" /> },
    { id: "carrasco", label: "Carrasco, Montevideo", type: "location", icon: <MapPin className="h-4 w-4 text-blue-500" /> },
    { id: "punta-carretas", label: "Punta Carretas, Montevideo", type: "location", icon: <MapPin className="h-4 w-4 text-blue-500" /> },
    { id: "jose-ignacio", label: "José Ignacio, Maldonado", type: "location", icon: <MapPin className="h-4 w-4 text-blue-500" /> },
    { id: "penthouse", label: "Penthouse", type: "property", icon: <Building2 className="h-4 w-4 text-emerald-500" /> },
    { id: "casa", label: "Casa con Jardín", type: "property", icon: <Building2 className="h-4 w-4 text-emerald-500" /> },
    { id: "vista-mar", label: "Vista al Mar", type: "feature", icon: <TrendingUp className="h-4 w-4 text-purple-500" /> },
    { id: "pozo", label: "Proyectos en Pozo", type: "feature", icon: <TrendingUp className="h-4 w-4 text-purple-500" /> },
]

export function SmartSearch() {
    const [query, setQuery] = React.useState("")
    const [isOpen, setIsOpen] = React.useState(false)
    const [selectedTags, setSelectedTags] = React.useState<Suggestion[]>([])
    const containerRef = React.useRef<HTMLDivElement>(null)

    const filteredSuggestions = MOCK_SUGGESTIONS.filter(
        (item) =>
            item.label.toLowerCase().includes(query.toLowerCase()) &&
            !selectedTags.find((tag) => tag.id === item.id)
    )

    const handleSelect = (suggestion: Suggestion) => {
        setSelectedTags([...selectedTags, suggestion])
        setQuery("")
        // Keep open for multiple selection or close? Let's keep input focused but maybe close dropdown if we want single select behavior usually search is complex. 
        // For this UX, adding tags feels "smart".
    }

    const removeTag = (id: string) => {
        setSelectedTags(selectedTags.filter((tag) => tag.id !== id))
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
                            placeholder={selectedTags.length > 0 ? "Agregar más filtros..." : "Buscar por ubicación, tipo..."}
                            className="h-10 min-w-[150px] flex-1 border-0 bg-transparent p-0 text-lg text-white placeholder:text-slate-300 focus-visible:ring-0"
                        />
                    </div>

                    <Button size="lg" className="hidden h-10 rounded-xl bg-blue-600 px-6 font-semibold text-white hover:bg-blue-700 sm:flex">
                        Buscar
                    </Button>
                </div>
            </div>

            {/* Dropdown Suggestions */}
            <AnimatePresence>
                {isOpen && (filteredSuggestions.length > 0 || query.length === 0) && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 right-0 z-50 overflow-hidden rounded-b-2xl border border-t-0 border-white/10 bg-slate-900/95 backdrop-blur-xl shadow-xl"
                    >
                        <div className="p-2">
                            {query === "" && selectedTags.length === 0 && (
                                <div className="px-4 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                    Sugerencias Populares
                                </div>
                            )}

                            {filteredSuggestions.map((suggestion) => (
                                <button
                                    key={suggestion.id}
                                    onClick={() => handleSelect(suggestion)}
                                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm text-slate-200 hover:bg-white/10 transition-colors"
                                >
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800">
                                        {suggestion.icon}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-medium">{suggestion.label}</span>
                                        <span className="text-xs text-slate-400 capitalize">{suggestion.type}</span>
                                    </div>
                                </button>
                            ))}

                            {filteredSuggestions.length === 0 && query !== "" && (
                                <div className="p-4 text-center text-sm text-slate-400">
                                    No se encontraron resultados para "{query}"
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
