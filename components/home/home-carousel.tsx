/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import * as React from "react";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import { Slide } from "@/types/products/products";

export function HomeCarousel({
  items,
  index,
  locale,
}: {
  items: Slide[];
  index: number;
  locale: string;
}) {
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  );
  return (
           <div>
            {/* {items.length > 0 && (
              <div className="flex justify-center items-center">
                <h1 className="text-2xl md:text-4xl font-bold text-primary">
                  {items.length}
                </h1>
              </div>
            )} */}
    <Carousel
      dir="ltr"
      plugins={[plugin.current]}
      className="w-full mx-auto "
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
  <CarouselContent>
  {items.map((item) => (
    <CarouselItem key={item.title}>
      <Link href={`/${locale}/${item.url || ""}`}>
        <div className="flex aspect-[16/6] items-center justify-center p-6 relative -m-1">
          {item.url ? (
            <Image
              src={item.url}
              alt={item.title || "Slide image"}
              width={1200}
              height={600}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <p className="text-gray-500">No Image Available</p>
            </div>
          )}
          <div className="absolute w-1/3 left-16 md:left-32 top-1/2 transform -translate-y-1/2">
            <h2 className="text-xl md:text-6xl font-bold mb-4 text-primary">
              {item.title}
            </h2>
            <h6 className="text-xl md:text-2xl mb-4 text-primary">
              {item.subtitle}
            </h6>
            <Button className="hidden md:block">
              {item.buttonCaption}
            </Button>
          </div>
        </div>
      </Link>
    </CarouselItem>
  ))}
</CarouselContent>
      <CarouselPrevious className="left-0 md:left-12" />
      <CarouselNext className="right-0 md:right-12" />
    </Carousel>
    </div>
  );
}
