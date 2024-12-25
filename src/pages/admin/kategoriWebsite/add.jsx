import AdminLayout from "../layouts";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import Head from "next/head";
import { BASE_URL } from '../../../components/layoutsAdmin/apiConfig';

export default function Add() {
  const router = useRouter();
  const { id } = router.query;

  const [formData, setFormData] = useState({
    deskripsi_kategori: "",
    nama_kategori: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("nama_kategori", formData.nama_kategori);
      formDataToSend.append("deskripsi_kategori", formData.deskripsi_kategori);

      const response = await axios.post(
        `${BASE_URL}/api/kategoriWebsite`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status == 201) {
        router.push("/admin/kategoriWebsite");
      } else {
        console.error("Gagal mengirim data.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <AdminLayout>
      <Head><title>Tambah Kategori Website</title></Head>
      <div className="flex items-center justify-center p-12">
        <div className="mx-auto w-full max-w-[700px] bg-white rounded-lg lg:-mt-40">
          <div className="flex justify-end pt-4 px-4">
            <Link
              href={"/admin/kategoriWebsite"}
              className="relative"
            >
              <div className="flex items-center gap-2 px-8 py-2 font-semibold text-white rounded-lg cursor-pointer text-end bg-orange-400">
                <i className="fas fa-arrow-left"></i>
                <span>Kembali</span>
              </div>
            </Link>
          </div>

          <form className="bg-white px-9" onSubmit={handleSubmit}>
            <div className="mt-4 mb-5">
              <label
                htmlFor="nama"
                className="mb-3 block text-base font-medium text-[#07074D]"
              >
                Nama
              </label>
              <input
                type="text"
                name="nama_kategori"
                id="nama_kategori"
                className="w-full rounded-md border-2 border-indigo-300 bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                value={formData.nama_kategori}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="mb-5">
              <label
                htmlFor="deskripsi_kategori"
                className="mb-3 block text-base font-medium text-[#07074D]"
              >
                Deskripsi Kategori
              </label>
              <textarea
                type="text"
                name="deskripsi_kategori"
                id="deskripsi_kategori"
                className="w-full rounded-md border-2 border-indigo-300 bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                value={formData.deskripsi_kategori}
                onChange={handleInputChange}
                required
              ></textarea>
            </div>

            <div>
              <button className="w-full px-8 py-3 text-base font-semibold text-center text-white rounded-md outline-none hover:shadow-form bg-blue-400 hover:bg-indigo-600 focus:bg-indigo-400">
                Simpan
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
