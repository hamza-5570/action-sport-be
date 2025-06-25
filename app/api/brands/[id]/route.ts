import { getBrandById } from "@/lib/actions/brands.actions";
import { clientPromise } from "@/lib/actions/mongodb";

import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> } // Assurez-vous que params est une promesse
) {
  const { id } = await context.params;
  try {
    // Appeler la fonction pour récupérer la marque par ID
    const data = await getBrandById(id);
    if (!data || data.error) {
      return NextResponse.json({ error: "Data not found" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching brand:", error);
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

    // Vérifier si params.id est défini
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const body = await request.json();
    const client = await clientPromise;
    const db = client.db("webactionsport");

    // Typage explicite de la collection pour indiquer que _id est une chaîne
    const collection = db.collection<{ _id: string }>("brands");

    const result = await collection.updateOne(
      { _id: id }, // Utiliser id comme chaîne
      { $set: body }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Brand updated successfully", result });
  } catch (error) {
    console.error("Error updating brand:", error);
    return NextResponse.json(
      { error: "Failed to update data" },
      { status: 500 }
    );
  }
}