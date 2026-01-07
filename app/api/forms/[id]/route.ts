import { NextRequest, NextResponse } from 'next/server'
import { getCollection } from '@/lib/mongodb'
import { updateFormSchema, type Form } from '@/lib/form-schema'
import { ObjectId } from 'mongodb'

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * GET /api/forms/[id] - Get a single form by ID or slug
 * Public endpoint for form rendering
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const collection = await getCollection('forms')

    // Try to find by ObjectId first, then by slug
    let form = null
    if (ObjectId.isValid(id)) {
      form = await collection.findOne({ _id: new ObjectId(id) })
    }
    if (!form) {
      form = await collection.findOne({ slug: id })
    }

    if (!form) {
      return NextResponse.json(
        { success: false, error: 'Form not found' },
        { status: 404 }
      )
    }

    // Check if form is active for public access
    const isAdmin = request.headers.get('authorization')?.startsWith('Bearer ')
    if (!form.settings?.isActive && !isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Form is not available' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      form: {
        ...form,
        _id: form._id.toString(),
      },
    })
  } catch (error) {
    console.error('Error fetching form:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch form' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/forms/[id] - Update a form (admin only)
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    // Check for admin authorization
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    const body = await request.json()

    // Validate the update data
    const validation = updateFormSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: validation.error.errors,
        },
        { status: 400 }
      )
    }

    const collection = await getCollection('forms')

    // Find the form
    let formId: ObjectId | null = null
    if (ObjectId.isValid(id)) {
      formId = new ObjectId(id)
    } else {
      const existing = await collection.findOne({ slug: id })
      if (existing) {
        formId = existing._id as ObjectId
      }
    }

    if (!formId) {
      return NextResponse.json(
        { success: false, error: 'Form not found' },
        { status: 404 }
      )
    }

    // Check slug uniqueness if changing
    if (validation.data.slug) {
      const existingWithSlug = await collection.findOne({
        slug: validation.data.slug,
        _id: { $ne: formId },
      })
      if (existingWithSlug) {
        return NextResponse.json(
          { success: false, error: 'A form with this slug already exists' },
          { status: 409 }
        )
      }
    }

    // Update the form
    const result = await collection.findOneAndUpdate(
      { _id: formId },
      {
        $set: {
          ...validation.data,
          updatedAt: new Date(),
        },
      },
      { returnDocument: 'after' }
    )

    if (!result) {
      return NextResponse.json(
        { success: false, error: 'Form not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      form: {
        ...result,
        _id: result._id.toString(),
      },
    })
  } catch (error) {
    console.error('Error updating form:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update form' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/forms/[id] - Delete a form (admin only)
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    // Check for admin authorization
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    const collection = await getCollection('forms')

    // Find the form
    let formId: ObjectId | null = null
    if (ObjectId.isValid(id)) {
      formId = new ObjectId(id)
    } else {
      const existing = await collection.findOne({ slug: id })
      if (existing) {
        formId = existing._id as ObjectId
      }
    }

    if (!formId) {
      return NextResponse.json(
        { success: false, error: 'Form not found' },
        { status: 404 }
      )
    }

    // Delete the form
    const result = await collection.deleteOne({ _id: formId })

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Form not found' },
        { status: 404 }
      )
    }

    // Optionally delete all submissions for this form
    const submissionsCollection = await getCollection('form_submissions')
    await submissionsCollection.deleteMany({ formId })

    return NextResponse.json({
      success: true,
      message: 'Form deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting form:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete form' },
      { status: 500 }
    )
  }
}
