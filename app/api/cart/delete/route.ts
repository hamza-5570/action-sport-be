import { NextRequest } from "next/server";
import { clientPromise } from "@/lib/actions/mongodb";
import { handleCors, corsJson } from "@/lib/cors";
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

export async function DELETE(req: NextRequest) {
  try {
    const  userId= req.nextUrl.searchParams.get("userId");
    const productId = req.nextUrl.searchParams.get("productId");
    if (!userId || !productId) {
      return corsJson({ error: "Missing userId or productId" }, 400 );
    }

    const client = await clientPromise;
    const db = client.db("webactionsport");
    const cartCollection = db.collection<UserCart>("cart");

    const result = await cartCollection.updateOne(
      { userId },
      { $pull: { cart: { productId } } }
    );

    if (result.modifiedCount === 0) {
      return corsJson({ message: "Product not found in cart" }, 404 );
    }

    return corsJson({ message: "Product removed from cart" }, 200 );
  } catch (error) {
    console.error("Cart DELETE error:", error);
    return corsJson({ error: "Internal server error" }, 500 );
  }
}
