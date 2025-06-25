/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";

import { ObjectId } from "mongodb";
import { v4 as uuidv4 } from "uuid";
import { clientPromise } from "./mongodb";
import { Brand } from "@/types/products/products";

// Fonction pour ajouter une nouvelle marque
export async function addBrand(newBrand: Brand) {
  try {
    const client = await clientPromise;
    const db = client.db("webactionsport");
    const collection = db.collection<Brand>("brands");

    // Générer un UUID pour le champ _id
    const brandWithId = {
      ...newBrand,
      _id: uuidv4(), // Générer un UUID
      dateCreated: new Date().toISOString(),
      dateUpdated: new Date().toISOString(),
    };

    const result = await collection.insertOne(brandWithId);
    return { success: true, insertedId: brandWithId._id }; // Retourner l'UUID
  } catch (error) {
    return { error: "Failed to add brand", status: 500 };
  }
}
// Fonction pour modifier une marque existante
export async function editBrand(brandId: string, updatedBrand: Partial<Brand>) {
  try {
    const client = await clientPromise;
    const db = client.db("webactionsport");
    const collection = db.collection<Brand>("brands");

    const result = await collection.updateOne(
      { _id: brandId }, // Utiliser l'UUID comme identifiant
      { $set: { ...updatedBrand, dateUpdated: new Date().toISOString() } }
    );

    if (result.matchedCount === 0) {
      return { error: "Brand not found", status: 404 };
    }

    return { success: true };
  } catch (error) {
    return { error: "Failed to edit brand", status: 500 };
  }
}

// Fonction pour supprimer une marque
export async function deleteBrand(brandId: string) {
  try {
    const client = await clientPromise;
    const db = client.db("webactionsport");
    const collection = db.collection<Brand>("brands");

    const result = await collection.deleteOne({ _id: brandId }); // Utiliser l'UUID comme identifiant

    if (result.deletedCount === 0) {
      return { error: "Brand not found", status: 404 };
    }

    return { success: true };
  } catch (error) {
    return { error: "Failed to delete brand", status: 500 };
  }
}
// Fonction pour lister toutes les marques
export async function listBrands() {
  try {
    const client = await clientPromise;
    const db = client.db("webactionsport");
    const collection = db.collection<Brand>("brands");

    const brands = await collection.find({}).toArray();
    return { success: true, data: brands };
  } catch (error) {
    return { error: "Failed to fetch brands", status: 500 };
  }
}
// Fonction pour récupérer une marque par son ID
// Fonction pour récupérer une marque par son ID
export async function getBrandById(brandId: string) {
  try {
    const client = await clientPromise;
    const db = client.db("webactionsport");
    const collection = db.collection<Brand>("brands");

    // Rechercher la marque par son _id
    const brand = await collection.findOne({ _id: brandId });

    if (!brand) {
      return { error: "Brand not found", status: 404 };
    }

    return { success: true, data: brand };
  } catch (error) {
    console.error("Failed to fetch brand by ID:", error);
    return { error: "Failed to fetch brand by ID", status: 500 };
  }
}