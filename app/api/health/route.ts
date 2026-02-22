import { connectDB } from '@/lib/mongodb'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    return NextResponse.json({
      success: true,
      message: 'Connected to MongoDB successfully',
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        message: 'Failed to connect to MongoDB',
      },
      { status: 500 }
    )
  }
}
