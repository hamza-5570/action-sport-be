// app/api/wishlist/route.ts

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
  const  userId= req.nextUrl.searchParams.get("userId");
  const productId = req.nextUrl.searchParams.get("productId");

  if (!userId || !productId) {
    return NextResponse.json({ message: 'userId and productId are required' }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db('webactionsport');
    const collection = db.collection<UserWishlist>('wishlists');

    const result = await collection.updateOne(
      { userId },
      { $pull: { products: { productId } } }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json({ message: 'Product not found in wishlist' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Product removed from wishlist' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

