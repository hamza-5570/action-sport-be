// import { getAllProducts } from "@/lib/actions/article.actions";
// import { getAllbrands } from "@/lib/actions/brands.actions";

import { HomeCarousel } from "@/components/home/home-carousel";
import { listSlides } from "@/lib/actions/slides.action";
import { Slide } from "@/types/products/products";

export default async function Home() {
  const response = await listSlides();
  const slides: Slide[] = response.data ?? [];
  console.log(response.data);
  // const brands = await getAllbrands({
  //   query: "all",
  //   category: "all",
  //   tag: "all",
  //   limit: 10,
  //   page: 1,
  // });
  // console.log("brands", brands);
  //   const products=await getAllProducts({
  //     query: "all",
  //     category: "all",
  //     tag: "all",
  //     limit: 10,
  //     page: 1,
  //   });
  // console.log("products", products);
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <HomeCarousel items={slides} index={0} locale="fr" />
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center"></footer>
    </div>
  );
}
