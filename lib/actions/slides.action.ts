/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";

import { v4 as uuidv4 } from "uuid";
import { clientPromise } from "./mongodb";
import { Slide } from "@/types/products/products"; // Interface Slide

// Fonction pour ajouter un nouveau slide
export async function addSlide(newSlide: Slide) {
  try {
    const client = await clientPromise;
    const db = client.db("webactionsport");
    const collection = db.collection<Slide>("carousels");

    // Générer un UUID pour le champ _id
    const slideWithId = {
      ...newSlide,
      _id: uuidv4(), // Générer un UUID
      // createdAt: "", // new Date().toString,
      // updatedAt: "", // new Date().toString(),
      // buttonCaption: newSlide.buttonCaption ?? "",
      // url: newSlide.url ?? "",
      // title: newSlide.title ?? "",
      // subtitle: newSlide.subtitle ?? "",
      // isPublished: newSlide.isPublished ?? "",
    };

    const result = await collection.insertOne(slideWithId);
    return { success: true, insertedId: slideWithId._id }; // Retourner l'UUID
  } catch (error) {
    return { error: "Failed to add slide", status: 500 };
  }
}

// Fonction pour modifier un slide existant
export async function editSlide(slideId: string, updatedSlide: Partial<Slide>) {
  try {
    const client = await clientPromise;
    const db = client.db("webactionsport");
    const collection = db.collection<Slide>("carousels");

    const result = await collection.updateOne(
      { _id: slideId }, // Utiliser l'UUID comme identifiant
      { $set: { ...updatedSlide, updatedAt: new Date().toISOString() } }
    );

    if (result.matchedCount === 0) {
      return { error: "Slide not found", status: 404 };
    }

    return { success: true };
  } catch (error) {
    return { error: "Failed to edit slide", status: 500 };
  }
}

// Fonction pour supprimer un slide
export async function deleteSlide(slideId: string) {
  try {
    const client = await clientPromise;
    const db = client.db("webactionsport");
    const collection = db.collection<Slide>("carousels");

    const result = await collection.deleteOne({ _id: slideId }); // Utiliser l'UUID comme identifiant

    if (result.deletedCount === 0) {
      return { error: "Slide not found", status: 404 };
    }

    return { success: true };
  } catch (error) {
    return { error: "Failed to delete slide", status: 500 };
  }
}

// Fonction pour lister tous les slides
export async function listSlides() {
  try {
    const client = await clientPromise;
    const db = client.db("webactionsport");
    const collection = db.collection<Slide>("carousels");

    const slides = await collection.find({}).toArray();
   // console.log("Slides:", slides); // Log des slides récupérés
    return { success: true, data: slides };
  } catch (error) {
    return { error: "Failed to fetch slides", status: 500 };
  }
}
// Fonction pour récupérer un slide par son ID
export async function getSlideByID(slideId: string) {
  try {
    const client = await clientPromise;
    const db = client.db("webactionsport");
    const collection = db.collection<Slide>("carousels");

    // Rechercher le slide par son _id
    const slide = await collection.findOne({ _id: slideId });

    if (!slide) {
      return { error: "Slide not found", status: 404 };
    }
console.log(slide)
    return { success: true, data: slide };
  } catch (error) {
    console.error("Failed to fetch slide by ID:", error);
    return { error: "Failed to fetch slide by ID", status: 500 };
  }
}