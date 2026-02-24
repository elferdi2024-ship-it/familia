import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { auth } from '@repo/lib/firebase'
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    createUserWithEmailAndPassword
} from 'firebase/auth'

// Mock Firebase
vi.mock('@repo/lib/firebase', () => ({
    auth: {
        onAuthStateChanged: vi.fn(),
        currentUser: { uid: 'user-123', email: 'test@test.com' }
    }
}))

vi.mock('firebase/auth', () => ({
    onAuthStateChanged: vi.fn(),
    signOut: vi.fn(),
    signInWithEmailAndPassword: vi.fn(),
    createUserWithEmailAndPassword: vi.fn(),
    signInWithPopup: vi.fn(),
    GoogleAuthProvider: vi.fn(),
    updateProfile: vi.fn(),
    sendEmailVerification: vi.fn(),
}))

describe('AuthContext', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('initializes with loading state and then provides user', async () => {
        let authCallback: any
            ; (onAuthStateChanged as any).mockImplementation((_auth: any, callback: any) => {
                authCallback = callback
                return vi.fn() // unsubscribe
            })

        const wrapper = ({ children }: any) => <AuthProvider>{children}</AuthProvider>
        const { result } = renderHook(() => useAuth(), { wrapper })

        expect(result.current.loading).toBe(true)

        // Simulate auth state change
        await act(async () => {
            authCallback({ uid: 'user-456', email: 'new@test.com' })
        })

        expect(result.current.loading).toBe(false)
        expect(result.current.user?.uid).toBe('user-456')
    })

    it('calls signInWithEmailAndPassword on login', async () => {
        ; (onAuthStateChanged as any).mockImplementation(() => vi.fn())
        const wrapper = ({ children }: any) => <AuthProvider>{children}</AuthProvider>
        const { result } = renderHook(() => useAuth(), { wrapper })

        await act(async () => {
            await result.current.loginWithEmail('test@email.com', 'password123')
        })

        expect(signInWithEmailAndPassword).toHaveBeenCalledWith(auth, 'test@email.com', 'password123')
    })

    it('calls signOut on logout', async () => {
        ; (onAuthStateChanged as any).mockImplementation(() => vi.fn())
        const wrapper = ({ children }: any) => <AuthProvider>{children}</AuthProvider>
        const { result } = renderHook(() => useAuth(), { wrapper })

        await act(async () => {
            await result.current.logout()
        })

        expect(signOut).toHaveBeenCalledWith(auth)
    })
})
