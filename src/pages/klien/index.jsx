import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";
import LoadingLayanan from "@/components/elements/LoadingLayanan";
import { IoCallOutline } from "react-icons/io5";
import { BASE_URL } from '../../components/layoutsAdmin/apiConfig';

export default function Layanan() {
  const [klien, setKlien] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const pageSize = 10; // Jumlah item per halaman

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/klien/`);
        setKlien(response.data.data);
      } catch (error) {
        console.error("Error fetching data layanan:", error);
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
            Klien Kami
          </h1>
        </div>
      </div>

      <p className="font-semibold text-center text-lg pt-11 text-gray-600">
        Berikut Ini Adalah Daftar Klien Kami
      </p>
      <p className="font-semibold text-center text-lg pt-11 text-gray-500">
        Total : {klien.length} Klien Aktif
      </p>

      <div className="relative flex flex-col items-center justify-center lg:px-28">
        <div className="grid grid-cols-1 gap-8 mt-8 md:grid-cols-2 xl:grid-cols-2">
          {klien.map((item, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-2">
                {item.kategori_klien
                  ? item.kategori_klien.nama_kategori_klien
                  : "Kategori tidak ditemukan"}
              </h2>
              <img
                src={item.logo_klien}
                alt={item["logo-klien"]}
                className="mb-4"
              />
              <p className="text-gray-500">
                Nama Paket: {item.paket.nama_paket}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
