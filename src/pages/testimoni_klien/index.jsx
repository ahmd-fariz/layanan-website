import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";
import LoadingLayanan from "@/components/elements/LoadingLayanan";
import { IoCallOutline } from "react-icons/io5";
import { BASE_URL } from '../../components/layoutsAdmin/apiConfig';

export default function Layanan() {
  const [testimoni, setTestimoni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10; // Jumlah item per halaman

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          // `https://api.ngurusizin.online/api/layanan?page=${currentPage}&pageSize=${pageSize}`
          `${BASE_URL}/api/testimoni/`
        );
        setTestimoni(response.data.data);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("Error fetching data layanan:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage]);

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

  // Menghitung angka pertama yang akan ditampilkan dalam navigasi paginasi
  const firstPage = Math.max(1, currentPage - 4);

  return (
    <section className="relative -mt-5 bg-transparent">
      <div className="flex flex-col w-full mx-auto sm:px-10 md:px-12 lg:px-28 lg:flex-row lg:gap-12 bg-blue-500 py-24 lg:py-32">
        <div className="relative text-white flex flex-col max-w-3xl mx-auto lg:text-left xl:py-8 lg:items-center lg:max-w-none lg:mx-0 lg:flex-1 lg:w-1/ lg:px-48">
          <h1 className="text-3xl text-center font-semibold leading-tight lg:text-4xl">
            Testimoni Klien
          </h1>
        </div>
      </div>

      <p className="font-bold text-center text-lg pt-6 text-gray-600">
        TESTIMONI LEWAT WHATSAPP
      </p>

      <div className="grid grid-cols-1 gap-8 mt-8 px-8 md:grid-cols-3 xl:grid-cols-2">
        {testimoni.map((item) =>
          item.jenis_testimoni === "wa" ? (
            <div
              key={item.id}
              className="p-4 bg-white rounded-lg shadow-xl text-center"
            >
              <p className="text-lg font-semibold">{item.judul_testimoni}</p>
              <p className="text-gray-600">{item.deskripsi_testimoni}</p>
              <img
                src={item.url_gambar}
                alt={item.gambar_testimoni}
                className="object-scale-down w-24 h-24 rounded-2xl mt-2 mx-auto"
              />
            </div>
          ) : null
        )}
      </div>

      <p className="font-bold text-center text-lg pt-6 text-gray-600">
        TESTIMONI LEWAT EMAIL
      </p>

      <div className="grid grid-cols-1 gap-8 px-8 mt-8 md:grid-cols-2 xl:grid-cols-2">
        {testimoni.map((item) =>
          item.jenis_testimoni === "email" ? (
            <div
              key={item.id}
              className="p-4 bg-white rounded-lg shadow-md text-center"
            >
              <p className="text-lg font-semibold">{item.judul_testimoni}</p>
              <p className="text-gray-600">{item.deskripsi_testimoni}</p>
              <img
                src={item.url_gambar}
                alt={item.gambar_testimoni}
                className="object-scale-down w-24 h-24 rounded-2xl mt-2 mx-auto"
              />
            </div>
          ) : null
        )}
      </div>
    </section>
  );
}
