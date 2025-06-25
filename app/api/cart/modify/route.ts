import { NextRequest } from "next/server";
import { clientPromise } from "@/lib/actions/mongodb";
import {  corsJson, handleCors } from "@/lib/cors";
export function OPTIONS(req: NextRequest) {
  return handleCors(req);
}

type CartItem = {
  productId: string;
  quantity: number;
  addedAt: Date;
};

type UserCart = {
  userId: string;
  cart: CartItem[];
};

export async function PUT(req: NextRequest) {
  try {
    const { userId, productId, quantity } = await req.json();

    if (!userId || !productId || typeof quantity !== "number") {
      return corsJson({ error: "userId, productId and quantity are required" }, 400 );
    }

    const client = await clientPromise;
    const db = client.db("webactionsport");
    const cartCollection = db.collection<UserCart>("cart");

    if (quantity <= 0) {
      // Remove product if quantity is zero or negative
      await cartCollection.updateOne(
        { userId },
        { $pull: { cart: { productId } } }
      );

      return corsJson({ message: "Product removed from cart" }, 200 );
    }

    // Update quantity if product exists
    const result = await cartCollection.updateOne(
      { userId, "cart.productId": productId },
      {
        $set: {
          "cart.$.quantity": quantity,
          "cart.$.addedAt": new Date()
        }
      }
    );

    // If product not found, add it
    if (result.matchedCount === 0) {
      await cartCollection.updateOne(
        { userId },
        {
          $push: {
            cart: {
              productId,
              quantity,
              addedAt: new Date()
            }
          }
        },
        { upsert: true }
      );
      return corsJson({ message: "Product added to cart" }, 201 );
    }

    return corsJson({ message: "Cart updated" }, 200 );
  } catch (error) {
    console.error("PATCH Cart error:", error);
    return corsJson({ error: "Internal server error" }, 500 );
  }
}
