
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
                title: 'E-Commerce Revolution',
                category: 'Web Development',
                description: 'Complete platform redesign resulting in 340% increase in conversions.',
                image: '/images/case-1.jpg',
                stats: { metric: '340%', label: 'Conversion Increase' },
                tags: ['Next.js', 'Shopify', 'AI Search'],
            },
            {
                id: 'case-2',
                title: 'AI-Powered Analytics',
                category: 'Machine Learning',
                description: 'Real-time predictive analytics dashboard for Fortune 500 company.',
                image: '/images/case-2.jpg',
                stats: { metric: '$2.4M', label: 'Revenue Generated' },
                tags: ['Python', 'TensorFlow', 'Dashboard'],
            },
            {
                id: 'case-3',
                title: 'Brand Transformation',
                category: 'Design Systems',
                description: 'Complete rebrand and design system for fintech startup.',
                image: '/images/case-3.jpg',
                stats: { metric: '100+', label: 'Components Built' },
                tags: ['Figma', 'Design Tokens', 'Documentation'],
            },
            {
                id: 'case-4',
                title: 'Mobile Experience',
                category: 'App Development',
                description: 'Cross-platform app with 4.9 star rating on both stores.',
                image: '/images/case-4.jpg',
                stats: { metric: '4.9★', label: 'App Store Rating' },
                tags: ['React Native', 'iOS', 'Android'],
            },
            {
                id: 'case-5',
                title: 'SaaS Platform',
                category: 'Product Design',
                description: 'End-to-end product design for B2B SaaS platform.',
                image: '/images/case-5.jpg',
                stats: { metric: '50K+', label: 'Monthly Users' },
                tags: ['UX Research', 'UI Design', 'Development'],
            },
            {
                id: 'case-6',
                title: 'AI Chatbot System',
                category: 'AI Integration',
                description: 'Intelligent customer service bot handling 10K+ queries daily.',
                image: '/images/case-6.jpg',
                stats: { metric: '89%', label: 'Resolution Rate' },
                tags: ['OpenAI', 'LangChain', 'Node.js'],
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
