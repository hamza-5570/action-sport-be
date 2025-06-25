import { NextResponse } from "next/server";
import { clientPromise } from "@/lib/actions/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("webactionsport");
    const collections = await db.listCollections().toArray();
    return NextResponse.json({ collections });
  } catch (error) {
    console.error("Connection test error:", error);
    return NextResponse.json({ error: "Failed to connect to MongoDB" }, { status: 500 });
  }
}
