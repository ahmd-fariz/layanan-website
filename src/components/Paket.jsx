import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import LoadingLayanan from "./elements/LoadingLayanan";
import styles from "./Layanan.module.css"; // Import CSS module
import { BASE_URL } from "./layoutsAdmin/apiConfig";
import AOS from "aos"; // Tambahkan import AOS
import "aos/dist/aos.css"; // Tambahkan import CSS AOS

export default function Paket() {
  const [paket, setPaket] = useState([]);
  const [benefitPaket, setBenefitPaket] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [paketResponse, benefitResponse] = await Promise.all([
          axios.get(`${BASE_URL}/api/paket`),
          axios.get(`${BASE_URL}/api/benefitPaket`),
        ]);
        setPaket(paketResponse.data.data);
        setBenefitPaket(benefitResponse.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    AOS.init(); // Inisialisasi AOS
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
            {Array.from({ length: 4 }).map((_, index) => (
              <LoadingLayanan key={index} />
            ))}
          </div>
        </div>
      </>
    );
  }

  return (
    <section className="relative -mt-5 bg-transparent">
      <div className="mt-10" data-aos="fade-up" data-aos-duration="800">
        <h1 className="font-extrabold text-3xl lg:text-3xl text-center bg-clip-text text-gray-800">
          Paket dan Harga
        </h1>
      </div>
      <div className="relative flex flex-col items-center px-6 justify-center mx-auto mt-4" data-aos="fade-up" data-aos-duration="800">
        <span className="flex text-center text-gray-500">
          Paket ini menawarkan layanan lengkap dengan harga yang kompetitif.
          Setiap paket dirancang untuk memberikan solusi yang sesuai dengan
          kebutuhan pelanggan, mulai dari layanan dasar hingga yang lebih
          premium, dengan harga yang variatif tergantung pada jenis dan fitur
          yang disertakan.
        </span>
      </div>
      <div className="relative flex flex-col items-center px-6 py-2 justify-center lg:px-24">
        <div className="grid grid-cols-1 gap-8 mt-8 md:grid-cols-3 xl:grid-cols-3 w-full">
          {paket.slice(0, 3).map(
            (
              item // Hanya menampilkan 3 data
            ) => (
              <div
                className={`shadow-2xl rounded-2xl ${styles.paketCard} w-full`}
                key={item.id}
                data-aos="zoom-in"
                data-aos-duration="800"
              >
                <h2 className="flex justify-center font-bold h-16 py-4 bg-green-400 text-xl text-white">
                  {item["nama_paket"]}
                </h2>

                <span className="flex justify-center bg-gray-100 text-center h-16 md:h-auto py-3 md:text-2xl lg:text-3xl text-3xl font-semibold px-auto">
                  Rp {parseFloat(item.harga).toLocaleString("id-ID")}
                </span>

                <span className="bg-gray-100 text-center h-16 py-4 flex justify-center text-lg">
                  {item["status_website"]}
                </span>

                <span className="bg-white text-center md:h-auto my-4 font-semibold flex justify-center text-lg">
                  {item["jumlah_pilihan_desain"]} Pilihan Desain.{" "}
                  <a
                    href={`/contoh_desain/${item.id}`}
                    className="text-blue-500"
                  >
                    Lihat klik disini
                  </a>
                </span>

                {benefitPaket
                  .filter((benefit) => benefit.paket_id === item.id)
                  .map((benefit, index) => {
                    const bgColor =
                      index % 2 === 0 ? "bg-gray-100" : "bg-white";
                    return (
                      <div
                        key={benefit.id}
                        className={`text-center h-auto pb-5 py-4 px-18 lg:flex justify-center text-lg w-full ${bgColor}`}
                      >
                        {benefit.nama_benefit}
                      </div>
                    );
                  })}

                <div className="flex-auto text-center bg-gray-100">
                  <div className="flex justify-center text-sm font-medium pt-4 pb-9">
                    <Link
                      href={`/pesan_web`}
                      className="px-8 py-2 mb-2 tracking-wider text-lg text-white rounded-full shadow-sm md:mb-0 bg-blue-400 hover:bg-blue-900"
                      type="button"
                      aria-label="like"
                    >
                      Beli
                    </Link>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
      <div className="flex justify-center">
        <Link
          href={"/paket"}
          type="submit"
          className="block px-4 py-3 mt-6 font-semibold text-center text-white rounded-lg w-52 bg-blue-400 hover:bg-blue-900"
        >
          Lihat Semua Paket
        </Link>
      </div>
    </section>
  );
}
