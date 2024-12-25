import AdminLayout from "../layouts";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Head from "next/head";
import { BASE_URL } from '../../../components/layoutsAdmin/apiConfig';

export default function Add() {
  const router = useRouter();
  const { id } = router.query;
  const [formData, setFormData] = useState({
    nama_syarat_ketentuan: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      formDataToSend.append(
        "nama_syarat_ketentuan",
        formData.nama_syarat_ketentuan
      );

      const response = await axios.post(
        `${BASE_URL}/api/syaratketentuan`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status == 201) {
        showToastMessage();
        router.push("/admin/syarat_ketentuan");
      } else {
        console.error("Gagal mengirim data", response);
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

  const showToastMessage = () => {
    toast.success("Item berhasil ditambahkan", {
      position: "top-right",
    });
  };

  return (
    <AdminLayout>
      <Head>
        <title>Tambah Syarat & Ketentuan</title>
      </Head>
      <ToastContainer />
      <div className="flex items-center justify-center p-12 ">
        <div className="mx-auto w-full max-w-[700px] bg-white rounded-lg  lg:-mt-40">
        <div className="relative py-2">
            <Link
              href={"/admin/syarat_ketentuan"}
              className="absolute right-4 top-10" // Mengubah posisi ke kanan
            >
              <div className="flex items-center gap-2 px-8 py-2 font-semibold text-white rounded-lg cursor-pointer m text-end bg-orange-400 hover:bg-orange-500 text-md">
                <i className="fas fa-arrow-left"></i>
                <span>Kembali</span>
              </div>
            </Link>
          </div>
          <form className="py-20 bg-white px-9" onSubmit={handleSubmit}>
            <div className="mb-5">
              <label
                htmlFor="nama_paket"
                className="mb-3 block text-base font-medium text-[#07074D]"
              >
                Nama Syarat & Ketentuan
              </label>
              <input
                type="text"
                name="nama_syarat_ketentuan"
                id="nama_syarat_ketentuan"
                className="w-full rounded-md border-2 border-indigo-300 bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                value={formData.nama_syarat_ketentuan}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <button className="w-full px-8 py-3 text-base font-semibold text-center text-white rounded-md outline-none hover:shadow-form bg-blue-400 hover:bg-blue-500">
                Simpan
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
