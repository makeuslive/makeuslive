'use client'

import { Button } from '@/components/ui'

interface CaseStudyDownloadProps {
    slug: string
    pdfVersion: string
}

export function CaseStudyDownload({ slug, pdfVersion }: CaseStudyDownloadProps) {
    const handleDownload = () => {
        // Track download event
        if (typeof window !== 'undefined' && 'gtag' in window) {
            // @ts-ignore
            window.gtag('event', 'case_study_download', {
                slug,
                version: pdfVersion,
            })
        }

        // In a real app, this would download the PDF
        alert(`Downloading case study PDF (v${pdfVersion})...`)
    }

    return (
        <Button onClick={handleDownload} variant="primary">
            Download PDF
        </Button>
    )
}
