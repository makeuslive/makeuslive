'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Typography from '@tiptap/extension-typography'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import { FC, useEffect, useCallback, useState } from 'react'

interface EditorProps {
    markdown: string
    onChange: (markdown: string) => void
    placeholder?: string
}

// Minimal floating toolbar button
const ToolbarButton = ({
    onClick,
    isActive = false,
    disabled = false,
    children,
    title
}: {
    onClick: () => void
    isActive?: boolean
    disabled?: boolean
    children: React.ReactNode
    title?: string
}) => (
    <button
        onClick={onClick}
        disabled={disabled}
        title={title}
        type="button"
        className={`p-1.5 rounded-md transition-all ${isActive
            ? 'bg-gray-900 text-white'
            : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
            } ${disabled ? 'opacity-30 cursor-not-allowed' : ''}`}
    >
        {children}
    </button>
)

/**
 * Premium Tiptap Editor - Clean, minimal, Notion-like experience
 */
const TiptapEditor: FC<EditorProps> = ({ markdown, onChange, placeholder }) => {
    const [isFocused, setIsFocused] = useState(false)

    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit.configure({
                heading: { levels: [1, 2, 3, 4] },
            }),
            Placeholder.configure({
                placeholder: placeholder || 'Start writing your story...',
                emptyEditorClass: 'is-editor-empty',
            }),
            Typography,
            Underline,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-blue-600 underline decoration-blue-200 hover:decoration-blue-600 transition-colors',
                },
            }),
            Image.configure({
                HTMLAttributes: {
                    class: 'rounded-xl max-w-full h-auto shadow-sm',
                },
            }),
        ],
        content: markdown,
        editorProps: {
            attributes: {
                class: 'prose prose-lg prose-gray max-w-none focus:outline-none',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
        onFocus: () => setIsFocused(true),
        onBlur: () => setIsFocused(false),
    })

    useEffect(() => {
        if (editor && markdown !== editor.getHTML()) {
            editor.commands.setContent(markdown)
        }
    }, [markdown, editor])

    const addImage = useCallback(() => {
        const url = window.prompt('Enter image URL:')
        if (url && editor) {
            editor.chain().focus().setImage({ src: url }).run()
        }
    }, [editor])

    const addLink = useCallback(() => {
        const url = window.prompt('Enter URL:')
        if (url && editor) {
            editor.chain().focus().setLink({ href: url }).run()
        }
    }, [editor])

    if (!editor) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-6 h-6 border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
                    <p className="text-sm text-gray-400">Loading editor...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="tiptap-editor-wrapper relative">
            {/* Floating Toolbar - appears on focus */}
            <div className={`sticky top-0 z-10 transition-all duration-200 ${isFocused ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}`}>
                <div className="flex items-center gap-0.5 p-1.5 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl shadow-lg mx-auto w-fit mb-4">
                    {/* Text Formatting */}
                    <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} title="Bold">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12h8a4 4 0 100-8H6v8zm0 0h9a4 4 0 110 8H6v-8z" />
                        </svg>
                    </ToolbarButton>
                    <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} title="Italic">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 4h4m-2 0v16m-4 0h8" transform="skewX(-10)" />
                        </svg>
                    </ToolbarButton>
                    <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')} title="Underline">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7 8v4a5 5 0 0010 0V8M5 20h14" />
                        </svg>
                    </ToolbarButton>

                    <div className="w-px h-5 bg-gray-200 mx-1" />

                    {/* Headings */}
                    <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive('heading', { level: 2 })} title="Heading">
                        <span className="font-bold text-xs">H2</span>
                    </ToolbarButton>
                    <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} isActive={editor.isActive('heading', { level: 3 })} title="Subheading">
                        <span className="font-semibold text-xs">H3</span>
                    </ToolbarButton>

                    <div className="w-px h-5 bg-gray-200 mx-1" />

                    {/* Lists */}
                    <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} title="Bullet List">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </ToolbarButton>
                    <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')} title="Quote">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
                        </svg>
                    </ToolbarButton>

                    <div className="w-px h-5 bg-gray-200 mx-1" />

                    {/* Media */}
                    <ToolbarButton onClick={addLink} isActive={editor.isActive('link')} title="Link">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                    </ToolbarButton>
                    <ToolbarButton onClick={addImage} title="Image">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </ToolbarButton>
                </div>
            </div>

            {/* Editor Canvas */}
            <div className="editor-canvas">
                <EditorContent editor={editor} />
            </div>

            {/* Premium Editor Styles */}
            <style jsx global>{`
                .tiptap-editor-wrapper .ProseMirror {
                    min-height: 50vh;
                    padding-bottom: 40vh;
                    font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif;
                    line-height: 1.8;
                    color: #1f2937;
                }

                .tiptap-editor-wrapper .ProseMirror:focus {
                    outline: none;
                }

                .tiptap-editor-wrapper .ProseMirror > *:first-child {
                    margin-top: 0;
                }

                /* Placeholder */
                .tiptap-editor-wrapper .ProseMirror p.is-editor-empty:first-child::before {
                    content: attr(data-placeholder);
                    float: left;
                    color: #d1d5db;
                    pointer-events: none;
                    height: 0;
                    font-style: italic;
                }

                /* Typography */
                .tiptap-editor-wrapper .ProseMirror h1 {
                    font-size: 2.25rem;
                    font-weight: 800;
                    line-height: 1.2;
                    margin: 1.5em 0 0.5em;
                    color: #111827;
                    letter-spacing: -0.025em;
                }

                .tiptap-editor-wrapper .ProseMirror h2 {
                    font-size: 1.5rem;
                    font-weight: 700;
                    line-height: 1.3;
                    margin: 2em 0 0.75em;
                    color: #1f2937;
                    letter-spacing: -0.02em;
                }

                .tiptap-editor-wrapper .ProseMirror h3 {
                    font-size: 1.25rem;
                    font-weight: 600;
                    line-height: 1.4;
                    margin: 1.75em 0 0.5em;
                    color: #374151;
                }

                .tiptap-editor-wrapper .ProseMirror p {
                    font-size: 1.125rem;
                    line-height: 1.8;
                    color: #4b5563;
                    margin: 0 0 1.25em;
                }

                .tiptap-editor-wrapper .ProseMirror strong {
                    font-weight: 600;
                    color: #1f2937;
                }

                .tiptap-editor-wrapper .ProseMirror em {
                    font-style: italic;
                }

                /* Lists */
                .tiptap-editor-wrapper .ProseMirror ul,
                .tiptap-editor-wrapper .ProseMirror ol {
                    padding-left: 1.5em;
                    margin: 1.25em 0;
                }

                .tiptap-editor-wrapper .ProseMirror li {
                    color: #4b5563;
                    line-height: 1.8;
                    margin: 0.5em 0;
                }

                .tiptap-editor-wrapper .ProseMirror ul li {
                    list-style-type: disc;
                }

                .tiptap-editor-wrapper .ProseMirror ul li::marker {
                    color: #9ca3af;
                }

                .tiptap-editor-wrapper .ProseMirror ol li {
                    list-style-type: decimal;
                }

                /* Blockquote */
                .tiptap-editor-wrapper .ProseMirror blockquote {
                    position: relative;
                    border-left: 3px solid #3b82f6;
                    padding: 0.75em 0 0.75em 1.5em;
                    margin: 1.5em 0;
                    font-style: italic;
                    color: #6b7280;
                    background: linear-gradient(to right, rgba(59, 130, 246, 0.05), transparent);
                }

                .tiptap-editor-wrapper .ProseMirror blockquote p {
                    margin: 0;
                    font-size: 1.1rem;
                }

                /* Code */
                .tiptap-editor-wrapper .ProseMirror pre {
                    background: #1f2937;
                    border-radius: 0.75rem;
                    padding: 1.25em;
                    margin: 1.5em 0;
                    overflow-x: auto;
                }

                .tiptap-editor-wrapper .ProseMirror pre code {
                    background: none;
                    padding: 0;
                    color: #e5e7eb;
                    font-size: 0.9rem;
                }

                .tiptap-editor-wrapper .ProseMirror code {
                    background: #f3f4f6;
                    padding: 0.2em 0.4em;
                    border-radius: 0.375rem;
                    font-size: 0.875em;
                    color: #dc2626;
                    font-family: ui-monospace, 'SF Mono', monospace;
                }

                /* Horizontal Rule */
                .tiptap-editor-wrapper .ProseMirror hr {
                    border: none;
                    height: 1px;
                    background: linear-gradient(to right, transparent, #e5e7eb, transparent);
                    margin: 3em 0;
                }

                /* Images */
                .tiptap-editor-wrapper .ProseMirror img {
                    max-width: 100%;
                    height: auto;
                    border-radius: 0.75rem;
                    margin: 2em 0;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                }

                /* Links */
                .tiptap-editor-wrapper .ProseMirror a {
                    color: #2563eb;
                    text-decoration: underline;
                    text-decoration-color: #bfdbfe;
                    text-underline-offset: 2px;
                    transition: all 0.15s ease;
                }

                .tiptap-editor-wrapper .ProseMirror a:hover {
                    text-decoration-color: #2563eb;
                }

                /* Selection */
                .tiptap-editor-wrapper .ProseMirror ::selection {
                    background: rgba(59, 130, 246, 0.2);
                }
            `}</style>
        </div>
    )
}

export default TiptapEditor
