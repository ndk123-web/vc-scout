import { connectDB } from '@/lib/mongodb'
import { Company } from '@/lib/models'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const stage = searchParams.get('stage') || 'All Stages'
    const skip = (page - 1) * limit

    const query: any = {}

    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { website: { $regex: search, $options: 'i' } },
        { 'enrichedData.summary': { $regex: search, $options: 'i' } },
        { 'enrichedData.keywords': { $elemMatch: { $regex: search, $options: 'i' } } }
      ]
    }

    // Stage filter
    if (stage && stage !== 'All Stages') {
      query.stage = stage
    }

    const companies = await Company.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })

    const total = await Company.countDocuments(query)

    return NextResponse.json({
      success: true,
      data: companies,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB()

    const body = await req.json()

    // Validate required fields
    if (!body.name || !body.website) {
      return NextResponse.json(
        { success: false, error: 'Name and website are required' },
        { status: 400 }
      )
    }

    // Check if company already exists
    const existing = await Company.findOne({ website: body.website })
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Company with this website already exists' },
        { status: 409 }
      )
    }

    const company = new Company({
      ...body,
      status: 'new',
    })

    const savedCompany = await company.save()

    return NextResponse.json(
      { success: true, data: savedCompany },
      { status: 201 }
    )
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
