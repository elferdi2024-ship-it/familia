"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { auth } from "@repo/lib/firebase"
import Link from "next/link"
import { toast } from "sonner"

type Plan = 'free' | 'pro' | 'premium' | 'elite'

interface AdminUser {
    uid: string
    displayName: string | null
    email: string | null
    plan: string
    role: string | null
    updatedAt: string | null
}

export default function CreatorPage() {
    const { user, loading: authLoading } = useAuth()
    const [canManage, setCanManage] = useState(false)
    const [users, setUsers] = useState<AdminUser[]>([])
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState<string | null>(null)

    useEffect(() => {
        if (!user || !auth) return
        auth.currentUser?.getIdToken().then((token) => {
            if (!token) return
            fetch('/api/admin/me', { headers: { Authorization: `Bearer ${token}` } })
                .then((r) => r.json())
                .then((data) => {
                    setCanManage(!!data.canManage)
                    if (!data.canManage) setLoading(false)
                })
                .catch(() => setLoading(false))
        })
    }, [user])

    useEffect(() => {
        if (!canManage || !auth?.currentUser) return
        auth.currentUser.getIdToken().then((token) => {
            fetch('/api/admin/users', { headers: { Authorization: `Bearer ${token}` } })
                .then((r) => r.json())
                .then((data) => {
                    if (data.users) setUsers(data.users)
                })
                .catch(() => toast.error('Error al cargar usuarios'))
                .finally(() => setLoading(false))
        })
    }, [canManage])

    const setPlan = async (userId: string, plan: Plan) => {
        if (!auth?.currentUser) return
        setUpdating(userId)
        try {
            const token = await auth.currentUser.getIdToken()
            const res = await fetch('/api/admin/set-plan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ plan, userId })
            })
            const data = await res.json()
            if (res.ok) {
                setUsers((prev) => prev.map((u) => u.uid === userId ? { ...u, plan } : u))
                if (userId === user?.uid) toast.success('Tu plan se actualizó.')
                else toast.success(`Plan de ${userId} actualizado a ${plan}.`)
            } else toast.error(data.error || 'Error al actualizar plan')
        } catch {
            toast.error('Error al actualizar plan')
        } finally {
            setUpdating(null)
        }
    }

    if (authLoading || (user && loading)) {
        return (
            <div className="min-h-screen bg-[#f8fafc] dark:bg-[#020617] pt-24 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
        )
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-[#f8fafc] dark:bg-[#020617] pt-24 flex flex-col items-center justify-center gap-6 px-4">
                <p className="text-slate-600 dark:text-slate-400 font-medium">Debes iniciar sesión para acceder al Panel Creador.</p>
                <Link href="/my-properties" className="text-primary font-bold hover:underline">Ir al Dashboard</Link>
            </div>
        )
    }

    if (!canManage) {
        return (
            <div className="min-h-screen bg-[#f8fafc] dark:bg-[#020617] pt-24 flex flex-col items-center justify-center gap-6 px-4">
                <p className="text-slate-600 dark:text-slate-400 font-medium">No tienes permiso para acceder al Panel Creador.</p>
                <Link href="/my-properties" className="text-primary font-bold hover:underline">Volver al Dashboard</Link>
            </div>
        )
    }

    const plans: { value: Plan; label: string }[] = [
        { value: 'free', label: 'Free' },
        { value: 'pro', label: 'Pro' },
        { value: 'premium', label: 'Premium' },
        { value: 'elite', label: 'Elite' },
    ]

    const myPlan = users.find((u) => u.uid === user.uid)?.plan || 'free'

    return (
        <div className="min-h-screen bg-[#f8fafc] dark:bg-[#020617] pt-24 md:pt-32 pb-24 px-4">
            <div className="max-w-5xl mx-auto space-y-8">
                <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Panel Creador</h1>
                        <p className="text-slate-500 font-medium mt-1">Gestiona planes de usuarios (Free, Pro, Premium, Elite).</p>
                    </div>
                    <Link
                        href="/my-properties"
                        className="inline-flex items-center gap-2 text-primary font-bold hover:underline"
                    >
                        <span className="material-icons text-lg">arrow_back</span> Volver al Dashboard
                    </Link>
                </header>

                <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                        <h2 className="text-lg font-black text-slate-900 dark:text-white">Tu cuenta</h2>
                        <p className="text-sm text-slate-500 mt-1">
                            {user.displayName || user.email || user.uid} · Plan actual: <strong>{myPlan}</strong>
                        </p>
                        <div className="flex flex-wrap gap-2 mt-4">
                            {plans.map((p) => (
                                <button
                                    key={p.value}
                                    type="button"
                                    onClick={() => setPlan(user.uid, p.value)}
                                    disabled={updating === user.uid}
                                    className={`px-4 py-2 rounded-xl text-sm font-bold uppercase tracking-widest transition-all disabled:opacity-50 ${
                                        myPlan === p.value ? 'ring-2 ring-primary ring-offset-2' : ''
                                    } ${
                                        p.value === 'free'
                                            ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                                            : p.value === 'pro'
                                                ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-900/60'
                                                : p.value === 'premium' || p.value === 'elite'
                                                    ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-900/60'
                                                    : 'bg-slate-100 text-slate-700'
                                    }`}
                                >
                                    {p.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                        <h2 className="text-lg font-black text-slate-900 dark:text-white">Usuarios (Firestore)</h2>
                        <p className="text-sm text-slate-500 mt-1">Hasta 200 registros. Asigna plan por usuario.</p>
                    </div>
                    <div className="overflow-x-auto">
                        {users.length === 0 ? (
                            <div className="p-12 text-center text-slate-500 font-medium">No hay usuarios en la colección o no se pudieron cargar.</div>
                        ) : (
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                                        <th className="p-4 text-[10px] font-black uppercase text-slate-500 tracking-widest">Nombre / Email</th>
                                        <th className="p-4 text-[10px] font-black uppercase text-slate-500 tracking-widest">UID</th>
                                        <th className="p-4 text-[10px] font-black uppercase text-slate-500 tracking-widest">Plan actual</th>
                                        <th className="p-4 text-[10px] font-black uppercase text-slate-500 tracking-widest">Asignar plan</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((u) => (
                                        <tr key={u.uid} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                                            <td className="p-4">
                                                <span className="font-medium text-slate-900 dark:text-white">{u.displayName || '—'}</span>
                                                {u.email && <span className="block text-xs text-slate-500">{u.email}</span>}
                                            </td>
                                            <td className="p-4 font-mono text-xs text-slate-500 truncate max-w-[140px]">{u.uid}</td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded-lg text-xs font-bold uppercase ${
                                                    u.plan === 'pro' ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300' :
                                                    u.plan === 'premium' || u.plan === 'elite' ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300' :
                                                    'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                                                }`}>
                                                    {u.plan || 'free'}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex flex-wrap gap-1">
                                                    {plans.map((p) => (
                                                        <button
                                                            key={p.value}
                                                            type="button"
                                                            disabled={updating === u.uid}
                                                            onClick={() => setPlan(u.uid, p.value)}
                                                            className={`px-2 py-1 rounded-lg text-xs font-bold uppercase disabled:opacity-50 ${
                                                                u.plan === p.value
                                                                    ? 'ring-2 ring-primary ring-offset-1'
                                                                    : ''
                                                            } ${
                                                                p.value === 'free' ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 hover:bg-slate-200' :
                                                                p.value === 'pro' ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 hover:bg-indigo-200' :
                                                                'bg-amber-100 dark:bg-amber-900/40 text-amber-600 hover:bg-amber-200'
                                                            }`}
                                                        >
                                                            {p.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
