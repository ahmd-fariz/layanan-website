import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";
import LoadingLayanan from "@/components/elements/LoadingLayanan";
import { IoCallOutline } from "react-icons/io5";
import { BASE_URL } from '../../components/layoutsAdmin/apiConfig';

export default function Pembayaran() {
  const [pembayaran, setPembayaran] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10; // Jumlah item per halaman

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/bank/`
        );
        if (response.data && Array.isArray(response.data.data)) {
          setPembayaran(response.data.data);
        } else {
          console.error("Unexpected data format:", response.data);
        }
        setTotalPages(response.data.totalPages || 1);
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
            Pembayaran
          </h1>
        </div>
      </div>

      <p className="text-center text-md pt-6 text-gray-600">
        Pembayaran bisa dilakukan ke bank berikut ini :
      </p>
      <div className="px-8 py-4 lg:px-20 lg:py-4">
        {pembayaran.map((item, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-lg mb-4">
            <img
              src={item.url_image_bank}
              alt={item.image_bank}
              className="mb-4 w-32 h-32 object-contain mx-auto aspect-square"
            />
            <h2 className="text-xl font-semibold mb-2 text-center">
              {item.nama_rek}
            </h2>
            <p className="text-gray-500 text-center">
              No. Rekening: {item.no_rek}
            </p>
            <p className="text-gray-500 text-center">
              Atas Nama: {item.atas_nama}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
