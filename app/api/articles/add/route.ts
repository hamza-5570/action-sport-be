// app/api/articles/route.ts

import { NextRequest, NextResponse } from "next/server";
import {  handleCors } from "@/lib/cors";
import { addProduct } from "@/lib/actions/products.action";
export function OPTIONS(req: NextRequest) {
  return handleCors(req);
}

export async function POST(req: NextRequest) { 
  const body = await req.json();
  console.log("Received data:", body);
  try {
    const response = await addProduct(body);
    if(response){
      return NextResponse.json({ message: 'Product added ' }, { status: 200 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
