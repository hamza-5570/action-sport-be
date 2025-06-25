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

export async function POST(req: NextRequest) {
  try {
    const { userId, productId, quantity = 1 } = await req.json();

    if (!userId || !productId) {
      return corsJson({ error: "Missing userId or productId" }, 400 );
    }

    const client = await clientPromise;
    const db = client.db("webactionsport");
    const cartCollection = db.collection<UserCart>("cart");

    const userCart = await cartCollection.findOne({ userId });

    if (userCart) {
      const existingProduct = userCart.cart.find((item) => item.productId === productId);

      if (existingProduct) {
        // Increase quantity
        await cartCollection.updateOne(
          { userId, "cart.productId": productId },
          {
            $inc: { "cart.$.quantity": quantity },
            $set: { "cart.$.addedAt": new Date() }
          }
        );
        return corsJson({ message: "Cart updated" }, 200 );
      } else {
        // Add new product to cart array
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
          }
        );
        return corsJson({ message: "Product added to cart" }, 201 );
      }
    } else {
      // Create cart for user
      await cartCollection.insertOne({
        userId,
        cart: [
          {
            productId,
            quantity,
            addedAt: new Date()
          }
        ]
      });
      return corsJson({ message: "Cart created and product added" }, 201 );
    }
  } catch (error) {
    console.error("Cart POST error:", error);
    return corsJson({ error: "Internal server error" }, 500 );
  }
}
