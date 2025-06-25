// app/api/uploadftp/route.ts
import { NextResponse } from 'next/server';
import * as ftp from 'basic-ftp';
import { Readable } from 'stream';
export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as File;

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  try {
    // Example FTP upload logic
    const client = new ftp.Client();
    await client.access({
      host: process.env.FTP_HOST,
      user: process.env.FTP_USER,
      password: process.env.FTP_PASSWORD,
      secure: false,
      secureOptions: { rejectUnauthorized: false },
    });

    const buffer = Buffer.from(await file.arrayBuffer());
    const readableStream = new Readable({
        read() {
          this.push(buffer);
          this.push(null);
        },
      });
   //   await client.remove( `img/uploads/asics2623.jpg`);  
      await client.uploadFrom(readableStream, `img/carousels/${file.name}`);
    return NextResponse.json({
      success: true,
      fileName: file.name,
      size: file.size
    });
  } catch (error) {
    console.error('FTP upload failed:', error);
    return NextResponse.json(
      { error: 'File upload failed' },
      { status: 500 }
    );
  }
}