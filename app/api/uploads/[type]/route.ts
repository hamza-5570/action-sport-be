import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

export async function POST(
  req: NextRequest,
  { params }: { params: { type: string } }
) {
  console.log('UPLOAD endpoint hit for type:', params.type);
  const { type } = params;

  if (!["desktop", "tablet", "mobile"].includes(type)) {
    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  }

  const data = await req.formData();
  const file = data.get("file");

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No valid file provided" }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const uploadDir = path.join(process.cwd(), "public", "uploads", type);
  await fs.mkdir(uploadDir, { recursive: true });

  // Simple filename sanitization: remove spaces, replace with _
  const safeFileName = file.name.replace(/\s+/g, "_");

  const filePath = path.join(uploadDir, safeFileName);
  await fs.writeFile(filePath, buffer);

  return NextResponse.json({
    success: true,
    filename: safeFileName,
    path: `/uploads/${type}/${safeFileName}`,
  });
}
