/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";
//import clientPromise from "@/lib/mongodb";

import { getAllProductsAgregate } from "@/lib/actions/article.actions";

export async function GET(request: NextRequest) {
  const ref = request.nextUrl.searchParams.get("ref") || "walo ref";
  console.log("===============Ref:" + ref);

  const query = request.nextUrl.searchParams.get("q") || "all";
  const category = request.nextUrl.searchParams.get("category") || "all";
  const tag = request.nextUrl.searchParams.get("tag") || "all";
  const size = request.nextUrl.searchParams.get("size") || "all";
  const price = request.nextUrl.searchParams.get("price") || "all";
  const rating = request.nextUrl.searchParams.get("rating") || "all";
  const xGender = request.nextUrl.searchParams.get("gender") || "all";
  const brand = request.nextUrl.searchParams.get("brand") || "all";
  const sort = request.nextUrl.searchParams.get("sort") || "best-selling";
  const page = request.nextUrl.searchParams.get("page") || "1";
  const paramsxx = {
    query,

    category,
    tag,
    price,
    rating,
    xGender,
    brand,
    sort,
    page,
    size,
  };
  try {
    //   const data = await getAllProducts({query:query,category:category,tag:tag,price:price,rating:rating,xGender:xGender,brand:brand,sort:sort,page:Number(page)});
    const data = await getAllProductsAgregate({
      query: query,
      category: category,
      tag: tag,
      price: price,
      rating: rating,
      xGender: xGender,
      brand: brand,
      size: size,
      sort: sort,
      page: Number(page),
    });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
