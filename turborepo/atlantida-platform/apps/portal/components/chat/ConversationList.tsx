"use client"

import { useEffect, useState } from "react"
import { db } from "@repo/lib/firebase"
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore"
import type { Conversation } from "@/lib/chat"
import { ConversationThread } from "./ConversationThread"

interface ConversationListProps {
  agentId: string
  userPlan: "free" | "pro" | "premium" | "elite"
}

export function ConversationList({ agentId, userPlan }: ConversationListProps) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const isProOrPremium = userPlan === "pro" || userPlan === "premium" || userPlan === "elite"

  useEffect(() => {
    if (!db || !agentId) return
    const q = query(
      collection(db, "conversations"),
      where("agentId", "==", agentId),
      orderBy("lastMessageAt", "desc")
    )
    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Conversation))
      setConversations(list)
    })
    return () => unsub()
  }, [agentId])

  const selected = conversations.find((c) => c.id === selectedId)

  if (!isProOrPremium) {
    return (
      <div className="relative rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/30 overflow-hidden min-h-[200px]">
        <div className="absolute inset-0 z-10 bg-slate-900/60 backdrop-blur-sm flex flex-col items-center justify-center p-6">
          <span className="material-icons text-white/80 text-4xl mb-3">chat_bubble</span>
          <p className="text-white font-bold text-center mb-2">Mensajes en tiempo real</p>
          <p className="text-white/80 text-sm text-center mb-4">Disponible en Plan Pro y Premium</p>
          <a
            href="/publish/pricing"
            className="px-5 py-2.5 bg-white text-slate-900 rounded-xl font-bold text-sm hover:bg-slate-100"
          >
            Mejorá a Pro →
          </a>
        </div>
        <div className="p-4 opacity-0 pointer-events-none">
          <p className="text-sm text-slate-500">Sin conversaciones</p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 min-h-[400px]">
        <div className="border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-700 overflow-y-auto max-h-[400px]">
          <div className="p-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white">Conversaciones</h3>
            <p className="text-xs text-slate-500">{conversations.length} hilos</p>
          </div>
          {conversations.length === 0 ? (
            <p className="p-4 text-sm text-slate-500">Aún no hay mensajes.</p>
          ) : (
            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
              {conversations.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(c.id)}
                    className={`w-full text-left p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${
                      selectedId === c.id ? "bg-primary/10 dark:bg-primary/20" : ""
                    }`}
                  >
                    <p className="font-semibold text-slate-900 dark:text-white truncate">{c.leadName}</p>
                    <p className="text-xs text-slate-500 truncate">{c.propertyTitle}</p>
                    {c.lastMessage && (
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 truncate">{c.lastMessage}</p>
                    )}
                    {c.unreadByAgent > 0 && (
                      <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] rounded-full bg-primary text-white text-[10px] font-bold mt-1">
                        {c.unreadByAgent}
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="md:col-span-2 flex flex-col min-h-[360px]">
          {selected ? (
            <ConversationThread
              conversationId={selected.id}
              currentUserId={agentId}
              otherUserName={selected.leadName}
              propertyTitle={selected.propertyTitle}
              isLead={false}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-500 text-sm p-8">
              Seleccioná una conversación
            </div>
          )}
        </div>
      </div>

    </div>
  )
}
