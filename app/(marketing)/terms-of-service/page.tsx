export const metadata = {
    title: 'Terms of Service',
    description: 'Terms of Service for MakeUsLive. Please read these terms carefully before using our services.',
}

export default function TermsPage() {
    return (
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-24 md:py-32">
            <div className="max-w-3xl mx-auto prose prose-invert">
                <h1 className="text-4xl font-bold mb-8 text-gold">Terms of Service</h1>
                <p className="text-text-muted mb-6">Last updated: December 27, 2025</p>

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
