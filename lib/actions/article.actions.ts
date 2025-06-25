/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";

import { ObjectId } from "mongodb";
//import { clientPromise } from "../mongodb";
import { Product } from "@/types/products/products";
import { PAGE_SIZE } from "../constants";
import { clientPromise } from "./mongodb";

//import Carousel, { ICarousel } from '../db/models/carousel.model';
export async function getAllProductsAgregate({
  query,
  limit,
  page,
  size,
  category,
  tag,
  price,
  brand,
  rating,
  xGender,
  sort,
}: {
  query: string;
  category: string;
  tag: string;
  limit?: number;
  page: number;
  size?: string;
  price?: string;
  rating?: string;
  brand?: string;
  xGender?: string;
  sort?: string;
}) {
  try {
    limit = limit || PAGE_SIZE;

    const queryFilter =
      query && query !== "all"
        ? {
            $or: [
              { name: { $regex: query, $options: "i" } },
              { reference: { $regex: query, $options: "i" } },
            ],
          }
        : {};
    const categoryFilter = category && category !== "all" ? { category } : {};
    const brandFilter =
      brand && brand !== "all" && brand !== "" ? { brand } : {};
    const genderFilter = xGender && xGender !== "all" ? { xGender } : {};
    const tagFilter = tag && tag !== "all" && tag !== "" ? { tags: tag } : {};
    // console.log("Wassl hnaaa")
    const sizeFilter =
      size && size !== "all" && size !== ""
        ? { stockselonSocieteMagasinTaille: { $elemMatch: { xTaille: size } } }
        : {};
    const ratingFilter =
      rating && rating !== "all" && rating !== ""
        ? {
            avgRating: {
              $gte: Number(rating),
            },
          }
        : {};
    const priceFilter =
      price && price !== "all" && price !== ""
        ? {
            price: {
              $gte: Number(price.split("-")[0]),
              $lte: Number(price.split("-")[1]),
            },
          }
        : {};
    const order: Record<string, 1 | -1> =
      sort === "best-selling"
        ? { numSales: -1 }
        : sort === "price-low-to-high"
          ? { price: 1 }
          : sort === "price-high-to-low"
            ? { price: -1 }
            : sort === "avg-customer-review"
              ? { avgRating: -1 }
              : { _id: -1 };
    const isPublished = { isPublished: true };

    const client = await clientPromise;
    const db = client.db("webactionsport");
    const collection = db.collection<Product>("products");
    //console.log("sizeeeeeeeeeeeeeee:" + size);
    const pipeline = [
      {
        $match: {
          ...queryFilter,
          ...categoryFilter,
          ...brandFilter,
          ...genderFilter,
          ...tagFilter,
          ...ratingFilter,
          ...priceFilter,
          ...isPublished,
        },
      },
      {
        $unwind: "$stockselonSocieteMagasinTaille",
      },
      {
        $group: {
          _id: {
            reference: "$reference",
            designation: "$Designation",
            brand: "$brand",
            slug: "$_id",
            category: "$category",
            image: "$image",
            images: "$images",
            countInStock: "$countInStock",
            prixpublic: "$prixpublic",
            escompte: "$escompte",
            prixNet: "$prixNet",
          },
          totalQuantity: {
            $sum: "$stockselonSocieteMagasinTaille.QteTotal",
          },
          sizes: {
            $push: {
              size: "$stockselonSocieteMagasinTaille.xTaille",
              quantity: "$stockselonSocieteMagasinTaille.QteTotal",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalQuantity: 1,
          sizes: 1,
          reference: "$_id.reference",
          designation: "$_id.designation",
          brand: "$_id.brand",
          slug: "$_id.slug",
          category: "$_id.category",
          image: "$_id.image",
          images: "$_id.images",
          countInStock: "$_id.countInStock",
          prixpublic: "$_id.prixpublic",
          escompte: "$_id.escompte",
          prixNet: "$_id.prixNet",
        },
      },
      { $sort: order },
      { $skip: limit * (Number(page) - 1) },
      { $limit: limit },
    ];
// console.log("Hnaaa ")
    const products = await collection.aggregate(pipeline).toArray();
// console.log(products)
    const productsCount = await collection.countDocuments({
      ...categoryFilter,
      ...brandFilter,
      ...genderFilter,
      ...tagFilter,
      ...ratingFilter,
      ...priceFilter,
      ...queryFilter,
      ...isPublished,
    });

    return {
      totalrecords: productsCount,
      currentpage: page,
      totalPages: Math.ceil(productsCount / limit),
      data: products,
    };
  } catch (error) {
    return { error: "Non trouve" };
  }
}

export async function getProductById(productId: string) {
  try {
    const client = await clientPromise;
    const db = client.db("webactionsport");
    const collection = db.collection<Product>("products");
    const data = await collection.findOne({
      _id: new ObjectId(productId),
    });

    if (!data) {
      return { error: "Data not found", status: 404 };
    }

    return data;
  } catch (error) {
    return { error: "Failed to fetch data", status: 500 };
  }
}

// GET
export async function getAllProducts({
  query,
  limit,
  page,
  category,
  tag,
  price,
  brand,
  rating,
  xGender,
  sort,
  Designation,
}: {
  query: string;
  category: string;
  tag: string;
  limit?: number;
  page: number;
  price?: string;
  rating?: string;
  brand?: string;
  xGender?: string;
  sort?: string;
  Designation?: string;
}) {
  try {
    limit = limit || PAGE_SIZE;

    const queryFilter =
      query && query !== "all"
        ? {
            $or: [
              { name: { $regex: query, $options: "i" } },
              { reference: { $regex: query, $options: "i" } },
            ],
          }
        : {};
    //    console.log("queryyyyyyyyyyy:" + queryFilter);
    const categoryFilter = category && category !== "all" ? { category } : {};

    const brandFilter =
      brand && brand !== "all" && brand !== "" ? { brand } : {};
    const genderFilter = xGender && xGender !== "all" ? { xGender } : {};
    const tagFilter = tag && tag !== "all" && tag !== "" ? { tags: tag } : {};
    //  console.log("xgenderrrrrrrrrr:"+xGender);

    const ratingFilter =
      rating && rating !== "all" && rating !== ""
        ? {
            avgRating: {
              $gte: Number(rating),
            },
          }
        : {};
    // 10-50
    const priceFilter =
      price && price !== "all" && price !== ""
        ? {
            price: {
              $gte: Number(price.split("-")[0]),
              $lte: Number(price.split("-")[1]), // 10-50
            },
          }
        : {};
    const order: Record<string, 1 | -1> =
      sort === "best-selling"
        ? { numSales: -1 }
        : sort === "price-low-to-high"
        ? { price: 1 }
        : sort === "price-high-to-low"
        ? { price: -1 }
        : sort === "avg-customer-review"
        ? { avgRating: -1 }
        : { _id: -1 };
    const isPublished = { isPublished: true };

    const client = await clientPromise;
    const db = client.db("webactionsport");
    const collection = db.collection<Product>("products");
    const products = await collection
      .find({
        ...queryFilter,
        ...categoryFilter,
        ...brandFilter,
        ...genderFilter,
        ...tagFilter,
        ...ratingFilter,
        ...priceFilter,

        ...isPublished,
      })
      .sort(order)
      .skip(limit * (Number(page) - 1))
      .limit(limit)
      .toArray();
    //    console.log(products.length);

    const productsCount = await db.collection("products").countDocuments({
      ...categoryFilter,
      ...brandFilter,
      ...genderFilter,
      ...tagFilter,
      ...ratingFilter,
      ...priceFilter,
      ...queryFilter,
      ...isPublished,
    });
    return {
      totalrecords: productsCount,
      currentpage: page,
      totalPages: Math.ceil(productsCount / 10),
      data: products,
    };
    // return data;
  } catch (error) {
    return { error: "Non trouve" };
  }
}


export async function getProductByIDAgregate({ ID }: { ID: string }) {
  try {
    const client = await clientPromise;
    const db = client.db("webactionsport");
    const collection = db.collection<Product>("products");

    const pipeline = [
      { $match: { _id: new ObjectId(ID) } },
      {
        $unwind: "$stockselonSocieteMagasinTaille",
      },
      {
        $group: {
          _id: {
            reference: "$reference",
            designation: "$Designation",
            brand: "$brand",
            slug: "$_id",
            category: "$category",
            image: "$image",
            images: "$images",
            countInStock: "$countInStock",
            prixpublic: "$prixpublic",
            escompte: "$escompte",
            prixNet: "$prixNet",
          },
          totalQuantity: {
            $sum: "$stockselonSocieteMagasinTaille.QteTotal",
          },
          sizes: {
            $push: {
              size: "$stockselonSocieteMagasinTaille.xTaille",
              quantity: "$stockselonSocieteMagasinTaille.QteTotal",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalQuantity: 1,
          sizes: 1,
          reference: "$_id.reference",
          designation: "$_id.designation",
          brand: "$_id.brand",
          slug: "$_id.id",
          category: "$_id.category",
          image: "$_id.image",
          images: "$_id.images",
          countInStock: "$_id.countInStock",
          prixpublic: "$_id.prixpublic",
          escompte: "$_id.escompte",
          prixNet: "$_id.prixNet",
        },
      },
    ];

    const product = await collection.aggregate(pipeline).toArray();

    return {
      data: product,
    };
  } catch (error) {
    return { error: "Non trouve" };
  }
}
