'use client'

import {
    MDXEditor,
    headingsPlugin,
    listsPlugin,
    quotePlugin,
    thematicBreakPlugin,
    markdownShortcutPlugin,
    toolbarPlugin,
    UndoRedo,
    BoldItalicUnderlineToggles,
    BlockTypeSelect,
    CodeToggle,
    ListsToggle,
    CreateLink,
    InsertImage,
    InsertTable,
    imagePlugin,
    linkPlugin,
    linkDialogPlugin,
    tablePlugin,
    frontmatterPlugin
} from '@mdxeditor/editor'
import '@mdxeditor/editor/style.css'
import { FC } from 'react'

interface EditorProps {
    markdown: string
    onChange: (markdown: string) => void
    placeholder?: string
}

/**
 * Rich Text Markdown Editor using MDXEditor
 * Provides a "Wikipedia-like" visual editing experience
 */
const MarkdownEditor: FC<EditorProps> = ({ markdown, onChange, placeholder }) => {
    return (
        <div className="mdx-editor-wrapper bg-[#0a0a0a] border border-white/20 rounded-lg prose prose-invert max-w-none font-sans">
            <MDXEditor
                markdown={markdown}
                onChange={onChange}
                placeholder={placeholder}
                className="min-h-[500px] text-white"
                contentEditableClassName="prose prose-invert max-w-none px-6 py-6 min-h-[500px] focus:outline-none prose-headings:text-white prose-p:text-white/80 prose-li:text-white/80 prose-strong:text-white prose-ul:list-disc prose-ol:list-decimal"
                plugins={[
                    // Basic text formatting
                    headingsPlugin(),
                    listsPlugin(),
                    quotePlugin(),
                    thematicBreakPlugin(),
                    markdownShortcutPlugin(),

                    // Enhanced features
                    imagePlugin({
                        imageUploadHandler: async (image) => {
                            const formData = new FormData()
                            formData.append('file', image)
                            formData.append('folder', 'blog-content')

                            const response = await fetch('/api/upload', {
                                method: 'POST',
                                body: formData
                            })
                            const json = await response.json()
                            return json.url
                        }
                    }),
                    linkPlugin(),
                    linkDialogPlugin(),
                    tablePlugin(),
                    frontmatterPlugin(),

                    // Toolbar configuration
                    toolbarPlugin({
                        toolbarContents: () => (
                            <div className="flex flex-wrap items-center gap-1 p-3 border-b border-white/20 bg-[#0a0a0a] sticky top-0 z-20 w-full">
                                <UndoRedo />
                                <div className="w-px h-6 bg-white/10 mx-1" />
                                <BlockTypeSelect />
                                <div className="w-px h-6 bg-white/10 mx-1" />
                                <BoldItalicUnderlineToggles />
                                <CodeToggle />
                                <div className="w-px h-6 bg-white/10 mx-1" />
                                <ListsToggle />
                                <div className="w-px h-6 bg-white/10 mx-1" />
                                <CreateLink />
                                <InsertImage />
                                <InsertTable />
                            </div>
                        )
                    })
                ]}
            />
        </div>
    )
}

export default MarkdownEditor
