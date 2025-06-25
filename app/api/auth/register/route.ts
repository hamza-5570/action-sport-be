import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { clientPromise } from "@/lib/actions/mongodb";
import { User } from "@/types/user/user";
import { v4 as uuidv4 } from "uuid";
export async function POST(request: Request) {
  const { email, password, name } = await request.json();

  try {
        const client = await clientPromise;
        const db = client.db("webactionsport");
        const collection = db.collection<User>("users");
    

    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await collection.insertOne({
      email,
      password: hashedPassword,
      name,
      _id:uuidv4(),
      __v:1,
      role:"user",
emailVerified:false,
createdAt: Date(),
updatedAt:Date()

    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}