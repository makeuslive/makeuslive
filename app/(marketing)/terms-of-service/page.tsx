import { formatDisplayDate } from '@/lib/date-utils'

export const metadata = {
    title: 'Terms of Service',
    description: 'Terms of Service for MakeUsLive. Please read these terms carefully before using our services.',
}

// Effective date and change log
const EFFECTIVE_DATE = new Date('2025-01-01')
const LAST_UPDATED = new Date('2025-12-27')

const CHANGE_LOG = [
    { date: new Date('2025-12-27'), description: 'Updated service descriptions and user obligations' },
    { date: new Date('2025-07-15'), description: 'Added dispute resolution section' },
    { date: new Date('2025-01-01'), description: 'Initial terms of service published' },
]

export default function TermsPage() {
    return (
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-24 md:py-32">
            <div className="max-w-3xl mx-auto prose prose-invert">
                <h1 className="text-4xl font-bold mb-8 text-gold">Terms of Service</h1>
                
                <div className="mb-8 p-4 rounded-lg bg-white/5 border border-white/10">
                    <p className="text-text-muted mb-2">
                        <strong className="text-text">Effective Date:</strong> {formatDisplayDate(EFFECTIVE_DATE)}
                    </p>
                    <p className="text-text-muted">
                        <strong className="text-text">Last Updated:</strong> {formatDisplayDate(LAST_UPDATED)}
                    </p>
                </div>

                <section id="change-log" className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-text">Change Log</h2>
                    <ul className="list-none space-y-3">
                        {CHANGE_LOG.map((change, index) => (
                            <li key={index} className="p-3 rounded-lg bg-white/5 border border-white/10">
                                <div className="flex items-start gap-3">
                                    <span className="text-gold font-medium whitespace-nowrap">
                                        {formatDisplayDate(change.date)}
                                    </span>
                                    <span className="text-text-dim">{change.description}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-text">1. Agreement to Terms</h2>
                    <p className="text-text-dim">
                        These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity (&quot;you&quot;) and MakeUsLive (&quot;we,&quot; &quot;us&quot; or &quot;our&quot;), concerning your access to and use of the makeuslive.com website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto (collectively, the &quot;Site&quot;).
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-text">2. Intellectual Property Rights</h2>
                    <p className="text-text-dim">
                        Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the &quot;Content&quot;) and the trademarks, service marks, and logos contained therein (the &quot;Marks&quot;) are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws and various other intellectual property rights.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-text">3. User Representations</h2>
                    <p className="text-text-dim mb-4">
                        By using the Site, you represent and warrant that:
                    </p>
                    <ul className="list-disc pl-6 text-text-dim space-y-2">
                        <li>All registration information you submit will be true, accurate, current, and complete.</li>
                        <li>You will maintain the accuracy of such information and promptly update such registration information as necessary.</li>
                        <li>You have the legal capacity and you agree to comply with these Terms of Service.</li>
                        <li>You will not access the Site through automated or non-human means, whether through a bot, script or otherwise.</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-text">4. Contact Us</h2>
                    <p className="text-text-dim">
                        In order to resolve a complaint regarding the Site or to receive further information regarding use of the Site, please contact us at: <a href="mailto:hello@makeuslive.com" className="text-gold hover:underline">hello@makeuslive.com</a>
                    </p>
                </section>
            </div>
        </div>
    )
}
