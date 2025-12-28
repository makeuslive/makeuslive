'use client'

import {
    EditorRoot,
    EditorContent,
    EditorCommand,
    EditorCommandItem,
    EditorCommandEmpty,
    EditorCommandList,
    EditorBubble,
    EditorBubbleItem,
    type JSONContent,
    TiptapImage,
    TiptapLink,
    TaskList,
    TaskItem,
    StarterKit,
    Command,
    createSuggestionItems,
    renderItems,
    Placeholder,
    HorizontalRule,
    handleCommandNavigation,
} from 'novel'
import { useState, useCallback } from 'react'

// Configure extensions using Novel's built-in ones
const tiptapLink = TiptapLink.configure({
    HTMLAttributes: {
        class: 'text-blue-600 underline underline-offset-2 hover:text-blue-700 transition-colors cursor-pointer',
    },
})

const placeholder = Placeholder.configure({
    placeholder: "Press '/' for commands, or start typing...",
})

const taskList = TaskList.configure({
    HTMLAttributes: {
        class: 'not-prose pl-2',
    },
})

const taskItem = TaskItem.configure({
    HTMLAttributes: {
        class: 'flex items-start my-4',
    },
    nested: true,
})

const horizontalRule = HorizontalRule.configure({
    HTMLAttributes: {
        class: 'mt-4 mb-6 border-t border-gray-200',
    },
})

const starterKit = StarterKit.configure({
    bulletList: {
        HTMLAttributes: {
            class: 'list-disc list-outside leading-3 -mt-2',
        },
    },
    orderedList: {
        HTMLAttributes: {
            class: 'list-decimal list-outside leading-3 -mt-2',
        },
    },
    listItem: {
        HTMLAttributes: {
            class: 'leading-normal -mb-2',
        },
    },
    blockquote: {
        HTMLAttributes: {
            class: 'border-l-4 border-blue-500 bg-blue-50/50 pl-4 py-2 text-gray-700 italic',
        },
    },
    codeBlock: {
        HTMLAttributes: {
            class: 'rounded-lg bg-gray-900 text-gray-100 p-4 font-mono text-sm overflow-x-auto',
        },
    },
    code: {
        HTMLAttributes: {
            class: 'rounded-md bg-gray-100 px-1.5 py-0.5 font-mono text-sm text-red-600',
            spellcheck: 'false',
        },
    },
    horizontalRule: false,
    dropcursor: {
        color: '#3b82f6',
        width: 3,
    },
    gapcursor: false,
})

const tiptapImage = TiptapImage.configure({
    HTMLAttributes: {
        class: 'rounded-xl shadow-md max-w-full h-auto my-4',
    },
})

// Create slash command suggestion items
const suggestionItems = createSuggestionItems([
    {
        title: 'Text',
        description: 'Just start writing with plain text.',
        searchTerms: ['p', 'paragraph'],
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
        ),
        command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).toggleNode('paragraph', 'paragraph').run()
        },
    },
    {
        title: 'Heading 1',
        description: 'Large section heading.',
        searchTerms: ['h1', 'title', 'big'],
        icon: <span className="text-sm font-bold">H1</span>,
        command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).setNode('heading', { level: 1 }).run()
        },
    },
    {
        title: 'Heading 2',
        description: 'Medium section heading.',
        searchTerms: ['h2', 'subtitle'],
        icon: <span className="text-sm font-bold">H2</span>,
        command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).setNode('heading', { level: 2 }).run()
        },
    },
    {
        title: 'Heading 3',
        description: 'Small section heading.',
        searchTerms: ['h3', 'small'],
        icon: <span className="text-sm font-semibold">H3</span>,
        command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).setNode('heading', { level: 3 }).run()
        },
    },
    {
        title: 'Bullet List',
        description: 'Create a simple bullet list.',
        searchTerms: ['unordered', 'list', 'ul'],
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
        ),
        command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).toggleBulletList().run()
        },
    },
    {
        title: 'Numbered List',
        description: 'Create a numbered list.',
        searchTerms: ['ordered', 'list', 'ol'],
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h10M7 16h10M4 8h.01M4 12h.01M4 16h.01" />
            </svg>
        ),
        command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).toggleOrderedList().run()
        },
    },
    {
        title: 'Quote',
        description: 'Capture a quote.',
        searchTerms: ['blockquote', 'cite'],
        icon: (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
            </svg>
        ),
        command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).toggleBlockquote().run()
        },
    },
    {
        title: 'Code Block',
        description: 'Add code with syntax highlighting.',
        searchTerms: ['code', 'codeblock', 'pre'],
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
        ),
        command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).toggleCodeBlock().run()
        },
    },
    {
        title: 'Divider',
        description: 'Visually divide content.',
        searchTerms: ['hr', 'line', 'divider'],
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
            </svg>
        ),
        command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).setHorizontalRule().run()
        },
    },
])

