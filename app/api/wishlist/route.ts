import { NextRequest, NextResponse } from "next/server";
import { clientPromise } from "@/lib/actions/mongodb";
import { handleCors } from "@/lib/cors";
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

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db("webactionsport");
    const collection = db.collection<UserWishlist>("wishlists");

    const userWishlist = await collection.findOne({ userId });

    if (!userWishlist) {
      return NextResponse.json({ wishlist: [] }, { status: 200 });
    }
    const wishlishtWithProducts=await collection.aggregate([
      {
        $match: {
          userId: userId,
        },
      },
      {
        $unwind: "$products",
      },
      { 
        $addFields:{
          "products.productId": { $toObjectId: "$products.productId" }
        }
      },
      {
        $lookup: {
          from: "products",
          localField: "products.productId",
          foreignField: "_id",
          as: "productDetail",
        },
      },
      {
        $addFields: {
          products: {
            $mergeObjects: [
              {"addedAt":"$products.addedAt"},
              {$arrayElemAt: ["$productDetail", 0] }
            ]
          }
        }
      },
      {
        $unset: "productDetail"
      },{
        $group: {
          _id: "$_id",
          userId:{$first:"$userId"},
          products:{$push:"$products"}
       

        }
      }
    ]).toArray(); 

    
    return NextResponse.json(
      { wishlist: wishlishtWithProducts},
      { status: 200 }
    );
  } catch (error) {
    console.error("GET Wishlist error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
