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
    link_contoh_desain: "",
    gambar_link_contoh_desain: null,
    is_gambar: "",
    deskripsi: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("link_contoh_desain", formData.link_contoh_desain);
      formDataToSend.append("is_gambar", formData.is_gambar);

      if (formData.is_gambar) {
        formDataToSend.append(
          "gambar_link_contoh_desain",
          formData.gambar_link_contoh_desain
        );
      }

      formDataToSend.append("deskripsi", formData.deskripsi);

      const response = await axios.post(
        `${BASE_URL}/api/contohdesain`,
        formDataToSend,
        {
          headers: {
            "Content-Type": formData.is_gambar
              ? "multipart/form-data"
              : "application/json",
          },
        }
      );

      if (response.status == 201) {
        showToastMessage();
        router.push("/admin/contoh_desain");
      } else {
        console.error("Gagal mengirim data", response);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };


  const handleInputChange = ({ target: { name, value, files } }) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "gambar_link_contoh_desain" ? files[0] : value,
      ...(name === "gambar_link_contoh_desain" && {
        gambarUrl: URL.createObjectURL(files[0]),
      }),
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
        <title>Tambah Contoh Desain</title>
      </Head>
      <div className="flex items-center justify-center p-12">
        <div className="mx-auto w-full max-w-[700px] bg-white rounded-lg lg:-mt-40">
          <div className="flex justify-end pt-4 px-4">
            <Link
              href={"/admin/contoh_desain"}
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
                htmlFor="link_contoh_desain"
                className="mb-3 block text-base font-medium text-[#07074D]"
              >
                Link Contoh Desain
              </label>
              <div className="mb-8">
                <input
                  type="text"
                  name="link_contoh_desain"
                  id="link_contoh_desain"
                  className="w-full rounded-md border-2 border-blue-300 bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                  value={formData.link_contoh_desain}
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
                    name="gambar_link_contoh_desain"
                    id="gambar_link_contoh_desain"
                    htmlFor="gambar_link_contoh_desain"
                    className={`w-full rounded-md border-2 border-blue-300 bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md`}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
            <div className="mt-4 mb-5">
              <label
                htmlFor="nama_rek"
                className="mb-3 block text-base font-medium text-[#07074D]"
              >
                Is Gambar
              </label>
              <select
                name="is_gambar"
                id="is_gambar"
                className="w-full rounded-md border-2 border-blue-300 bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                value={formData.is_gambar}
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

            <div className="mb-5">
              <label
                htmlFor="no_rek"
                className="mb-3 block text-base font-medium text-[#07074D]"
              >
                Deskripsi
              </label>
              <input
                type="text"
                name="deskripsi"
                id="deskirpsi"
                className="w-full rounded-md border-2 border-blue-300 bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                value={formData.deskripsi}
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
