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
    jenis_testimoni: "",
    judul_testimoni: "",
    deskripsi_testimoni: "",
    is_publish: "",
    gambar_testimoni: null,
    url_gambar: null,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("jenis_testimoni", formData.jenis_testimoni);
      formDataToSend.append("judul_testimoni", formData.judul_testimoni);
      formDataToSend.append("is_publish", formData.is_publish);

      formDataToSend.append(
        "deskripsi_testimoni",
        formData.deskripsi_testimoni
      );

      formDataToSend.append("gambar_testimoni", formData.gambar_testimoni);

      const response = await axios.post(
        `${BASE_URL}/api/testimoni/`,
          formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status == 201) {
        // console.log("Data berhasil di tambahkan!");
        // tambahkan logika lainnya sesuai kebutuhan, seperti mereset form atau menampilkan pesan sukses
        router.push("/admin/testimoni");
      } else {
        console.error("Gagal mengirim data.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "gambar_testimoni") {
      // Mengganti 'file' menjadi 'gambar'
      setFormData((prevData) => ({
        ...prevData,
        [name]: files[0],
        // mengambil file pertama dari daftar file yang dipilih
        url_gambar: URL.createObjectURL(files[0]),
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };
  return (
    <AdminLayout>
      <Head>
        <title>Tambah Testimoni</title>
      </Head>
      <div className="flex items-center justify-center p-12">
        <div className="mx-auto w-full max-w-[700px] bg-white rounded-lg lg:-mt-40">
          <div className="flex justify-end pt-4 px-4">
            <Link
              href={"/admin/testimoni"}
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
                htmlFor="jenis_testimoni"
                className="mb-3 block text-base font-medium text-[#07074D]"
              >
                Jenis Testimoni
              </label>
              <select
                name="jenis_testimoni"
                id="jenis_testimoni"
                className="w-full rounded-md border-2 border-indigo-300 bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                value={formData.jenis_testimoni}
                onChange={handleInputChange}
                required
              >
                <option value="">Pilih Jenis Testimoni</option>
                <option value="Wa">Wa</option>
                <option value="Email">Email</option>
              </select>
            </div>

            <div className="mb-6 ">
              {" "}
              <label className="mb-5 block text-base font-semibold text-[#07074D]">
                Gambar Testimoni
              </label>
              <div className="mb-8">
                <input
                  type="file"
                  name="gambar_testimoni"
                  id="gambar_testimoni"
                  htmlFor="gambar_testimoni"
                  className="w-full rounded-md border-2 border-indigo-300 bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="mb-5">
              <label
                htmlFor="judul_testimoni"
                className="mb-3 block text-base font-medium text-[#07074D]"
              >
                Judul Testimoni
              </label>
              <input
                type="text"
                name="judul_testimoni"
                id="judul_testimoni"
                className="w-full rounded-md border-2 border-indigo-300 bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                value={formData.judul_testimoni}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="mb-5">
              <label
                htmlFor="deskripsi_testimoni"
                className="mb-3 block text-base font-medium text-[#07074D]"
              >
                Deskripsi Testimoni
              </label>
              <textarea
                type="text"
                name="deskripsi_testimoni"
                id="deskripsi_testimoni"
                className="w-full rounded-md border-2 border-indigo-300 bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                value={formData.deskripsi_testimoni}
                onChange={handleInputChange}
                required
              ></textarea>
            </div>

            <div className="mt-4 mb-5">
              <label
                htmlFor="nama_rek"
                className="mb-3 block text-base font-medium text-[#07074D]"
              >
                Is Publish
              </label>
              <select
                name="is_publish"
                id="is_publish"
                className="w-full rounded-md border-2 border-indigo-300 bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                value={formData.is_publish}
                onChange={handleInputChange}
                required
              >
                <option value="" hidden>
                  Pilih Ya / Tidak
                </option>
                <option value="1">Ya</option>
                <option value="0">Tidak</option>
              </select>
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