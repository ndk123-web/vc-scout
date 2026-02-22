import { connectDB } from '@/lib/mongodb'
import { List } from '@/lib/models'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(req.url)
    const owner = searchParams.get('owner')

    let query: any = {}
    if (owner) query.owner = owner

    const lists = await List.find(query)
      .populate('companyIds')
      .sort({ createdAt: -1 })

    return NextResponse.json({ success: true, data: lists })
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

    if (!body.name) {
      return NextResponse.json(
        { success: false, error: 'Name is required' },
        { status: 400 }
      )
    }

    const list = new List({
      ...body,
      companyIds: body.companyIds || [],
    })

    const savedList = await list.save()

    return NextResponse.json({ success: true, data: savedList }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
