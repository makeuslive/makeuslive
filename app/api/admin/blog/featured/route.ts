import { NextRequest, NextResponse } from 'next/server'
import { getCollection } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

// Toggle featured status
export async function POST(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json({ error: 'ID required' }, { status: 400 })
        }

        const collection = await getCollection('blog_posts')
        const doc = await collection.findOne({ _id: new ObjectId(id) })

        if (!doc) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 })
        }

        const newFeatured = !doc.featured
        await collection.updateOne(
            { _id: new ObjectId(id) },
            { 
                $set: { 
                    featured: newFeatured, 
                    updatedAt: new Date().toISOString() 
                } 
            }
        )

        return NextResponse.json({ 
            id, 
            featured: newFeatured,
            message: newFeatured ? 'Post featured' : 'Post unfeatured'
        })
    } catch (error) {
        console.error('Error toggling featured:', error)
        return NextResponse.json({ error: 'Failed to toggle featured' }, { status: 500 })
    }
}
