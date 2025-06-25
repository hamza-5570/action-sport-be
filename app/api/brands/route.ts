/* eslint-disable @typescript-eslint/no-unused-vars */
import { listBrands } from "@/lib/actions/brands.actions";
import { NextResponse } from "next/server";
//import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const data = await listBrands();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
