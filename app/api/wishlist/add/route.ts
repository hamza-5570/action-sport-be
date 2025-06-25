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

export async function POST(req: NextRequest) { 
  const { userId, productId } = await req.json();
  console.log("Received data:", { userId, productId });

  if (!userId || !productId) {
    return NextResponse.json({ message: 'userId and productId are required' }, { status: 400 });
  }

  try {
    console.log("Connecting to MongoDB...");
    const client = await clientPromise;
    console.log("Connected!");
    
    const db = client.db('webactionsport');
    const collection = db.collection<UserWishlist>('wishlists');
    console.log("Got collection!");
    
    const userWishlist = await collection.findOne({ userId });
    console.log("User wishlist:", userWishlist);


    const alreadyAdded = userWishlist?.products.find(
      (p) => p.productId === productId
    );

    if (alreadyAdded) {
      // REMOVE it from wishlist
      await collection.updateOne(
        { userId },
        { $pull: { products: { productId } } }
      );
      return NextResponse.json({ message: 'Product removed from wishlist' }, { status: 200 });
    } else {
      // If user exists, ADD to wishlist
      if (userWishlist) {
        await collection.updateOne(
          { userId },
          {
            $push: {
              products: {
                productId,
                addedAt: new Date(),
              },
            },
          }
        );
      } else {
        // If user has no wishlist yet, create one
        await collection.insertOne({
          userId,
          products: [
            {
              productId,
              addedAt: new Date(),
            },
          ],
        });
      }

      return NextResponse.json({ message: 'Product added to wishlist' }, { status: 201 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
