import AdminLayout from "../layouts";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { BASE_URL } from '../../../components/layoutsAdmin/apiConfig';

export default function Add() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    isi: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData; 
      formDataToSend.append("isi", formData.isi);
   
      const response = await axios.post(`${BASE_URL}/api/keterangan/`, formDataToSend, {
        headers: {
            "Content-Type": "application/json",
        }
      });

      if (response.status == 201) {
        // tambahkan logika lainnya sesuai kebutuhan, seperti mereset form atau menampilkan pesan sukses
        router.push("/admin/keterangan");
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
      <div className="flex items-center justify-center p-12 ">
        <div className="mx-auto w-full max-w-[550px] bg-white rounded-lg  lg:-mt-48">
          <Link href={"/admin/keterangan"} className="relative ml-32 lg:ml-60 ">
            <div className="absolute flex items-center gap-2 px-8 py-2 font-semibold text-white rounded-lg cursor-pointer m text-end bg-gradient-to-r from-indigo-400 to-gray-600 lg:left-24 left-4 top-10 text-md">
              <i className="fas fa-arrow-left"></i>
              <span>Kembali</span>
            </div>
          </Link>
          <form className="py-6 bg-white px-9" onSubmit={handleSubmit}>
            <div className="mt-4 mb-5">
              <label
                htmlFor="isi"
                className="mb-3 block text-base font-medium text-[#07074D]"
              >
                Isi
              </label>
              <input
                type="text"
                name="isi"
                id="isi"
                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                value={formData.isi}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <button className="w-full px-8 py-3 text-base font-semibold text-center text-white rounded-md outline-none hover:shadow-form bg-gradient-to-r from-indigo-400 to-gray-600 hover:bg-indigo-400 focus:bg-indigo-400">
                Simpan
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
