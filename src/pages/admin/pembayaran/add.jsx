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
    nama_rek: "",
    no_rek: "",
    atas_nama: "",
    image_bank: null,
    url_image_bank: null,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("nama_rek", formData.nama_rek);
      formDataToSend.append("no_rek", formData.no_rek);
      formDataToSend.append("atas_nama", formData.atas_nama);
      formDataToSend.append("image_bank", formData.image_bank);
      const response = await axios.post(
        `${BASE_URL}/api/bank`,
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
        router.push("/admin/pembayaran");
      } else {
        console.error("Gagal mengirim data.", response);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image_bank") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: files[0],
        // mengambil file pertama dari daftar file yang dipilih
        url_image_bank: URL.createObjectURL(files[0]),
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
      <Head><title>Tambah Pembayaran</title></Head>
      <div className="flex items-center justify-center p-12">
        <div className="mx-auto w-full max-w-[700px] bg-white rounded-lg lg:-mt-40">
          <div className="flex justify-end pt-4 px-4">
            <Link
              href={"/admin/pembayaran"}
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
                htmlFor="nama_rek"
                className="mb-3 block text-base font-medium text-[#07074D]"
              >
                Nama Rekening
              </label>
              <input
                type="text"
                name="nama_rek"
                id="nama_rek"
                className="w-full rounded-md border-2 border-indigo-300 bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                value={formData.nama_rek}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="mb-6 ">
              {" "}
              <label className="mb-5 block text-base font-semibold text-[#07074D]">
                Gambar
              </label>
              <div className="mb-8">
                <input
                  type="file"
                  name="image_bank"
                  id="image_bank"
                  htmlFor="image_bank"
                  className="w-full  rounded-md border-2 border-indigo-300 bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="mb-5">
              <label
                htmlFor="no_rek"
                className="mb-3 block text-base font-medium text-[#07074D]"
              >
                No Rekening
              </label>
              <input
                type="text"
                name="no_rek"
                id="no_rek"
                className="w-full rounded-md border-2 border-indigo-300 bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                value={formData.no_rek}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-5">
              <label
                htmlFor="atas_nama"
                className="mb-3 block text-base font-medium text-[#07074D]"
              >
                Atas Nama
              </label>
              <input
                type="text"
                name="atas_nama"
                id="atas_nama"
                className="w-full rounded-md border-2 border-indigo-300 bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                value={formData.atas_nama}
                onChange={handleInputChange}
                required
              />
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
