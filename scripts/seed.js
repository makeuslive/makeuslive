
const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load env vars manually
try {
    const envConfig = dotenv.parse(fs.readFileSync(path.resolve(process.cwd(), '.env.local')));
    for (const k in envConfig) {
        process.env[k] = envConfig[k];
    }
} catch (e) {
    console.log('Could not load .env.local', e);
}

const uri = process.env.MONGODB_URI;
if (!uri) {
    console.error('No MONGODB_URI found');
    process.exit(1);
}

const COPY = {
    cases: {
        items: [
            {
                id: 'case-1',
                title: 'Internal Ticket & SLA Management System',
                category: 'Enterprise Platform',
                description: 'Production-ready internal workflow platform built to manage tickets, projects, and SLA commitments across multi-role engineering and operations teams.',
                image: '/images/case-1.jpg',
                stats: { metric: 'Multi-Team', label: 'Operations Platform' },
                tags: ['FastAPI', 'MongoDB', 'Next.js', 'TypeScript', 'JWT Auth'],
                gradient: 'from-blue-500/20 to-indigo-600/20',
            },
            {
                id: 'case-2',
                title: 'Real-Time Distraction Alert Mobile App',
                category: 'Mobile Safety',
                description: 'Production-grade mobile application detecting user distraction near roadways with intelligent safety alerts, running reliably under strict mobile OS constraints.',
                image: '/images/case-2.jpg',
                stats: { metric: 'Real-Time', label: 'Safety System' },
                tags: ['Flutter', 'Background Services', 'GPS', 'Activity Recognition'],
                gradient: 'from-orange-500/20 to-red-600/20',
            },
            {
                id: 'case-3',
                title: 'DocIt – Secure Document Locker',
                category: 'Production Mobile App',
                description: 'Live on Google Play with 10K+ downloads and 4.4★ rating. Secure document locker with offline access, scanning, and long-term reliability.',
                image: '/images/case-3.jpg',
                stats: { metric: '10K+', label: 'Active Downloads' },
                tags: ['Flutter', 'Secure Storage', 'Offline-First', 'Document Scanning'],
                gradient: 'from-emerald-500/20 to-teal-600/20',
            },
        ]
    },
    testimonials: {
        items: [
            {
                id: 'testimonial-1',
                quote: 'MakeUsLive transformed our digital presence completely. Their attention to detail and innovative approach exceeded our expectations. The team delivered on time and the results speak for themselves.',
                author: 'Sarah Chen',
                role: 'CEO, TechStart Inc.',
                industry: 'SaaS',
                rating: 5,
                avatar: '/images/avatars/sarah.jpg',
            },
            {
                id: 'testimonial-2',
                quote: 'Working with MakeUsLive was a game-changer for our startup. They delivered a product that truly represents our brand vision and helped us scale from 0 to 50K users in 6 months.',
                author: 'Michael Torres',
                role: 'Founder, Bloom Studio',
                industry: 'E-commerce',
                rating: 5,
                avatar: '/images/avatars/michael.jpg',
            },
            {
                id: 'testimonial-3',
                quote: "The team's expertise in AI integration helped us automate processes we thought were impossible. Our customer service efficiency improved by 340% within the first quarter.",
                author: 'Emily Watson',
                role: 'CTO, DataFlow',
                industry: 'Fintech',
                rating: 5,
                avatar: '/images/avatars/emily.jpg',
            },
            {
                id: 'testimonial-4',
                quote: 'Exceptional quality and professionalism. They understood our vision from day one and executed it flawlessly. Highly recommend for any serious project.',
                author: 'David Park',
                role: 'Product Lead, InnovateCo',
                industry: 'Healthcare',
                rating: 5,
                avatar: '/images/avatars/david.jpg',
            },
            {
                id: 'testimonial-5',
                quote: "The design system they built for us has saved countless hours and maintained consistency across all our products. It's become the foundation of everything we build.",
                author: 'Lisa Johnson',
                role: 'Design Director, Scale Labs',
                industry: 'Technology',
                rating: 5,
                avatar: '/images/avatars/lisa.jpg',
            },
        ]
    }
};

const mockPosts = [
    {
        id: 'post-1',
        title: 'The Future of AI in Web Development',
        excerpt: 'Exploring how artificial intelligence is revolutionizing the way we build and deploy web applications. From code generation to automated testing.',
        category: 'AI & Technology',
        date: 'Dec 20, 2024',
        readTime: '5 min',
        gradient: 'from-purple-600/30 via-indigo-600/20 to-transparent',
        featured: true,
        slug: 'future-of-ai-web-development',
        author: { name: 'Abhishek Jha', avatar: '/images/team/abhishek.jpg' },
        image: '/images/blog/ai-future.jpg'
    },
    {
        id: 'post-2',
        title: 'Building Design Systems That Scale',
        excerpt: 'A comprehensive guide to creating design systems that grow with your product and team.',
        category: 'Design',
        date: 'Dec 15, 2024',
        readTime: '8 min',
        gradient: 'from-emerald-600/30 via-teal-600/20 to-transparent',
        slug: 'building-design-systems',
        author: { name: 'Rishi Soni', avatar: '/images/team/rishi.jpg' },
        image: '/images/blog/design-systems.jpg'
    },
    {
        id: 'post-3',
        title: 'Next.js 15: What You Need to Know',
        excerpt: 'Breaking down the latest features and improvements in Next.js 15 and how to leverage them.',
        category: 'Development',
        date: 'Dec 10, 2024',
        readTime: '6 min',
        gradient: 'from-blue-600/30 via-cyan-600/20 to-transparent',
        slug: 'nextjs-15',
        author: { name: 'Vikramaditya Jha', avatar: '/images/team/vikramaditya.jpg' },
        image: '/images/blog/nextjs-15.jpg'
    }
];

async function seed() {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        const db = client.db();

        // Works
        console.log('Seeding works...');
        const worksCollection = db.collection('works');
        await worksCollection.deleteMany({}); // Clear existing to prevent duplicates if running multiple times
        await worksCollection.insertMany(COPY.cases.items);
        console.log(`inserted ${COPY.cases.items.length} works`);

        // Testimonials
        console.log('Seeding testimonials...');
        const testimonialsCollection = db.collection('testimonials');
        await testimonialsCollection.deleteMany({});
        await testimonialsCollection.insertMany(COPY.testimonials.items);
        console.log(`inserted ${COPY.testimonials.items.length} testimonials`);

        // Posts
        console.log('Seeding posts...');
        const postsCollection = db.collection('posts');
        await postsCollection.deleteMany({});
        await postsCollection.insertMany(mockPosts);
        console.log(`inserted ${mockPosts.length} posts`);

        console.log('Done!');
    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
}

seed();
