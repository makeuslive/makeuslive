# Blog REST API Documentation

The blog system now uses REST API endpoints instead of GraphQL. All endpoints are available at `http://localhost:3000/api/blog`.

## Base URL
```
http://localhost:3000/api/blog
```

---

## Endpoints

### 1. Get All Blog Posts
**Endpoint:** `GET /api/blog`

**Description:** Fetch a paginated list of blog posts with optional filtering and sorting.

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `status` | string | `published` | Filter by status (`published`, `draft`, `archived`, `all`) |
| `category` | string | - | Filter by category (e.g., `AI & Technology`, `Design`, `Development`) |
| `featured` | boolean | - | Filter featured posts (`true` or `false`) |
| `page` | number | `1` | Page number for pagination |
| `limit` | number | `9` | Number of posts per page |
| `search` | string | - | Search in title, excerpt, content, and tags |
| `sort` | string | `date` | Sort field (`date` or `title`) |
| `order` | string | `desc` | Sort order (`asc` or `desc`) |

**Example Requests:**
```bash
# Get all published posts (default)
GET /api/blog

# Get posts from specific category
GET /api/blog?category=AI%20%26%20Technology

# Get featured posts only
GET /api/blog?featured=true

# Get posts with pagination
GET /api/blog?page=2&limit=10

# Search posts
GET /api/blog?search=nextjs

# Combined filters
GET /api/blog?category=Design&page=1&limit=5&sort=title&order=asc
```

**Response:**
```json
{
  "success": true,
  "data": {
    "posts": [
      {
        "id": "507f1f77bcf86cd799439011",
        "title": "Building Modern Web Apps",
        "slug": "building-modern-web-apps",
        "excerpt": "Learn how to build modern web applications...",
        "content": "Full content here...",
        "category": "Development",
        "tags": ["nextjs", "react", "typescript"],
        "featuredImage": "/images/blog/post-1.jpg",
        "featured": true,
        "status": "published",
        "date": "Dec 28, 2025",
        "publishedAt": "2025-12-28T10:00:00.000Z",
        "readTime": "5 min",
        "gradient": "from-green-500/20 to-emerald-500/10",
        "author": {
          "name": "MakeUsLive",
          "role": "Team"
        },
        "seo": {
          "metaTitle": "Building Modern Web Apps | MakeUsLive",
          "metaDescription": "Learn how to build modern web applications..."
        },
        "views": 1250,
        "likes": 45
      }
      // ... more posts
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalCount": 42,
      "hasNextPage": true,
      "hasPreviousPage": false,
      "limit": 9
    }
  }
}
```

---

### 2. Get Single Blog Post by Slug
**Endpoint:** `GET /api/blog/[slug]`

**Description:** Fetch a single blog post by its slug. Automatically increments view count.

**Path Parameters:**
- `slug` (string, required): The blog post slug

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `status` | string | - | Include unpublished posts (for admin preview) |

**Example Requests:**
```bash
# Get published post by slug
GET /api/blog/building-modern-web-apps

# Get any post by slug (including drafts) - for admin
GET /api/blog/upcoming-post?status=draft
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "title": "Building Modern Web Apps",
    "slug": "building-modern-web-apps",
    "excerpt": "Learn how to build modern web applications...",
    "content": "Full markdown/HTML content here...",
    "category": "Development",
    "tags": ["nextjs", "react", "typescript"],
    "featuredImage": "/images/blog/post-1.jpg",
    "featured": true,
    "status": "published",
    "date": "Dec 28, 2025",
    "publishedAt": "2025-12-28T10:00:00.000Z",
    "readTime": "5 min",
    "gradient": "from-green-500/20 to-emerald-500/10",
    "author": {
      "name": "John Doe",
      "role": "Senior Developer"
    },
    "seo": {
      "metaTitle": "Building Modern Web Apps | MakeUsLive",
      "metaDescription": "Learn how to build modern web applications...",
      "canonicalUrl": "https://www.makeuslive.com/blog/building-modern-web-apps"
    },
    "views": 1251,
    "likes": 45,
    "createdAt": "2025-12-20T08:00:00.000Z",
    "updatedAt": "2025-12-28T10:00:00.000Z"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "error": "Blog post not found"
}
```

---

### 3. Get Featured Blog Posts
**Endpoint:** `GET /api/blog/featured`

**Description:** Fetch featured blog posts only.

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | number | `5` | Number of featured posts to return |

