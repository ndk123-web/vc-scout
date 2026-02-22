import { connectDB } from '@/lib/mongodb'
import { Note } from '@/lib/models'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(req.url)
    const companyId = searchParams.get('companyId')

    let query: any = {}
    if (companyId) query.companyId = companyId

    const notes = await Note.find(query).sort({ createdAt: -1 })

    return NextResponse.json({ success: true, data: notes })
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

    if (!body.companyId || !body.text) {
      return NextResponse.json(
        { success: false, error: 'Company ID and text are required' },
        { status: 400 }
      )
    }

    const note = new Note({
      ...body,
      type: body.type || 'research',
    })

    await note.save()

    return NextResponse.json({ success: true, data: note }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
