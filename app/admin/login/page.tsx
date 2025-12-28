'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'

export default function AdminLoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const { signIn, isConfigured } = useAuth()

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            await signIn(email, password)
            router.push('/admin')
        } catch (err) {
            if (err instanceof Error && err.message.includes('not configured')) {
                setError('Firebase is not configured. Please set up your .env.local file.')
            } else {
                setError('Invalid email or password')
            }
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">MakeUsLive</h1>
                    <p className="text-gray-400">Admin Panel</p>
                </div>

                {/* Setup Instructions (shown when Firebase not configured) */}
                {!isConfigured && (
                    <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                        <h3 className="text-amber-400 font-semibold mb-2">⚠️ Firebase Setup Required</h3>
                        <p className="text-gray-400 text-sm mb-3">
                            To use the admin panel, you need to configure Firebase:
                        </p>
                        <ol className="text-gray-400 text-sm space-y-1 list-decimal list-inside">
                            <li>Create a project at <a href="https://console.firebase.google.com" target="_blank" rel="noopener" className="text-gold hover:underline">Firebase Console</a></li>
                            <li>Enable Authentication → Email/Password</li>
                            <li>Create a Firestore Database</li>
                            <li>Copy credentials to <code className="text-gold">.env.local</code></li>
                            <li>Restart the dev server</li>
                        </ol>
                    </div>
                )}

                {/* Login Form */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                    <h2 className="text-xl font-semibold text-white mb-6">Sign In</h2>

                    {error && (
                        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50 transition-all"
                                placeholder="admin@makeuslive.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50 transition-all"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-4 bg-gradient-to-r from-gold to-amber-500 text-black font-semibold rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-gold/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>
                </div>

                <p className="text-center text-gray-500 text-sm mt-6">
                    © 2025 MakeUsLive. All rights reserved.
                </p>
            </div>
        </div>
    )
}