**Example Requests:**
```bash
# Get default 5 featured posts
GET /api/blog/featured

# Get specific number of featured posts
GET /api/blog/featured?limit=3
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439011",
      "title": "Building Modern Web Apps",
      "slug": "building-modern-web-apps",
      "excerpt": "Learn how to build modern web applications...",
      "category": "Development",
      "tags": ["nextjs", "react", "typescript"],
      "featuredImage": "/images/blog/post-1.jpg",
      "featured": true,
      "date": "Dec 28, 2025",
      "publishedAt": "2025-12-28T10:00:00.000Z",
      "readTime": "5 min",
      "gradient": "from-green-500/20 to-emerald-500/10",
      "author": {
        "name": "MakeUsLive",
        "role": "Team"
      },
      "views": 1250,
      "likes": 45
    }
    // ... more featured posts
  ]
}
```

---

### 4. Get Blog Categories
**Endpoint:** `GET /api/blog/categories`

**Description:** Fetch all blog categories with post counts.

**Example Request:**
```bash
GET /api/blog/categories
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "name": "All",
      "count": 42,
      "gradient": null
    },
    {
      "name": "AI & Technology",
      "count": 15,
      "gradient": "from-blue-500/20 to-purple-500/10"
    },
    {
      "name": "Design",
      "count": 12,
      "gradient": "from-pink-500/20 to-rose-500/10"
    },
    {
      "name": "Development",
      "count": 10,
      "gradient": "from-green-500/20 to-emerald-500/10"
    },
    {
      "name": "UX Research",
      "count": 3,
      "gradient": "from-amber-500/20 to-yellow-500/10"
    },
    {
      "name": "Animation",
      "count": 2,
      "gradient": "from-cyan-500/20 to-teal-500/10"
    }
  ]
}
```

---

## Usage Examples

### Frontend (React/Next.js)

#### Fetch all posts with filters:
```typescript
const fetchBlogPosts = async (filters = {}) => {
  const params = new URLSearchParams({
    status: 'published',
    page: '1',
    limit: '9',
    ...filters
  })
  
  const response = await fetch(`/api/blog?${params.toString()}`)
  const result = await response.json()
  
  if (result.success) {
    return result.data
  }
  throw new Error(result.error)
}

// Usage
const data = await fetchBlogPosts({ 
  category: 'Design', 
  page: 2 
})
```

#### Fetch single post by slug:
```typescript
const fetchPost = async (slug: string) => {
  const response = await fetch(`/api/blog/${slug}`)
  const result = await response.json()
  
  if (result.success) {
    return result.data
  }
  throw new Error(result.error)
}

// Usage
const post = await fetchPost('building-modern-web-apps')
```

#### Fetch featured posts:
```typescript
const fetchFeaturedPosts = async (limit = 5) => {
  const response = await fetch(`/api/blog/featured?limit=${limit}`)
  const result = await response.json()
  
  if (result.success) {
    return result.data
  }
  throw new Error(result.error)
}

// Usage
const featured = await fetchFeaturedPosts(3)
```

---

## Error Responses

All endpoints follow a consistent error response format:

```json
{
  "success": false,
  "error": "Error message here"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `400` - Bad Request (invalid parameters)
- `404` - Not Found
- `500` - Internal Server Error

---

## Migration from GraphQL

If you previously used GraphQL queries, here's how to migrate:

### Before (GraphQL):
```typescript
import { useQuery } from '@apollo/client'
import { GET_BLOG_POSTS } from '@/lib/graphql/queries'

const { data, loading } = useQuery(GET_BLOG_POSTS, {
  variables: {
    status: 'published',
    category: activeCategory,
    page: currentPage,
    limit: 13
  }
})

const posts = data?.blogPosts?.posts || []
```

### After (REST API):
```typescript
const [posts, setPosts] = useState([])
const [loading, setLoading] = useState(true)

useEffect(() => {
  const fetchPosts = async () => {
    setLoading(true)
    const params = new URLSearchParams({
      status: 'published',
      category: activeCategory,
      page: currentPage.toString(),
      limit: '13'
    })
    
    const response = await fetch(`/api/blog?${params.toString()}`)
    const result = await response.json()
    
    if (result.success) {
      setPosts(result.data.posts)
    }
    setLoading(false)
  }
  
  fetchPosts()
}, [activeCategory, currentPage])
```

---

## Notes

- All dates are returned in ISO 8601 format (`publishedAt`) and user-friendly format (`date`)
- View counts are automatically incremented when fetching a single post by slug
- Featured posts are always sorted by publish date (newest first)
- Search is case-insensitive and searches across title, excerpt, content, and tags
- Category names are case-sensitive
- All endpoints support CORS for development

---

## Testing

You can test the API using curl, Postman, or your browser:

```bash
# Test basic endpoint
curl http://localhost:3000/api/blog

# Test with filters
curl "http://localhost:3000/api/blog?category=Design&page=1&limit=5"

# Test single post
curl http://localhost:3000/api/blog/your-post-slug

# Test featured posts
curl http://localhost:3000/api/blog/featured?limit=3

# Test categories
curl http://localhost:3000/api/blog/categories
```
