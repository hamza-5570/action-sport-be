/* eslint-disable @typescript-eslint/no-unused-vars */
import { listSlides } from "@/lib/actions/slides.action";
import { NextResponse } from "next/server";
//import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const data = await listSlides();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
