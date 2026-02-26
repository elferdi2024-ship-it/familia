/**
 * Chat interno: helpers para conversationId y tipos.
 * Schema: conversations/ + conversations/{id}/messages/
 */

import type { Firestore } from "firebase/firestore"
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore"

export function conversationId(agentId: string, leadId: string, propertyId: string): string {
  return `${agentId}_${leadId}_${propertyId}`
}

export interface CreateConversationParams {
  agentId: string
  leadId: string
  leadName: string
  leadEmail: string
  propertyId: string
  propertyTitle: string
}

/** Crea la conversación si no existe y devuelve el id. */
export async function getOrCreateConversation(
  db: Firestore,
  params: CreateConversationParams
): Promise<string> {
  const id = conversationId(params.agentId, params.leadId, params.propertyId)
  const ref = doc(db, "conversations", id)
  const snap = await getDoc(ref)
  if (snap.exists()) return id
  await setDoc(ref, {
    participantIds: [params.agentId, params.leadId].sort(),
    propertyId: params.propertyId,
    propertyTitle: params.propertyTitle,
    agentId: params.agentId,
    leadId: params.leadId,
    leadName: params.leadName,
    leadEmail: params.leadEmail,
    lastMessage: null,
    lastMessageAt: null,
    lastMessageBy: null,
    createdAt: serverTimestamp(),
    unreadByAgent: 0,
    unreadByLead: 0,
  })
  return id
}

export interface ChatMessage {
  id: string;
  authorId: string;
  text: string;
  createdAt: { seconds: number; nanoseconds?: number } | Date;
  read?: boolean;
}

export interface Conversation {
  id: string;
  participantIds: string[];
  propertyId: string;
  propertyTitle: string;
  agentId: string;
  leadId: string;
  leadName: string;
  leadEmail: string;
  lastMessage?: string;
  lastMessageAt?: { seconds: number; nanoseconds?: number };
  lastMessageBy?: string;
  createdAt: { seconds: number; nanoseconds?: number } | Date;
  unreadByAgent: number;
  unreadByLead: number;
  conversationId?: string; // alias for id when embedded in lead
}
