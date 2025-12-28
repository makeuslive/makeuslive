'use client'

import dynamic from 'next/dynamic'

// Dynamically import Tiptap editor with SSR disabled
const TiptapEditor = dynamic(
    () => import('./tiptap-editor'),
    {
        ssr: false,
        loading: () => (
            <div className="flex items-center justify-center h-[400px] bg-gray-50 border border-gray-200 rounded-xl">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-6 h-6 border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
                    <p className="text-gray-400 text-sm">Loading Editor...</p>
                </div>
            </div>
        )
    }
)

export default TiptapEditor
