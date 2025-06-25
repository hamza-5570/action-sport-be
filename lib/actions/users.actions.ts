/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";

import bcrypt from "bcryptjs";
import { clientPromise } from "./mongodb";
import { User } from "@/types/user/user";
//import { UUID } from "mongodb";
import { v4 as uuidv4 } from "uuid";
// Fonction pour enregistrer un nouvel utilisateur


export async function updateUser(userId: string, updates: Partial<User>) {
  try {
    const client = await clientPromise;
    const db = client.db("webactionsport");
    const collection = db.collection<User>("users");

    const result = await collection.updateOne(
      { _id: userId }, // Filtrer par _id
      { $set: { ...updates, updatedAt: new Date().toISOString() } } // Appliquer les mises à jour
    );

    if (result.matchedCount === 0) {
      throw new Error("User not found");
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to update user:", error);
    return { error: "Failed to update user" };
  }
}


export async function registerUser(newUser: Partial<User>) {
  try {
    const client = await clientPromise;
    const db = client.db("webactionsport");
    const collection = db.collection<User>("users");

    // Vérifier si l'email existe déjà
    const existingUser = await collection.findOne({ email: newUser.email });
    if (existingUser) {
      return { error: "Email already exists", status: 400 };
    }

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(newUser.password || "", 10);

    const userWithId = {
      ...newUser,
      _id: uuidv4(), // Générer un UUID sous forme de chaîne
      password: hashedPassword,
      emailVerified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      __v: 0,
    };

    const result = await collection.insertOne(userWithId as User);
    return { success: true, insertedId: result.insertedId };
  } catch (error) {
    return { error: "Failed to register user", status: 500 };
  }
}

// Fonction pour connecter un utilisateur
export async function loginUser(email: string, password: string) {
  try {
    const client = await clientPromise;
    const db = client.db("webactionsport");
    const collection = db.collection<User>("users");

    // Trouver l'utilisateur par email
    const user = await collection.findOne({ email });
    if (!user) {
      return { error: "Invalid email or password", status: 401 };
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return { error: "Invalid email or password", status: 401 };
    }

    return { success: true, user };
  } catch (error) {
    return { error: "Failed to login", status: 500 };
  }
}