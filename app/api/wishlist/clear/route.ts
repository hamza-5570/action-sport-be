import { NextRequest, NextResponse } from "next/server";
import { clientPromise } from "@/lib/actions/mongodb";
import {  handleCors } from "@/lib/cors";
export function OPTIONS(req: NextRequest) {
  return handleCors(req);
}

type WishlistItem = {
  productId: string;
  addedAt: Date;
};

type UserWishlist = {
  userId: string;
  products: WishlistItem[];
};

export async function DELETE(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db("webactionsport");
    const collection = db.collection<UserWishlist>("wishlists");

    await collection.updateOne({ userId }, { $set: { products: [] } });

    return NextResponse.json({ message: "Wishlist cleared" }, { status: 200 });
  } catch (error) {
    console.error("Clear wishlist error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
