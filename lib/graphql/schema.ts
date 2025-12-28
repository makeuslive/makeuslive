// GraphQL Type Definitions - Professional CMS Schema
export const typeDefs = `#graphql
  # Testimonial type
  type Testimonial {
    id: ID!
    author: String!
    role: String!
    company: String
    quote: String!
    rating: Int!
    createdAt: String
  }

  # Work/Portfolio type
  type WorkStats {
    metric: String
    label: String
  }

  type Work {
    id: ID!
    title: String!
    category: String!
    description: String!
    image: String
    stats: WorkStats
    tags: [String!]
    gradient: String
    order: Int
    createdAt: String
  }

  # SEO Configuration for Blog Posts
  type BlogSEO {
    metaTitle: String
    metaDescription: String
    canonicalUrl: String
    schemaType: String
    noIndex: Boolean
    noFollow: Boolean
  }

  # Author type
  type Author {
    id: ID!
    name: String!
    slug: String
    role: String
    bio: String
    avatar: String
    twitter: String
    linkedin: String
  }

  # Enhanced Blog Post type with CMS features
  type BlogPost {
    id: ID!
    title: String!
    slug: String!
    excerpt: String
    content: String
    category: String
    tags: [String!]
    featuredImage: String
    
    # CMS Fields
    featured: Boolean
    priority: String
    status: String
    
    # SEO
    seo: BlogSEO
    primaryKeyword: String
    secondaryKeywords: [String!]
    
    # Author
    author: Author
    authorId: String
    
    # Computed
    date: String
    readTime: String
    wordCount: Int
    gradient: String
    
    # Timestamps
    createdAt: String
    updatedAt: String
    publishedAt: String
    scheduledAt: String
    
    # Analytics
    views: Int
  }

  # Newsletter Subscriber
  type Subscriber {
    id: ID!
    email: String!
    subscribedAt: String
    isActive: Boolean
  }

  # Contact Submission
  type Contact {
    id: ID!
    name: String!
    email: String!
    phone: String
    website: String
    message: String!
    isRead: Boolean
    createdAt: String
  }

  type PaginatedBlogResponse {
    posts: [BlogPost!]!
    totalCount: Int!
    totalPages: Int!
    currentPage: Int!
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
  }

  # Query type - all read operations
  type Query {
    # Testimonials
    testimonials: [Testimonial!]!
    testimonial(id: ID!): Testimonial
    
    # Works
    works: [Work!]!
    work(id: ID!): Work
    
    # Blog - Enhanced with featured filter
    blogPosts(status: String, category: String, featured: Boolean, page: Int, limit: Int): PaginatedBlogResponse!
    blogPost(id: Int): BlogPost
    blogPostBySlug(slug: String!): BlogPost
    featuredPosts(limit: Int): [BlogPost!]!
    
    # Authors
    authors: [Author!]!
    author(id: ID!): Author
    
    # Newsletter
    subscribers: [Subscriber!]!
    
    # Contacts
    contacts: [Contact!]!
    contact(id: ID!): Contact
  }

  # SEO Input
  input BlogSEOInput {
    metaTitle: String
    metaDescription: String
    canonicalUrl: String
    schemaType: String
    noIndex: Boolean
    noFollow: Boolean
  }

  # Input types for mutations
  input TestimonialInput {
    author: String!
    role: String!
    company: String
    quote: String!
    rating: Int
  }

  input WorkStatsInput {
    metric: String
    label: String
  }

  input WorkInput {
    title: String!
    category: String!
    description: String
    image: String
    stats: WorkStatsInput
    tags: [String!]
    order: Int
  }

  # Enhanced BlogPost Input
  input BlogPostInput {
    title: String!
    slug: String!
    excerpt: String
    content: String
    category: String
    tags: [String!]
    featuredImage: String
    status: String
    
    # CMS Fields
    featured: Boolean
    priority: String
    
    # SEO
    seo: BlogSEOInput
    primaryKeyword: String
    secondaryKeywords: [String!]
    
    # Author
    authorId: String
    
    # Scheduling
    scheduledAt: String
  }

  input AuthorInput {
    name: String!
    slug: String
    role: String
    bio: String
    avatar: String
    twitter: String
    linkedin: String
  }

  # Mutation type - all write operations
  type Mutation {
    # Testimonials
    createTestimonial(input: TestimonialInput!): Testimonial
    updateTestimonial(id: ID!, input: TestimonialInput!): Testimonial
    deleteTestimonial(id: ID!): Boolean
    
    # Works
    createWork(input: WorkInput!): Work
    updateWork(id: ID!, input: WorkInput!): Work
    deleteWork(id: ID!): Boolean
    
    # Blog - Enhanced
    createBlogPost(input: BlogPostInput!): BlogPost
    updateBlogPost(id: ID!, input: BlogPostInput!): BlogPost
    deleteBlogPost(id: ID!): Boolean
    toggleFeatured(id: ID!): BlogPost
    
    # Authors
    createAuthor(input: AuthorInput!): Author
    updateAuthor(id: ID!, input: AuthorInput!): Author
    deleteAuthor(id: ID!): Boolean
    
    # Newsletter
    subscribe(email: String!): Subscriber
    unsubscribe(id: ID!): Boolean
    
    # Contacts
    markContactAsRead(id: ID!): Contact
    deleteContact(id: ID!): Boolean
  }
`
