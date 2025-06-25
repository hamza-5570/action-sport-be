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
  const userId = req.nextUrl.searchParams.get("userId");

  if (!userId) {
    return corsJson({ error: "userId is required" }, 400 );
  }

  try {
    const client = await clientPromise;
    const db = client.db("webactionsport");
    const cartCollection = db.collection<UserCart>("cart");

    await cartCollection.updateOne(
      { userId },
      { $set: { cart: [] } }
    );

    return corsJson({ message: "Cart cleared" }, 200 );
  } catch (error) {
    console.error("Clear cart error:", error);
    return corsJson({ error: "Server error" }, 500 );
  }
}
