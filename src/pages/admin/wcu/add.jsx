import AdminLayout from "../layouts";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import Head from "next/head";
import { BASE_URL } from '../../../components/layoutsAdmin/apiConfig';

export default function Add() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    isi: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(formData.isi);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("isi", formData.isi);

      const response = await axios.post(
        `${BASE_URL}/api/wcu/`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status == 201) {
        // console.log("Data berhasil di tambahkan!");
        // tambahkan logika lainnya sesuai kebutuhan, seperti mereset form atau menampilkan pesan sukses
        router.push("/admin/wcu");
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
      <Head>
        <title>Tambah WCU</title>
      </Head>
      <div className="flex items-center justify-center p-12 ">
        <div className="mx-auto w-full max-w-[700px] bg-white rounded-lg  lg:-mt-40">
        <div className="relative py-3">
            <Link href={"/admin/wcu"} className="absolute right-4 top-10">
              <div className="flex items-center gap-2 px-8 py-2 font-semibold text-white rounded-lg cursor-pointer bg-orange-400 text-md">
                <i className="fas fa-arrow-left"></i>
                <span>Kembali</span>
              </div>
            </Link>
          </div>
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

            {/* <div className="mb-6 ">
              {" "}
              <label className="mb-5 block text-base font-semibold text-[#07074D]">
                Gambar
              </label>
              <div className="mb-8">
                <input
                  type="file"
                  name="gambar"
                  id="gambar"
                  htmlFor="gambar"
                  className="w-full  rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="mb-5">
              <label
                htmlFor="jabatan"
                className="mb-3 block text-base font-medium text-[#07074D]"
              >
                Jabatan
              </label>
              <input
                type="text"
                name="jabatan"
                id="jabatan"
                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                value={formData.jabatan}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="mb-5">
              <label
                htmlFor="testimoni"
                className="mb-3 block text-base font-medium text-[#07074D]"
              >
                Testimoni
              </label>
              <textarea
                type="text"
                name="testimoni"
                id="testimoni"
                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                value={formData.testimoni}
                onChange={handleInputChange}
                required
              ></textarea>
            </div> */}

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
