import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Link from "next/link";
import { BASE_URL } from "../../../components/layoutsAdmin/apiConfig";

export default function Layanan() {
  const [contohDesain, setContohDesain] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { id } = router.query;
  const [paket, setPaket] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [desainResponse, paketResponse] = await Promise.all([
          axios.get(`${BASE_URL}/api/contohDesain`),
          axios.get(`${BASE_URL}/api/paket/${id}`),
        ]);

        setContohDesain(desainResponse.data);
        setPaket(paketResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  // Filter data menjadi dua: satu untuk link dan satu lagi untuk gambar
  const links = contohDesain.filter((item) => !item.is_gambar);
  const images = contohDesain.filter((item) => item.is_gambar);

  return (
    <section className="relative -mt-5 bg-transparent">
      <div className="flex flex-col w-full mx-auto sm:px-10 md:px-12 lg:px-28 lg:flex-row lg:gap-12 bg-blue-500 py-24 lg:py-32">
        <div className="relative text-white flex flex-col max-w-3xl mx-auto lg:text-left xl:py-8 lg:items-center lg:max-w-none lg:mx-0 lg:flex-1 lg:w-1/ lg:px-48">
          <h1 className="text-3xl text-center font-semibold leading-tight lg:text-4xl">
            {paket.nama_paket}
          </h1>
        </div>
      </div>

      <p className="font-semibold text-center text-4xl pt-11 text-gray-600">
        Contoh Desain
      </p>

      <div className="relative flex flex-col pt-5">
        <div className="grid grid-cols-1 gap-x-auto mt-8 lg:grid-cols-3">
          {links.map((item) => (
            <li className="ps-8 pt-10" key={item.id}>
              <a href={item.link_contoh_desain} className="text-blue-500">
                {item.link_contoh_desain}
              </a>{" "}
              ( {item.deskripsi} )
            </li>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-x-32 mt-8 lg:grid-cols-3">
          {images.map((item) => (
            <div className="ps-8 pt-10" key={item.id}>
              <img
                src={item.link_contoh_desain}
                alt={item.deskripsi}
                className="w-52 h-58 transition-transform duration-300 transform hover:scale-105"
              />
              ( {item.deskripsi} )
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
