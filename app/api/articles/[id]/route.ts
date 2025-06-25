/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getProductByIDAgregate } from "@/lib/actions/article.actions";
import { clientPromise } from "@/lib/actions/mongodb";
import { Product } from "@/types/products/products";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> } // Assurez-vous que params est une promesse
) {
  try {
    const { id } = await context.params; // Attendre la résolution de params
    const data = await getProductByIDAgregate({ ID: id }); // Appeler la fonction avec l'ID

    if (!data) {
      return NextResponse.json({ error: "Data not found" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> } // Assurez-vous que params est une promesse
) {
  try {
    const { id } = await context.params; // Attendre la résolution de params
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db("webactionsport");
    const collection = db.collection<Product>("products");

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: body }
    );

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update data" },
      { status: 500 }
    );
  }
}