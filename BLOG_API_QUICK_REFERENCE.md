# Blog REST API - Quick Reference

## Base URL
```
http://localhost:3000/api/blog
```

## Endpoints

### 1. Get All Posts
```bash
GET /api/blog
```

**Common Examples:**
```bash
# All published posts
GET /api/blog

# Filter by category
GET /api/blog?category=Design

# Search posts
GET /api/blog?search=nextjs

# Pagination
GET /api/blog?page=2&limit=10

# Featured posts only
GET /api/blog?featured=true

# Combined filters
GET /api/blog?category=AI%20%26%20Technology&page=1&limit=5
```

### 2. Get Single Post
```bash
GET /api/blog/[slug]
```

**Example:**
```bash
GET /api/blog/hello
```

### 3. Get Featured Posts
```bash
GET /api/blog/featured?limit=5
```

### 4. Get Categories
```bash
GET /api/blog/categories
```

## Response Structure

### List Response
```json
{
  "success": true,
  "data": {
    "posts": [
      {
        "id": "...",
        "title": "...",
        "slug": "...",
        "excerpt": "...",
        "category": "...",
        "featuredImage": "...",
        "date": "Dec 28, 2025",
        "readTime": "5 min",
        "author": {...},
        "views": 123,
        "likes": 45
      }
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

### Single Post Response
```json
{
  "success": true,
  "data": {
    "id": "...",
    "title": "...",
    "slug": "...",
    "content": "Full HTML content...",
    "excerpt": "...",
    "category": "...",
    "tags": [...],
    "featuredImage": "...",
    "date": "Dec 28, 2025",
    "readTime": "5 min",
    "author": {...},
    "seo": {...},
    "views": 123,
    "likes": 45
  }
}
```

## React/Next.js Usage

### Fetch All Posts
```typescript
const [posts, setPosts] = useState([])
const [loading, setLoading] = useState(true)

useEffect(() => {
  const fetchPosts = async () => {
    try {
      const params = new URLSearchParams({
        status: 'published',
        page: '1',
        limit: '9'
      })
      
      const res = await fetch(`/api/blog?${params}`)
      const data = await res.json()
      
      if (data.success) {
        setPosts(data.data.posts)
      }
    } finally {
      setLoading(false)
    }
  }
  
  fetchPosts()
}, [])
```

### Fetch Single Post
```typescript
const fetchPost = async (slug: string) => {
  const res = await fetch(`/api/blog/${slug}`)
  const data = await res.json()
  return data.success ? data.data : null
}

// Usage
const post = await fetchPost('hello')
```

## Available Filters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| status | string | 'published' | published, draft, archived, all |
| category | string | - | AI & Technology, Design, Development, etc. |
| featured | boolean | - | true or false |
| page | number | 1 | Page number |
| limit | number | 9 | Posts per page |
| search | string | - | Search query |
| sort | string | 'date' | date or title |
| order | string | 'desc' | asc or desc |

## Categories

Available categories:
- All (default)
- AI & Technology
- Design
- Development
- UX Research
- Animation
- General

## Testing

**Test Page:** `http://localhost:3000/blog-api-test`

**Command Line:**
```bash
# Test all endpoints
curl http://localhost:3000/api/blog | jq '.'
curl http://localhost:3000/api/blog/hello | jq '.'
curl http://localhost:3000/api/blog/featured | jq '.'
curl http://localhost:3000/api/blog/categories | jq '.'
```

## Full Documentation

See `BLOG_API_DOCS.md` for complete documentation.