// Configure slash command extension
const slashCommand = Command.configure({
    suggestion: {
        items: () => suggestionItems,
        render: renderItems,
    },
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const extensions = [
    starterKit,
    placeholder,
    tiptapLink,
    tiptapImage,
    taskList,
    taskItem,
    horizontalRule,
    slashCommand,
] as any[]

interface NovelEditorProps {
    content: string
    onChange: (content: string) => void
    placeholder?: string
}

export default function NovelEditor({ content, onChange }: NovelEditorProps) {
    // Parse initial content - handle HTML string or JSON
    const getInitialContent = useCallback((): JSONContent | string | undefined => {
        if (!content) return undefined
        // If it looks like JSON, try to parse it
        if (content.startsWith('{') || content.startsWith('[')) {
            try {
                return JSON.parse(content) as JSONContent
            } catch {
                return content // Return as-is if JSON parse fails
            }
        }
        // For HTML content, return the HTML string directly
        // Novel's EditorContent accepts HTML strings as initialContent
        return content
    }, [content])

    return (
        <div className="novel-editor">
            <EditorRoot>
                <EditorContent
                    immediatelyRender={false}
                    initialContent={getInitialContent() as any}
                    extensions={extensions}
                    onUpdate={({ editor }) => {
                        onChange(editor.getHTML())
                    }}
                    editorProps={{
                        handleDOMEvents: {
                            keydown: (_view, event) => handleCommandNavigation(event),
                        },
                        attributes: {
                            class: 'prose prose-lg prose-gray dark:prose-invert prose-headings:font-semibold prose-p:text-gray-600 prose-headings:text-gray-900 focus:outline-none max-w-full',
                        },
                    }}
                    className="relative"
                >
                    {/* Slash Command Menu */}
                    <EditorCommand className="z-50 h-auto max-h-[330px] rounded-xl border border-gray-200 bg-white shadow-xl transition-all">
                        <EditorCommandEmpty className="px-4 py-3 text-sm text-gray-500">
                            No results found
                        </EditorCommandEmpty>
                        <EditorCommandList className="max-h-[280px] overflow-y-auto">
                            {suggestionItems.map((item) => (
                                <EditorCommandItem
                                    key={item.title}
                                    value={item.title}
                                    onCommand={(val) => item.command?.(val)}
                                    className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 aria-selected:bg-gray-100 cursor-pointer"
                                >
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500">
                                        {item.icon}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{item.title}</p>
                                        <p className="text-xs text-gray-500">{item.description}</p>
                                    </div>
                                </EditorCommandItem>
                            ))}
                        </EditorCommandList>
                    </EditorCommand>

                    {/* Bubble Menu for text formatting */}
                    <EditorBubble
                        tippyOptions={{
                            placement: 'top',
                        }}
                        className="flex items-center gap-0.5 rounded-xl border border-gray-200 bg-white p-1.5 shadow-xl"
                    >
                        <EditorBubbleItem
                            onSelect={(editor) => editor?.chain().focus().toggleBold().run()}
                            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12h8a4 4 0 100-8H6v8zm0 0h9a4 4 0 110 8H6v-8z" />
                            </svg>
                        </EditorBubbleItem>
                        <EditorBubbleItem
                            onSelect={(editor) => editor?.chain().focus().toggleItalic().run()}
                            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10 4h4m-2 0v16m-4 0h8" transform="skewX(-10)" />
                            </svg>
                        </EditorBubbleItem>
                        <EditorBubbleItem
                            onSelect={(editor) => editor?.chain().focus().toggleStrike().run()}
                            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.5 12H6.5M4 12h16" />
                            </svg>
                        </EditorBubbleItem>
                        <div className="w-px h-5 bg-gray-200 mx-1" />
                        <EditorBubbleItem
                            onSelect={(editor) => editor?.chain().focus().toggleCode().run()}
                            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                            </svg>
                        </EditorBubbleItem>
                    </EditorBubble>
                </EditorContent>
            </EditorRoot>

            {/* Editor Styles */}
            <style jsx global>{`
                .novel-editor .ProseMirror {
                    padding: 0;
                    padding-bottom: 200px;
                }

                .novel-editor .ProseMirror:focus {
                    outline: none;
                }

                .novel-editor .ProseMirror .is-editor-empty:first-child::before {
                    content: attr(data-placeholder);
                    float: left;
                    color: #9ca3af;
                    pointer-events: none;
                    height: 0;
                    font-style: normal;
                }

                .novel-editor .ProseMirror h1 {
                    font-size: 2.25rem;
                    font-weight: 700;
                    line-height: 1.2;
                    margin-top: 1.5em;
                    margin-bottom: 0.5em;
                    color: #111827;
                }

                .novel-editor .ProseMirror h2 {
                    font-size: 1.5rem;
                    font-weight: 600;
                    line-height: 1.3;
                    margin-top: 1.75em;
                    margin-bottom: 0.5em;
                    color: #1f2937;
                }

                .novel-editor .ProseMirror h3 {
                    font-size: 1.25rem;
                    font-weight: 600;
                    line-height: 1.4;
                    margin-top: 1.5em;
                    margin-bottom: 0.5em;
                    color: #374151;
                }

                .novel-editor .ProseMirror p {
                    font-size: 1.125rem;
                    line-height: 1.8;
                    color: #4b5563;
                    margin-bottom: 1.25em;
                }

                .novel-editor .ProseMirror > *:first-child {
                    margin-top: 0;
                }

                .novel-editor .ProseMirror ul,
                .novel-editor .ProseMirror ol {
                    padding-left: 1.5em;
                    margin: 1.25em 0;
                }

                .novel-editor .ProseMirror li {
                    margin: 0.25em 0;
                }

                .novel-editor .ProseMirror img {
                    max-width: 100%;
                    height: auto;
                    border-radius: 0.75rem;
                    margin: 1.5em 0;
                }

                .novel-editor .ProseMirror a {
                    color: #2563eb;
                    text-decoration: underline;
                    text-underline-offset: 2px;
                }

                .novel-editor .ProseMirror hr {
                    border: none;
                    height: 1px;
                    background: linear-gradient(to right, transparent, #e5e7eb, transparent);
                    margin: 2em 0;
                }
            `}</style>
        </div>
    )
}
