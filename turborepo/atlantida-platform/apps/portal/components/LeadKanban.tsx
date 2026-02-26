"use client"

import { useState, useCallback } from "react"
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd"
import Link from "next/link"
import { Lock } from "lucide-react"

export type LeadStatus = "new" | "contacted" | "negotiating" | "closed"

export interface Lead {
  id: string
  propertyId: string
  propertyTitle: string
  agentId: string
  leadName: string
  leadEmail: string
  leadMessage: string
  createdAt: { seconds?: number; nanoseconds?: number }
  status: LeadStatus
  contactType?: "contact" | "visit"
  visitDate?: string
  visitTime?: string
  conversationId?: string
  source?: string
}

const COLUMNS: { id: LeadStatus; label: string; color: string }[] = [
  { id: "new", label: "Nuevo", color: "bg-amber-500/20 border-amber-500/40 text-amber-800 dark:text-amber-200" },
  { id: "contacted", label: "Contactado", color: "bg-blue-500/20 border-blue-500/40 text-blue-800 dark:text-blue-200" },
  { id: "negotiating", label: "Negociando", color: "bg-violet-500/20 border-violet-500/40 text-violet-800 dark:text-violet-200" },
  { id: "closed", label: "Cerrado", color: "bg-emerald-500/20 border-emerald-500/40 text-emerald-800 dark:text-emerald-200" },
]

function LeadCard({
  lead,
  onOpenDetail,
  isProOrPremium,
}: {
  lead: Lead
  onOpenDetail: (l: Lead) => void
  isProOrPremium: boolean
}) {
  const dateStr = lead.createdAt?.seconds
    ? new Date(lead.createdAt.seconds * 1000).toLocaleDateString("es-UY", { day: "numeric", month: "short" })
    : "Hoy"

  return (
    <div
      className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
      onClick={() => onOpenDetail(lead)}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="font-bold text-slate-900 dark:text-white truncate">{lead.leadName}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">{lead.leadEmail}</p>
          <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500 truncate mt-1">{lead.propertyTitle}</p>
        </div>
        <span className="text-[10px] font-semibold text-slate-400 shrink-0">{dateStr}</span>
      </div>
      <div className="mt-2 flex items-center gap-1.5">
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase border ${
            lead.contactType === "visit" ? "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400" : "bg-slate-50 dark:bg-slate-800/50 text-slate-500"
          }`}
        >
          {lead.contactType === "visit" ? "Visita" : "Consulta"}
        </span>
      </div>
    </div>
  )
}

interface LeadKanbanProps {
  leads: Lead[]
  onStatusChange: (leadId: string, newStatus: LeadStatus) => Promise<void>
  userPlan: "free" | "pro" | "premium" | "elite"
  searchTerm: string
  onExportCSV: () => void
  renderLeadDetailModal: (lead: Lead | null, onClose: () => void) => React.ReactNode
}

export function LeadKanban({
  leads,
  onStatusChange,
  userPlan,
  searchTerm,
  onExportCSV,
  renderLeadDetailModal,
}: LeadKanbanProps) {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const isProOrPremium = userPlan === "pro" || userPlan === "premium" || userPlan === "elite"

  const filteredLeads = leads.filter(
    (l) =>
      l.leadName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.leadEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.propertyTitle.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const leadsByStatus = COLUMNS.reduce(
    (acc, col) => {
      acc[col.id] = filteredLeads.filter((l) => (l.status || "new") === col.id)
      return acc
    },
    {} as Record<LeadStatus, Lead[]>
  )

  const handleDragEnd = useCallback(
    async (result: DropResult) => {
      if (!result.destination || !isProOrPremium) return
      const { draggableId, destination } = result
      const newStatus = destination.droppableId as LeadStatus
      if (!COLUMNS.some((c) => c.id === newStatus)) return
      await onStatusChange(draggableId, newStatus)
    },
    [onStatusChange, isProOrPremium]
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between items-center gap-4">
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
            Pipeline de Interesados
          </h2>
          <p className="text-slate-500 font-medium">
            Arrastrá las tarjetas entre columnas para actualizar el estado. {!isProOrPremium && "Mejorá a Pro para desbloquear."}
          </p>
        </div>
        <button
          onClick={onExportCSV}
          className="px-4 py-2.5 bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 rounded-lg font-semibold text-xs uppercase tracking-wide hover:bg-slate-700 dark:hover:bg-slate-300 transition-colors flex items-center gap-2"
        >
          <span className="material-icons text-xs">download</span> Exportar
        </button>
      </div>

      {leads.length === 0 ? (
        <div className="py-20 flex flex-col items-center text-center px-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center mb-5">
            <span className="material-icons text-slate-300 text-4xl">inbox_customize</span>
          </div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">Aún no hay leads</h3>
          <p className="text-slate-500 max-w-sm font-medium leading-relaxed">
            Las consultas de los interesados aparecerán aquí automáticamente en tiempo real.
          </p>
        </div>
      ) : (
        <div className={`relative ${!isProOrPremium ? "select-none" : ""}`}>
          {!isProOrPremium && (
            <div className="absolute inset-0 z-10 bg-slate-900/50 backdrop-blur-[2px] rounded-xl flex flex-col items-center justify-center min-h-[320px]">
              <Lock className="w-12 h-12 text-white/80 mb-3" />
              <p className="text-white font-bold text-center px-4">
                Pipeline Kanban exclusivo de Plan Pro y Premium
              </p>
              <Link
                href="/publish/pricing"
                className="mt-4 px-6 py-2.5 bg-white text-slate-900 rounded-xl font-bold text-sm hover:bg-slate-100 transition-colors"
              >
                Mejorá a Pro para activar →
              </Link>
            </div>
          )}
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto pb-4">
              {COLUMNS.map((col) => (
                <Droppable key={col.id} droppableId={col.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`min-w-[260px] rounded-xl border-2 p-4 min-h-[280px] transition-colors ${
                        snapshot.isDraggingOver
                          ? "border-primary/50 bg-primary/5 dark:bg-primary/10"
                          : "border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30"
                      }`}
                    >
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border mb-4 ${col.color}`}>
                        <span className="text-xs font-black uppercase tracking-widest">{col.label}</span>
                        <span className="text-xs font-bold bg-white/50 dark:bg-black/20 px-1.5 rounded">
                          {leadsByStatus[col.id].length}
                        </span>
                      </div>
                      <div className="space-y-3">
                        {leadsByStatus[col.id].map((lead, index) => (
                          <Draggable
                            key={lead.id}
                            draggableId={lead.id}
                            index={index}
                            isDragDisabled={!isProOrPremium}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <LeadCard
                                  lead={lead}
                                  onOpenDetail={setSelectedLead}
                                  isProOrPremium={isProOrPremium}
                                />
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    </div>
                  )}
                </Droppable>
              ))}
            </div>
          </DragDropContext>
        </div>
      )}

      {renderLeadDetailModal(selectedLead, () => setSelectedLead(null))}
    </div>
  )
}
