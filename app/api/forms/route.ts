import { NextRequest, NextResponse } from 'next/server'
import { getCollection } from '@/lib/mongodb'
import { createFormSchema, generateSlug, type Form } from '@/lib/form-schema'
import { ObjectId } from 'mongodb'

/**
 * GET /api/forms - List all forms (admin only)
 */
export async function GET(request: NextRequest) {
  try {
    // Check for admin authorization (simple token check)
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const collection = await getCollection('forms')
    const forms = await collection
      .find({})
      .sort({ createdAt: -1 })
      .toArray()

    // Get submission counts for each form
    const submissionsCollection = await getCollection('form_submissions')
    const formsWithCounts = await Promise.all(
      forms.map(async (form) => {
        const count = await submissionsCollection.countDocuments({
          formId: form._id,
        })
        return {
          ...form,
          _id: form._id.toString(),
          submissionCount: count,
        }
      })
    )

    return NextResponse.json({
      success: true,
      forms: formsWithCounts,
    })
  } catch (error) {
    console.error('Error fetching forms:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch forms' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/forms - Create a new form (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    // Check for admin authorization
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()

    // Auto-generate slug if not provided
    if (!body.slug && body.title) {
      body.slug = generateSlug(body.title)
    }

    // Ensure settings has defaults
    body.settings = {
      submitButtonText: 'Submit',
      successMessage: 'Thank you! Your response has been recorded.',
      redirectUrl: '',
      notifyEmails: [],
      isActive: true,
      ...body.settings,
    }

    // Validate the form data
    const validation = createFormSchema.safeParse(body)
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

    // Check for slug uniqueness
    const collection = await getCollection('forms')
    const existingForm = await collection.findOne({ slug: validation.data.slug })
    if (existingForm) {
      return NextResponse.json(
        { success: false, error: 'A form with this slug already exists' },
        { status: 409 }
      )
    }

    // Create the form document
    const now = new Date()
    const formDoc: Omit<Form, '_id'> = {
      ...validation.data,
      createdAt: now,
      updatedAt: now,
    }

    const result = await collection.insertOne(formDoc)

    return NextResponse.json({
      success: true,
      form: {
        ...formDoc,
        _id: result.insertedId.toString(),
      },
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating form:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create form' },
      { status: 500 }
    )
  }
}
