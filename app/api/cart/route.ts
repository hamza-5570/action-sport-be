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

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");

  if (!userId) {
    return corsJson({ error: "userId is required" }, 400 );
  }

  try {
    const client = await clientPromise;
    const db = client.db("webactionsport");
    const cartCollection = db.collection<UserCart>("cart");

    const userCart = await cartCollection.findOne({ userId });

    if (!userCart) {
      return corsJson({ cart: [] }, 200 );
    }

    const cartwithproduct= await cartCollection.aggregate([
      {
        $match: {
          userId: userId,
        },
      },
      {
        $unwind: "$cart",
      },
      {
        $addFields: {
          "cart.productId": { $toObjectId: "$cart.productId" },
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "cart.productId",
          foreignField: "_id",
          as: "cartDetails",
        },
      },
      {
        $addFields: {
          "cart":{
            $mergeObjects: [
              {productId: {
                $arrayElemAt:
                 ["$cartDetails", 0]
                }},
              {quantity: "$cart.quantity"},
              {addedAt: "$cart.addedAt"},
            ]
          }
        },
      },
      {
        $unset: ["cartDetails"]
      },
      {
        $group:{
          _id:"$_id",
          userId:{$first:"$userId"},
          cart:{$push:"$cart"}
        }
      }
      
    ]).toArray();



    return corsJson({ cart: cartwithproduct }, 200 );
  } catch (error) {
    console.error("GET Cart error:", error);
    return corsJson({ error: "Internal server error" }, 500 );
  }
}
