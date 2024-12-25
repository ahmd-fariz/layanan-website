import AdminLayout from "../layouts";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Head from "next/head";
import { BASE_URL } from "../../../components/layoutsAdmin/apiConfig";

export default function Add() {
  const router = useRouter();
  const { id } = router.query;
  const [formData, setFormData] = useState({
    harga: "",
    nama_paket: "",
    jumlah_pilihan_desain: "",
    status_website: "",
    kategori_website_id: "",
  });

  const [kategoriWebsite, setKategoriWebsite] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/kategoriWebsite`);
      console.log(response);
      setKategoriWebsite(response.data);
    } catch (error) {
      console.error("Error fetching data paket:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("harga", formData.harga);
      formDataToSend.append("nama_paket", formData.nama_paket);
      formDataToSend.append(
        "jumlah_pilihan_desain",
        formData.jumlah_pilihan_desain
      );
      formDataToSend.append("status_website", formData.status_website);
      formDataToSend.append(
        "kategori_website_id",
        formData.kategori_website_id
      );

      console.log("id", formData.kategori_website_id);
      console.log("id", formData.status_website);

      const response = await axios.post(
        `${BASE_URL}/api/paket`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status == 201) {
        showToastMessage();
        router.push("/admin/paket");
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
    <>
      <Head>
        <title>Tambah Paket</title>
      </Head>

      <AdminLayout>
        <ToastContainer />
        <div className="flex items-center justify-center p-12">
          <div className="mx-auto w-full max-w-[700px] bg-white rounded-lg lg:-mt-40">
            <div className="flex justify-end pt-4 px-4">
              <Link href={"/admin/paket"} className="relative">
                <div className="flex items-center gap-2 px-8 py-2 font-semibold text-white rounded-lg cursor-pointer text-end bg-orange-400">
                  <i className="fas fa-arrow-left"></i>
                  <span>Kembali</span>
                </div>
              </Link>
            </div>
            <form className="bg-white px-9" onSubmit={handleSubmit}>
              <div className="mb-5">
                <label
                  htmlFor="nama_paket"
                  className="mb-3 block text-base font-medium text-[#07074D]"
                >
                  Nama Paket
                </label>
                <input
                  type="text"
                  name="nama_paket"
                  id="nama_paket"
                  className="w-full rounded-md border-2 border-bl-300 bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                  value={formData.nama_paket}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-5">
                <label
                  htmlFor="harga"
                  className="mb-3 block text-base font-medium text-[#07074D]"
                >
                  Harga
                </label>
                <input
                  type="text"
                  name="harga"
                  id="harga"
                  className="w-full rounded-md border-2 border-bl-300 bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                  value={formData.harga}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-6 ">
                <label className="mb-5 block text-base font-semibold text-[#07074D]">
                  Jumlah Pilihan Desain
                </label>
                <div className="mb-8">
                  <input
                    type="number"
                    name="jumlah_pilihan_desain"
                    id="jumlah_pilihan_desain"
                    className="w-full rounded-md border-2 border-bl-300 bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                    value={formData.jumlah_pilihan_desain}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="mb-8">
                <label
                  htmlFor="status_website"
                  className="mb-3 block font-semibold text-black"
                >
                  Status Website
                </label>
                <div className="relative">
                  <select
                    name="status_website"
                    id="status_website"
                    className="block w-full px-4 py-3 text-base text-gray-900 bg-white border-2 border-bl-300 rounded-lg shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150 ease-in-out"
                    value={formData.status_website}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="" disabled hidden>
                      Pilih Status Website
                    </option>
                    <option value="Siap Di Pakai">Siap Di Pakai</option>
                    <option value="Tersedia">Tersedia</option>
                    <option value="Tidak Tersedia">Tidak Tersedia</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-indigo-600">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                      <path
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                        fillRule="evenodd"
                      ></path>
                    </svg>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <label
                  htmlFor="kategori_website_id"
                  className="mb-3 block font-semibold text-black"
                >
                  Kategori Website
                </label>
                <div className="relative">
                  <select
                    name="kategori_website_id"
                    id="kategori_website_id"
                    className="block w-full px-4 py-3 text-base text-gray-900 bg-white border-2 border-bl-300 rounded-lg shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150 ease-in-out"
                    value={formData.kategori_website_id}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="" disabled hidden>
                      Pilih Kategori Website
                    </option>
                    {kategoriWebsite.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.nama_kategori}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-indigo-600">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                      <path
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                        fillRule="evenodd"
                      ></path>
                    </svg>
                  </div>
                </div>
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
    </>
  );
}
