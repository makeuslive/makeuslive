import { gql } from '@apollo/client'

// Testimonials queries
export const GET_TESTIMONIALS = gql`
  query GetTestimonials {
    testimonials {
      id
      author
      role
      company
      quote
      rating
    }
  }
`

export const GET_TESTIMONIAL = gql`
  query GetTestimonial($id: ID!) {
    testimonial(id: $id) {
      id
      author
      role
      company
      quote
      rating
    }
  }
`

// Works queries
export const GET_WORKS = gql`
  query GetWorks {
    works {
      id
      title
      category
      description
      image
      stats {
        metric
        label
      }
      tags
      gradient
    }
  }
`

export const GET_WORK = gql`
  query GetWork($id: ID!) {
    work(id: $id) {
      id
      title
      category
      description
      image
      stats {
        metric
        label
      }
      tags
    }
  }
`

// Blog queries
export const GET_BLOG_POSTS = gql`
  query GetBlogPosts($status: String, $category: String, $page: Int, $limit: Int) {
    blogPosts(status: $status, category: $category, page: $page, limit: $limit) {
      posts {
        id
        title
        slug
        excerpt
        category
        tags
        featuredImage
        date
        readTime
        gradient
      }
      totalCount
      totalPages
      currentPage
      hasNextPage
      hasPreviousPage
    }
  }
`

export const GET_BLOG_POST = gql`
  query GetBlogPost($id: ID!) {
    blogPost(id: $id) {
      id
      title
      slug
      excerpt
      content
      category
      tags
      featuredImage
      status
      date
      readTime
    }
  }
`

export const GET_BLOG_POST_BY_SLUG = gql`
  query GetBlogPostBySlug($slug: String!) {
    blogPostBySlug(slug: $slug) {
      id
      title
      slug
      excerpt
      content
      category
      tags
      featuredImage
      date
      readTime
    }
  }
`

// Subscribers queries
export const GET_SUBSCRIBERS = gql`
  query GetSubscribers {
    subscribers {
      id
      email
      subscribedAt
      isActive
    }
  }
`

// Contacts queries
export const GET_CONTACTS = gql`
  query GetContacts {
    contacts {
      id
      name
      email
      phone
      message
      isRead
      createdAt
    }
  }
`

// Mutations
export const CREATE_TESTIMONIAL = gql`
  mutation CreateTestimonial($input: TestimonialInput!) {
    createTestimonial(input: $input) {
      id
      author
      role
      quote
    }
  }
`

export const UPDATE_TESTIMONIAL = gql`
  mutation UpdateTestimonial($id: ID!, $input: TestimonialInput!) {
    updateTestimonial(id: $id, input: $input) {
      id
      author
      role
      quote
    }
  }
`

export const DELETE_TESTIMONIAL = gql`
  mutation DeleteTestimonial($id: ID!) {
    deleteTestimonial(id: $id)
  }
`

export const CREATE_WORK = gql`
  mutation CreateWork($input: WorkInput!) {
    createWork(input: $input) {
      id
      title
      category
    }
  }
`

export const UPDATE_WORK = gql`
  mutation UpdateWork($id: ID!, $input: WorkInput!) {
    updateWork(id: $id, input: $input) {
      id
      title
      category
    }
  }
`

export const DELETE_WORK = gql`
  mutation DeleteWork($id: ID!) {
    deleteWork(id: $id)
  }
`

export const CREATE_BLOG_POST = gql`
  mutation CreateBlogPost($input: BlogPostInput!) {
    createBlogPost(input: $input) {
      id
      title
      slug
    }
  }
`

export const UPDATE_BLOG_POST = gql`
  mutation UpdateBlogPost($id: ID!, $input: BlogPostInput!) {
    updateBlogPost(id: $id, input: $input) {
      id
      title
      slug
    }
  }
`

export const DELETE_BLOG_POST = gql`
  mutation DeleteBlogPost($id: ID!) {
    deleteBlogPost(id: $id)
  }
`

export const SUBSCRIBE = gql`
  mutation Subscribe($email: String!) {
    subscribe(email: $email) {
      id
      email
    }
  }
`

export const UNSUBSCRIBE = gql`
  mutation Unsubscribe($id: ID!) {
    unsubscribe(id: $id)
  }
`

export const MARK_CONTACT_AS_READ = gql`
  mutation MarkContactAsRead($id: ID!) {
    markContactAsRead(id: $id) {
      id
      isRead
    }
  }
`

export const DELETE_CONTACT = gql`
  mutation DeleteContact($id: ID!) {
    deleteContact(id: $id)
  }
`
