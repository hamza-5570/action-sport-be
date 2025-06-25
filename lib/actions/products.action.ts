/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";

import { ObjectId } from "mongodb";
import { clientPromise } from "./mongodb";
import { Product } from "@/types/products/products";

// Fonction pour ajouter un nouveau produit
export async function addProduct(newProduct: Partial<Product>) {
  try {
    const client = await clientPromise;
    const db = client.db("webactionsport");
    const collection = db.collection<Product>("products");

    // Générer un UUID pour le champ _id
    const productWithId = {
      ...newProduct,
      _id: new ObjectId(), // Générer un ObjectId
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      Categorie: newProduct.Categorie ?? "", // Ensure default value
      Designation: newProduct.Designation ?? "",
      Image: newProduct.image ?? "",
      Marque: newProduct.Marque ?? "",
      reference: newProduct.reference ?? "",
      slug: newProduct.slug ?? "",
      name: newProduct.name ?? "", // Ensure default value for name
      stockselonSocieteMagasin: newProduct.stockselonSocieteMagasin ?? [], // Ensure default value
      stockselonSocieteMagasinTaille: newProduct.stockselonSocieteMagasinTaille ?? [], // Ensure default value
      nouveaute: newProduct.nouveaute ?? false, // Ensure default value
      promotion: newProduct.promotion ?? false, // Ensure default value
      category: newProduct.category ?? "", // Ensure default value
      description: newProduct.description ?? "", // Ensure default value
      xGender: newProduct.xGender ?? "", // Ensure default value
      price: newProduct.price ?? 0, // Ensure default value
      listPrice: newProduct.listPrice ?? 0, // Ensure default value
      countInStock: newProduct.countInStock ?? 0, // Ensure default value
      tags: newProduct.tags ?? [], // Ensure default value
      colors: newProduct.colors ?? [], // Ensure default value
      sizes: newProduct.sizes ?? [], // Ensure default value
      avgRating: newProduct.avgRating ?? 0, // Ensure default value
      numReviews: newProduct.numReviews ?? 0, // Ensure default value
      ratingDistribution: newProduct.ratingDistribution ?? [], // Ensure default value
      numSales: newProduct.numSales ?? 0, // Ensure default value
      isPublished: newProduct.isPublished ?? false, // Ensure default value 
      v: newProduct.v ?? 0, // Ensure default value
      dernierDatePromo: newProduct.dernierDatePromo ?? "", // Ensure default value
      prixNet: newProduct.prixNet ?? 0, // Ensure default value
      prixpublic: newProduct.prixpublic ?? 0, // Ensure default value
      // Add similar default values for other optional fields as needed
      escompte: newProduct.escompte ?? 0, // Ensure default value
      blackfriday: newProduct.blackfriday ?? false, // Ensure default value
      venteflash: newProduct.venteflash ?? false, // Ensure default value
      magasin: newProduct.magasin ?? "", // Ensure default value
      societe: newProduct.societe ?? "", // Ensure default value
      brand: newProduct.brand ?? "", // Ensure default value
      image: newProduct.image ?? "", // Ensure default value
      images: newProduct.images ?? [], // Ensure default value
     };

   const result = await collection.insertOne(productWithId);
    return { success: true, insertedId: productWithId._id }; // Retourner l'UUID
  } catch (error) {
    console.error("Failed to add product:", error);
    return { error: "Failed to add product", status: 500 };
  }
}

// Fonction pour modifier un produit existant
export async function editProduct(productId: string, updatedProduct: Partial<Product>) {
  try {
    const client = await clientPromise;
    const db = client.db("webactionsport");
    const collection = db.collection<Product>("products");

    const result = await collection.updateOne(
      { _id: new ObjectId(productId) }, // Convertir productId en ObjectId
      { $set: { ...updatedProduct, updatedAt: new Date().toISOString() } }
    );

    if (result.matchedCount === 0) {
      return { error: "Product not found", status: 404 };
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to edit product:", error);
    return { error: "Failed to edit product", status: 500 };
  }
}

// Fonction pour supprimer un produit
export async function deleteProduct(productId: string) {
  try {
    const client = await clientPromise;
    const db = client.db("webactionsport");
    const collection = db.collection<Product>("products");

    const result = await collection.deleteOne({ _id: new ObjectId(productId) }); // Convertir productId en ObjectId

    if (result.deletedCount === 0) {
      return { error: "Product not found", status: 404 };
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to delete product:", error);
    return { error: "Failed to delete product", status: 500 };
  }
}

// Fonction pour lister tous les produits
export async function listProducts() {
  try {
    const client = await clientPromise;
    const db = client.db("webactionsport");
    const collection = db.collection<Product>("products");

    const products = await collection.find({}).toArray();
    return { success: true, data: products };
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return { error: "Failed to fetch products", status: 500 };
  }
}