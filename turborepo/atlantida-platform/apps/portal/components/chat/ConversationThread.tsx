"use client"

import { useEffect, useState, useRef } from "react"
import { db } from "@repo/lib/firebase"
import { collection, orderBy, query, onSnapshot, addDoc, serverTimestamp, doc, updateDoc, increment } from "firebase/firestore"
import type { ChatMessage } from "@/lib/chat"

interface ConversationThreadProps {
  conversationId: string
  currentUserId: string
  otherUserName: string
  propertyTitle?: string
  /** Si es el interesado (lead), al enviar el primer mensaje se crea el lead. */
  isLead?: boolean
  onFirstMessageSent?: (firstMessageText: string) => void
}

export function ConversationThread({
  conversationId: convId,
  currentUserId,
  otherUserName,
  propertyTitle,
  isLead,
  onFirstMessageSent,
}: ConversationThreadProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [sending, setSending] = useState(false)
  const [firstMessageDone, setFirstMessageDone] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!db || !convId) return
    const messagesRef = collection(db, "conversations", convId, "messages")
    const q = query(messagesRef, orderBy("createdAt", "asc"))
    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
        createdAt: d.data().createdAt,
      })) as ChatMessage[]
      setMessages(list)
      if (list.length > 0) setFirstMessageDone(true)
    })
    return () => unsub()
  }, [convId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendMessage = async () => {
    const text = input.trim()
    if (!text || !db || !convId) return

    setSending(true)
    setInput("")
    try {
      const isFirst = messages.length === 0
      await addDoc(collection(db, "conversations", convId, "messages"), {
        authorId: currentUserId,
        text,
        createdAt: serverTimestamp(),
        read: false,
      })

      // Actualizar lastMessage y contador de no leídos
      const convRef = doc(db, "conversations", convId)
      await updateDoc(convRef, {
        lastMessage: text.slice(0, 100),
        lastMessageAt: serverTimestamp(),
        lastMessageBy: currentUserId,
        ...(isLead ? { unreadByAgent: increment(1) } : { unreadByLead: increment(1) }),
      })

      if (isFirst && isLead && onFirstMessageSent) {
        onFirstMessageSent(text)
      }
    } catch (e) {
      console.error("Error sending message:", e)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="flex flex-col h-full min-h-[320px]">
      {propertyTitle && (
        <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 truncate">{propertyTitle}</p>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">{otherUserName}</p>
        </div>
      )}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <p className="text-center text-slate-400 text-sm py-8">Escribí un mensaje para iniciar la conversación.</p>
        )}
        {messages.map((msg) => {
          const isMe = msg.authorId === currentUserId
          return (
            <div
              key={msg.id}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2 ${
                  isMe
                    ? "bg-primary text-white"
                    : "bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap break-words">{msg.text}</p>
                <p className={`text-[10px] mt-1 ${isMe ? "text-white/70" : "text-slate-500"}`}>
                  {msg.createdAt && typeof (msg.createdAt as { seconds?: number }).seconds === "number"
                    ? new Date((msg.createdAt as { seconds: number }).seconds * 1000).toLocaleTimeString("es-UY", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : ""}
                </p>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>
      <div className="p-3 border-t border-slate-200 dark:border-slate-700 flex gap-2">
        <input
          type="text"
          placeholder="Escribir mensaje..."
          className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
        />
        <button
          type="button"
          onClick={sendMessage}
          disabled={sending || !input.trim()}
          className="px-4 py-3 bg-primary text-white rounded-xl font-bold text-sm disabled:opacity-50"
        >
          {sending ? "..." : "Enviar"}
        </button>
      </div>
    </div>
  )
}
