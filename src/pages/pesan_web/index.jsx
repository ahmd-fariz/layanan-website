import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaWhatsapp } from "react-icons/fa";
import { IoCallOutline } from "react-icons/io5";
import LoadingLayanan from "@/components/elements/LoadingLayanan";
import { BASE_URL } from '../../components/layoutsAdmin/apiConfig';

export default function Layanan() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [setting, setSetting] = useState(""); // State untuk menyimpan nomor WA

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/setting`
        );
        setSetting(response.data.data[0]);
      } catch (error) {
        console.error("Error fetching data layanan:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  if (loading) {
    return (
      <div className="relative flex flex-col items-center justify-center lg:px-28">
        <LoadingLayanan />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500">Error: {error.message}</div>
    );
  }

  const buttonWA = () => {
    window.location.href = `https://wa.me/62${ setting.wa }`;
  };
  const buttonTelepon = () => {
    window.location.href = `tel:0${ setting.wa }`;
  };

  return (
    <section className="relative -mt-5 bg-transparent">
      <div className="flex flex-col w-full mx-auto sm:px-10 md:px-12 lg:px-28 lg:flex-row lg:gap-12 bg-blue-500 py-24 lg:py-32">
        <div className="relative text-white flex flex-col max-w-3xl mx-auto lg:text-left xl:py-8 lg:items-center lg:max-w-none lg:mx-0 lg:flex-1 lg:w-1/ lg:px-48">
          <h1 className="text-3xl text-center font-bold leading-tight lg:text-5xl">
            Cara Pesan Web
          </h1>
        </div>
      </div>

      <p className="text-center font-semibold text-4xl pt-16">Whatsapp</p>
      <p className="text-center pt-4">Klik Untuk WA:</p>
      <div className="flex justify-center py-5">
        <button
          onClick={buttonWA}
          className="bg-green-500 py-3 px-5 flex justify-center rounded-lg text-white"
        >
          <FaWhatsapp className="me-3 mt-0" size={22} />
          <p className="me-2">0{ setting.wa }</p>
        </button>
      </div>
      <p className="text-center font-semibold text-4xl pt-16">Telepon</p>
      <p className="text-center pt-4">Klik Untuk Telpon:</p>
      <div className="flex justify-center py-5">
        <button
          onClick={buttonTelepon}
          className="bg-green-500 py-3 px-5 flex justify-center rounded-lg text-white"
        >
          <IoCallOutline className="me-3 mt-0" size={22} />
          <p className="me-2">0{ setting.telp }</p>
        </button>
      </div>
    </section>
  );
}