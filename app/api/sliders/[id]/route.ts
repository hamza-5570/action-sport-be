// app/api/sliders/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { clientPromise } from "@/lib/actions/mongodb";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const body = await req.json();

    const client = await clientPromise;
    const db = client.db("webactionsport");
    const collection = db.collection("carousels");

    const update = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: body }
    );

    return NextResponse.json({ message: "Slider updated", update });
  } catch (error) {
    console.error("Error updating slider:", error);
    return NextResponse.json({ message: "Failed to update slider" }, { status: 500 });
  }
}
