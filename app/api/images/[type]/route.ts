import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs'

export async function GET(
  request: NextRequest,
  context: { params: { type: string } }
) {
  const { type } = context.params

  const allowedTypes = ['desktop', 'tablet', 'mobile']
  if (!allowedTypes.includes(type)) {
    return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
  }

  const dirPath = path.join(process.cwd(), 'public', 'uploads', type)

  try {
    const files = fs.existsSync(dirPath) ? fs.readdirSync(dirPath) : []
    const urls = files.map((file) => `/uploads/${type}/${file}`)
    return NextResponse.json(urls)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Failed to read directory' },
      { status: 500 }
    )
  }
}
