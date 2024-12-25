import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React, { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import Link from "next/link";
import axios from "axios";
import { BASE_URL } from "./layoutsAdmin/apiConfig";

const Testimoni = () => {
  const [testimoni, setTestimoni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/testimoni`);
        setTestimoni(response.data.data);
      } catch (error) {
        console.error("Error fetching data testimoni:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="py-10">
      <h1 className="font-semibold text-3xl lg:text-3xl text-center text-transparent bg-clip-text bg-gray-900">
        Testimoni
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 justify-items-center gap-5 mt-5 px-5 lg:flex-row lg:px-10 py-6 ">
        {testimoni.map((item) =>
          item.is_publish ? (
            <div
              key={item.id}
              className="w-full h-40 max-w-sm p-6 bg-white border border-gray-400 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
            >
              <div className="flex justify-start">
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 overflow-hidden text-ellipsis">
                  {item.deskripsi_testimoni}
                </p>
              </div>
              <div className="flex items-center">
                <img
                  src={item.url_gambar}
                  alt=""
                  className="rounded-full w-16 h-16"
                />
                <div className="ml-4">
                  <p className="font-semibold">{item.judul_testimoni}</p>
                  <div className="flex">
                    <FaStar className="text-yellow-500 ml-1" />
                    <FaStar className="text-yellow-500 ml-1" />
                    <FaStar className="text-yellow-500 ml-1" />
                    <FaStar className="text-yellow-500 ml-1" />
                    <FaStar className="text-yellow-500 ml-1" />
                  </div>
                </div>
              </div>
            </div>
          ) : null
        )}
      </div>
      <div className="flex justify-center">
        <Link
          href={"/testimoni_klien"}
          type="submit"
          className="block px-4 py-3 mt-6 font-semibold text-center text-white rounded-full w-52 bg-blue-400 hover:bg-blue-900"
        >
          Lihat Semua Testimoni
        </Link>
      </div>
    </div>
  );
};

export default Testimoni;
