import React from "react";
import Image from "next/image";
import Link from "next/link";
export default function Hero() {
  return (
    <section className="relative -mt-5 bg-transparent">
      <div className="flex flex-col w-full px-auto lg:px-28 lg:flex-row lg:gap-12 bg-blue-500 py-24  lg:py-36 lg:min-h-screen">
        <div className="relative text-white flex flex-col max-w-3xl px-auto lg:text-left lg:py-12 xl:py-8 lg:items-start lg:max-w-none lg:mx-0 lg:flex-1 lg:w-1/">
          <h1 className="text-3xl text-center lg:mx-60 md:mx-auto font-bold leading-tight lg:text-5xl">
            Jasa Pembuatan Website Terpercaya Sejak 2018
          </h1>
          <h1 className="text-center mx-auto px-auto mt-8 mb-4 text-lg leading-tight">
            Gratis pemanduan, Garansi hacker, Dan mempunyai 300 klien aktif
            diseluruh dunia. Berdiri sejak 2018
          </h1>
          <div className="flex justify-center mt-4 lg:mx-auto">
            <Link
              type="button"
              href={'/paket'}
              class="flex justify-center text-white bg-orange-400 hover:bg-orange-500 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
            >
              HARGA WEB
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
