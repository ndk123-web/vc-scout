import { connectDB } from '@/lib/mongodb'
import { Company, List, Note } from '@/lib/models'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    const { id } = params
    
    // Validate ID format
    if (!id || id === 'undefined' || id.length !== 24) {
      return NextResponse.json(
        { success: false, error: 'Invalid ID format' },
        { status: 400 }
      )
    }

    const list = await List.findById(id).populate('companyIds')

    if (!list) {
      return NextResponse.json(
        { success: false, error: 'List not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: list })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()

    const body = await req.json()
    let updateOperation = body

    // Support atomic array updates if special keys are present
    if (body.addCompanyId) {
      updateOperation = { $addToSet: { companyIds: body.addCompanyId } }
    } else if (body.removeCompanyId) {
      updateOperation = { $pull: { companyIds: body.removeCompanyId } }
    }

    const list = await List.findByIdAndUpdate(params.id, updateOperation, { new: true })

    if (!list) {
      return NextResponse.json(
        { success: false, error: 'List not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: list })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()

    const list = await List.findByIdAndDelete(params.id)

    if (!list) {
      return NextResponse.json(
        { success: false, error: 'List not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'List deleted successfully',
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
