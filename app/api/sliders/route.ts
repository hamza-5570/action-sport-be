import { NextRequest, NextResponse } from "next/server";
import { clientPromise } from "@/lib/actions/mongodb";
import { ObjectId } from "mongodb";

export async function GET() {
  const client = await clientPromise;
  const db = client.db("webactionsport");
  const sliders = await db.collection("carousels").find({}).toArray();
  return NextResponse.json(sliders);
}

export async function PATCH(req: NextRequest) {
  const sliders = await req.json();

  if (!Array.isArray(sliders) || sliders.length !== 3) {
    return NextResponse.json({ error: "Expected 3 sliders in array" }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db("webactionsport");

  const collection = db.collection("carousels");

  const updateResults = [];

  for (const slider of sliders) {
    const { _id, ...data } = slider;
    if (!_id) continue;

    const result = await collection.updateOne(
      { _id: new ObjectId(_id) },
      { $set: data }
    );
    updateResults.push(result);
  }

  return NextResponse.json({ success: true, updateResults });
}
