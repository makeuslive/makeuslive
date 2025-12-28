'use client'

import dynamic from 'next/dynamic'

// Dynamically import the editor with SSR disabled
// This is required because MDXEditor uses browser-only APIs
const MarkdownEditor = dynamic(
    () => import('./markdown-editor'),
    {
        ssr: false,
        loading: () => (
            <div className="flex items-center justify-center h-[500px] bg-white/5 border border-white/10 rounded-lg text-white/50">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
                    <p>Loading Editor...</p>
                </div>
            </div>
        )
    }
)

export default MarkdownEditor
