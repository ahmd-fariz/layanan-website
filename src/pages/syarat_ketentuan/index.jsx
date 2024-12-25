import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";
import LoadingLayanan from "@/components/elements/LoadingLayanan";
import { IoCallOutline } from "react-icons/io5";
import { BASE_URL } from "../../components/layoutsAdmin/apiConfig";

export default function Layanan() {
  const [syarat, setSyarat] = useState([]);
  // const [included, setIncluded] = useState([]); // Tambahkan state untuk included
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const pageSize = 10; // Jumlah item per halaman

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/syaratketentuan`);
        setSyarat(response.data);
      } catch (error) {
        console.error("Error fetching data kontak:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return (
      <div className="text-center text-red-500">Error: {error.message}</div>
    );
  }

  // Menampilkan Skeleton saat loading atau error fetching data
  if (loading) {
    return (
      <>
        <div className="relative flex flex-col items-center justify-center lg:px-28">
          <div className="grid grid-cols-1 gap-8 mt-8 md:grid-cols-2 xl:grid-cols-2">
            {Array.from({ length: pageSize }).map((_, index) => (
              <LoadingLayanan key={index} />
            ))}
          </div>
        </div>
      </>
    );
  }

  return (
    <section className="relative -mt-5 bg-transparent">
      <div className="flex flex-col w-full mx-auto sm:px-10 md:px-12 lg:px-28 lg:flex-row lg:gap-12 bg-blue-500 py-24 lg:py-32">
        <div className="relative text-white flex flex-col max-w-3xl mx-auto lg:text-left xl:py-8 lg:items-center lg:max-w-none lg:mx-0 lg:flex-1 lg:w-1/ lg:px-48">
          <h1 className="text-3xl text-center font-semibold leading-tight lg:text-4xl">
            Syarat & Ketentuan
          </h1>
        </div>
      </div>

      <div className="grid grid-5 justify-start pt-9 lg:mx-28 md:mx-12">
        {syarat.map((item, index) => ( // Menambahkan nomor urut
          <div className="flex ps-8" key={index}>
            <span className="ps-2 text-center text-lg py-1 text-sm">
              {index + 1}. {item.nama_syarat_ketentuan} {/* Menampilkan nomor */}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
