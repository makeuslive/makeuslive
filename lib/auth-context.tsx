'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import {
    User,
    signInWithEmailAndPassword,
    signOut as firebaseSignOut,
    onAuthStateChanged,
} from 'firebase/auth'
import { auth, isFirebaseConfigured } from '@/lib/firebase'

interface AuthContextType {
    user: User | null
    loading: boolean
    isConfigured: boolean
    signIn: (email: string, password: string) => Promise<void>
    signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!isFirebaseConfigured) {
            setLoading(false)
            return
        }

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user)
            setLoading(false)
        })

        return () => unsubscribe()
    }, [])

    const signIn = async (email: string, password: string) => {
        if (!isFirebaseConfigured) {
            throw new Error('Firebase is not configured. Please add your Firebase credentials to .env.local')
        }
        await signInWithEmailAndPassword(auth, email, password)
    }

    const signOut = async () => {
        if (!isFirebaseConfigured) return
        await firebaseSignOut(auth)
    }

    return (
        <AuthContext.Provider value={{ user, loading, isConfigured: isFirebaseConfigured, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
