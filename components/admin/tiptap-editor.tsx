'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Typography from '@tiptap/extension-typography'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import { FC, useEffect, useCallback } from 'react'

interface EditorProps {
    markdown: string
    onChange: (markdown: string) => void
    placeholder?: string
}

// Toolbar button component
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
        className={`p-2 rounded-lg transition-all ${isActive
            ? 'bg-blue-100 text-blue-700'
            : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
        {children}
    </button>
)

// Divider component
const Divider = () => <div className="w-px h-6 bg-gray-200 mx-1" />

/**
 * Professional Tiptap Editor - Notion-like experience
 */
const TiptapEditor: FC<EditorProps> = ({ markdown, onChange, placeholder }) => {
    const editor = useEditor({
        immediatelyRender: false, // Prevent SSR hydration mismatch
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3, 4],
                },
            }),
            Placeholder.configure({
                placeholder: placeholder || 'Start writing...',
                emptyEditorClass: 'is-editor-empty',
            }),
            Typography,
            Underline,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-blue-600 underline',
                },
            }),
            Image.configure({
                HTMLAttributes: {
                    class: 'rounded-lg max-w-full h-auto',
                },
            }),
        ],
        content: markdown,
        editorProps: {
            attributes: {
                class: 'prose prose-gray max-w-none focus:outline-none min-h-[400px] px-0 py-4',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
    })

    // Update content if markdown changes externally
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
            <div className="flex items-center justify-center h-[400px] bg-gray-50 rounded-xl">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-200 border-t-blue-600"></div>
            </div>
        )
    }

    return (
        <div className="tiptap-editor bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 border-b border-gray-200 bg-gray-50">
                {/* Text Formatting */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    isActive={editor.isActive('bold')}
                    title="Bold (⌘B)"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 12h8a4 4 0 100-8H6v8zm0 0h9a4 4 0 110 8H6v-8z" />
                    </svg>
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    isActive={editor.isActive('italic')}
                    title="Italic (⌘I)"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 4h4m-2 0v16m-4 0h8" transform="skewX(-10)" />
                    </svg>
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    isActive={editor.isActive('underline')}
                    title="Underline (⌘U)"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8v4a5 5 0 0010 0V8M5 20h14" />
                    </svg>
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    isActive={editor.isActive('strike')}
                    title="Strikethrough"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.5 10H6.5m11 0c0-2.21-1.79-4-4-4H10c-2.21 0-4 1.79-4 4m11.5 4H6.5m11 0c0 2.21-1.79 4-4 4H10c-2.21 0-4-1.79-4-4M4 12h16" />
                    </svg>
                </ToolbarButton>

                <Divider />

                {/* Headings */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    isActive={editor.isActive('heading', { level: 1 })}
                    title="Heading 1"
                >
                    <span className="font-bold text-sm">H1</span>
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    isActive={editor.isActive('heading', { level: 2 })}
                    title="Heading 2"
                >
                    <span className="font-bold text-sm">H2</span>
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    isActive={editor.isActive('heading', { level: 3 })}
                    title="Heading 3"
                >
                    <span className="font-semibold text-sm">H3</span>
                </ToolbarButton>

                <Divider />

                {/* Lists */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    isActive={editor.isActive('bulletList')}
                    title="Bullet List"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    isActive={editor.isActive('orderedList')}
                    title="Numbered List"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h10M7 16h10M4 8h.01M4 12h.01M4 16h.01" />
                    </svg>
                </ToolbarButton>

                <Divider />

                {/* Block Elements */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    isActive={editor.isActive('blockquote')}
                    title="Quote"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16h6m2 4H7a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v12a2 2 0 01-2 2z" />
                    </svg>
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    isActive={editor.isActive('codeBlock')}
                    title="Code Block"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().setHorizontalRule().run()}
                    title="Horizontal Rule"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
                    </svg>
                </ToolbarButton>

                <Divider />

                {/* Media & Links */}
                <ToolbarButton onClick={addLink} isActive={editor.isActive('link')} title="Link">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                </ToolbarButton>
                <ToolbarButton onClick={addImage} title="Image">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </ToolbarButton>

                <Divider />

                {/* Undo/Redo */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                    title="Undo (⌘Z)"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                    </svg>
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                    title="Redo (⌘⇧Z)"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6" />
                    </svg>
                </ToolbarButton>
            </div>

            {/* Editor Content */}
            <EditorContent
                editor={editor}
                className="px-6 py-4"
            />

            {/* Editor Styles */}
            <style jsx global>{`
                .tiptap-editor .ProseMirror {
                    min-height: 400px;
                    font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
                }
                
                .tiptap-editor .ProseMirror:focus {
                    outline: none;
                }

                .tiptap-editor .ProseMirror p.is-editor-empty:first-child::before {
                    content: attr(data-placeholder);
                    float: left;
                    color: #9ca3af;
                    pointer-events: none;
                    height: 0;
                }

                .tiptap-editor .ProseMirror h1 {
                    font-size: 2em;
                    font-weight: 700;
                    line-height: 1.3;
                    margin-bottom: 0.5em;
                    color: #111827;
                }

                .tiptap-editor .ProseMirror h2 {
                    font-size: 1.5em;
                    font-weight: 600;
                    line-height: 1.4;
                    margin-top: 1.5em;
                    margin-bottom: 0.5em;
                    color: #1f2937;
                }

                .tiptap-editor .ProseMirror h3 {
                    font-size: 1.25em;
                    font-weight: 600;
                    line-height: 1.4;
                    margin-top: 1.25em;
                    margin-bottom: 0.5em;
                    color: #374151;
                }

                .tiptap-editor .ProseMirror h4 {
                    font-size: 1.1em;
                    font-weight: 600;
                    line-height: 1.4;
                    margin-top: 1em;
                    margin-bottom: 0.5em;
                    color: #4b5563;
                }

                .tiptap-editor .ProseMirror p {
                    font-size: 1rem;
                    line-height: 1.75;
                    color: #4b5563;
                    margin-bottom: 1em;
                }

                .tiptap-editor .ProseMirror ul,
                .tiptap-editor .ProseMirror ol {
                    padding-left: 1.5em;
                    margin-bottom: 1em;
                }

                .tiptap-editor .ProseMirror li {
                    color: #4b5563;
                    line-height: 1.75;
                }

                .tiptap-editor .ProseMirror ul li {
                    list-style-type: disc;
                }

                .tiptap-editor .ProseMirror ol li {
                    list-style-type: decimal;
                }

                .tiptap-editor .ProseMirror blockquote {
                    border-left: 3px solid #d1d5db;
                    padding-left: 1em;
                    margin: 1.5em 0;
                    font-style: italic;
                    color: #6b7280;
                }

                .tiptap-editor .ProseMirror pre {
                    background: #f3f4f6;
                    border-radius: 0.5rem;
                    padding: 1em;
                    margin: 1em 0;
                    overflow-x: auto;
                }

                .tiptap-editor .ProseMirror code {
                    background: #f3f4f6;
                    padding: 0.2em 0.4em;
                    border-radius: 0.25rem;
                    font-size: 0.875em;
                    color: #1f2937;
                    font-family: ui-monospace, monospace;
                }

                .tiptap-editor .ProseMirror pre code {
                    background: none;
                    padding: 0;
                }

                .tiptap-editor .ProseMirror hr {
                    border: none;
                    border-top: 1px solid #e5e7eb;
                    margin: 2em 0;
                }

                .tiptap-editor .ProseMirror img {
                    max-width: 100%;
                    height: auto;
                    border-radius: 0.5rem;
                    margin: 1em 0;
                }

                .tiptap-editor .ProseMirror a {
                    color: #2563eb;
                    text-decoration: underline;
                }

                .tiptap-editor .ProseMirror strong {
                    font-weight: 600;
                    color: #1f2937;
                }

                .tiptap-editor .ProseMirror em {
                    font-style: italic;
                }
            `}</style>
        </div>
    )
}

export default TiptapEditor
