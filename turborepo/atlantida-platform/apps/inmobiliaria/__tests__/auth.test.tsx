import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AuthProvider, useAuth } from '../contexts/AuthContext'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { onSnapshot } from 'firebase/firestore'
import { ReactNode } from 'react'

// Helper component to access useAuth
const TestComponent = () => {
    const { user, userData, loading, logout } = useAuth()
    return (
        <div>
            <div data-testid="loading">{loading.toString()}</div>
            <div data-testid="user">{user ? user.email : 'no-user'}</div>
            <div data-testid="plan">{userData ? userData.plan : 'no-plan'}</div>
            <button onClick={() => logout()}>Logout</button>
        </div>
    )
}

describe('AuthContext', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('initializes with loading true', () => {
        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        )
        expect(screen.getByTestId('loading')).toHaveTextContent('true')
    })

    it('updates state when user signs in', async () => {
        const mockUser = { uid: '123', email: 'test@example.com' }
        const mockUserData = { plan: 'premium' }

        // Mock onAuthStateChanged to immediately call the observer with mockUser
        vi.mocked(onAuthStateChanged).mockImplementation((_auth, callback: any) => {
            callback(mockUser)
            return () => { }
        })

        // Mock onSnapshot to call with mockUserData
        vi.mocked(onSnapshot).mockImplementation((_docRef, callback: any) => {
            callback({
                exists: () => true,
                data: () => mockUserData
            })
            return () => { }
        })

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        )

        await waitFor(() => {
            expect(screen.getByTestId('loading')).toHaveTextContent('false')
        })

        expect(screen.getByTestId('user')).toHaveTextContent('test@example.com')
        expect(screen.getByTestId('plan')).toHaveTextContent('premium')
    })

    it('sets default plan to free if user document does not exist', async () => {
        const mockUser = { uid: '123', email: 'test@example.com' }

        vi.mocked(onAuthStateChanged).mockImplementation((_auth, callback: any) => {
            callback(mockUser)
            return () => { }
        })

        vi.mocked(onSnapshot).mockImplementation((_docRef, callback: any) => {
            callback({
                exists: () => false,
                data: () => null
            })
            return () => { }
        })

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        )

        await waitFor(() => {
            expect(screen.getByTestId('plan')).toHaveTextContent('free')
        })
    })

    it('clears state on logout', async () => {
        const mockUser = { uid: '123', email: 'test@example.com' }

        vi.mocked(onAuthStateChanged).mockImplementation((_auth, callback: any) => {
            callback(mockUser)
            return () => { }
        })

        vi.mocked(onSnapshot).mockImplementation((_docRef, callback: any) => {
            callback({
                exists: () => true,
                data: () => ({ plan: 'free' })
            })
            return () => { }
        })

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        )

        await waitFor(() => {
            expect(screen.getByTestId('user')).toHaveTextContent('test@example.com')
        })

        const logoutButton = screen.getByRole('button', { name: /logout/i })
        logoutButton.click()

        expect(signOut).toHaveBeenCalled()
    })
})
