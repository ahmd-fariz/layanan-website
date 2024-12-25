import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import axios from "axios";
import { BASE_URL } from "./layoutsAdmin/apiConfig";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [setting, setSetting] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fecthDataSetting();
  }, []);

  const fecthDataSetting = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/setting`); 
      setSetting(response.data.data[0]);
    } catch (error) {
      console.error("Error fetching data setting", error);
    }
  };

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="antialiased bg-gray-100 dark-mode:bg-gray-900 mb-5">
      <div className="w-full text-slate-200 bg-blue-500 dark-mode:text-gray-200 dark-mode:bg-gray-800">
        <div className="flex flex-col max-w-screen-xl px-4 mx-auto md:justify-between lg:flex-row lg:px-auto lg:px-auto">
          <div className="flex flex-row items-center justify-between p-4">
            <Link href={"/"} aria-label="Kembali ke Beranda">
              <img
                className="h-14 w-auto mx-auto"
                src={setting.gambar_setting}
                alt="Logo Perusahaan"
              />
            </Link>
            <button
              onClick={toggleNavbar}
              className="rounded-lg lg:hidden "
              aria-label={isOpen ? "Tutup menu" : "Buka menu"}
            >
              <svg fill="currentColor" viewBox="0 0 20 20" className="w-6 h-6">
                {isOpen ? (
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  ></path>
                ) : (
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z"
                  ></path>
                )}
              </svg>
            </button>
          </div>
          <div
            className={`${
              isOpen ? "flex" : "hidden"
            } flex-col flex-grow pb-4 lg:flex lg:mt-4 lg:flex-row lg:justify-end`}
          >
            <Link
              href={"/"}
              className={`nav-link ${
                router.pathname === "/" ? "font-bold text-white underline" : ""
              } px-1 py-2 mt-2 text-sm font-bold bg-transparent rounded-lg md:mt-0 md:ml-4 hover:text-white focus:underline underline-offset-8 focus:text-white focus `}
            >
              HOME
            </Link>
            <Link
              href={"/paket"}
              className={`nav-link ${
                router.pathname === "/paket"
                  ? "font-bold text-white underline"
                  : ""
              } px-1 py-2 mt-2 text-sm font-bold bg-transparent rounded-lg md:mt-0 md:ml-4 hover:text-white focus:underline underline-offset-8 focus:text-white focus `}
            >
              HARGA WEB
            </Link>
            <Link
              href={"/pesan_web"}
              className={`nav-link ${
                router.pathname === "/pesan_web"
                  ? "font-bold text-white underline"
                  : ""
              } px-1 py-2 mt-2 text-sm font-bold bg-transparent rounded-lg md:mt-0 md:ml-4 hover:text-white focus:underline underline-offset-8 focus:text-white focus `}
            >
              CARA PESAN WEB
            </Link>
            <Link
              href={"/klien"}
              className={`nav-link ${
                router.pathname === "/klien"
                  ? "font-bold text-white underline"
                  : ""
              } px-1 py-2 mt-2 text-sm font-bold bg-transparent rounded-lg md:mt-0 md:ml-4 hover:text-white focus:underline underline-offset-8 focus:text-white focus `}
            >
              KLIEN KAMI
            </Link>
            <Link
              href={"/pembayaran"}
              className={`nav-link ${
                router.pathname === "/pembayaran"
                  ? "font-bold text-white underline"
                  : ""
              } px-1 py-2 mt-2 text-sm font-bold bg-transparent rounded-lg md:mt-0 md:ml-4 hover:text-white focus:underline underline-offset-8 focus:text-white focus `}
            >
              PEMBAYARAN
            </Link>
            <Link
              href={"/testimoni_klien"}
              className={`nav-link ${
                router.pathname === "/testimoni_klien"
                  ? "font-bold text-white underline"
                  : ""
              } px-1 py-2 mt-2 text-sm font-bold bg-transparent rounded-lg md:mt-0 md:ml-4 hover:text-white focus:underline underline-offset-8 focus:text-white focus `}
            >
              TESTIMONI KLIEN
            </Link>
            <Link
              href={"/kontak_kami"}
              className={`nav-link ${
                router.pathname === "/kontak_kami"
                  ? "font-bold text-white underline"
                  : ""
              } px-1 py-2 mt-2 text-sm font-bold bg-transparent rounded-lg md:mt-0 md:ml-4 hover:text-white focus:underline underline-offset-8 focus:text-white focus `}
            >
              KONTAK KAMI
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
