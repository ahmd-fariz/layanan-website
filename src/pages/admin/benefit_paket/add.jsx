import AdminLayout from "../layouts";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import Head from "next/head";
import { BASE_URL } from "../../../components/layoutsAdmin/apiConfig";

export default function Add() {
  const router = useRouter();

  const [paket, setPaket] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/paket`);

      setPaket(response.data.data);
    } catch (error) {
      console.error("Error fetching data paket:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const [formData, setFormData] = useState({
    nama_benefit: "",
    paket_id: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(formData.nama_benefit);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("nama_benefit", formData.nama_benefit);
      formDataToSend.append("paket_id", formData.paket_id);

      const response = await axios.post(
        `${BASE_URL}/api/benefitpaket/`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // if (response.status == 201) {
      //   showToastMessage();
      //   // console.log("Data berhasil di tambahkan!");
      //   // tambahkan logika lainnya sesuai kebutuhan, seperti mereset form atau menampilkan pesan sukses
      router.push("/admin/benefit_paket");
      // } else {
      //   console.error("Gagal mengirim data.");
      // }
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
        <title>Tambah Benefit Paket</title>
      </Head>
      <AdminLayout>
        <div className="flex items-center justify-center p-12">
          <div className="mx-auto w-full max-w-[700px] bg-white rounded-lg lg:-mt-40">
            <div className="flex justify-end pt-4 px-4">
              <Link href={"/admin/benefit_paket"} className="relative">
                <div className="flex items-center gap-2 px-8 py-2 font-semibold text-white rounded-lg cursor-pointer text-end bg-orange-400">
                  <i className="fas fa-arrow-left"></i>
                  <span>Kembali</span>
                </div>
              </Link>
            </div>

            <form className="bg-white px-9" onSubmit={handleSubmit}>
              <div className="mt-4 mb-5">
                <label
                  htmlFor="benefit_paket"
                  className="mb-3 block text-base font-medium text-[#07074D]"
                >
                  Benefit
                </label>
                <input
                  type="text"
                  name="nama_benefit"
                  id="nama_benefit"
                  className="w-full rounded-md border-2 border-blue-300 bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                  value={formData.nama_benefit}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="mb-6">
                <label
                  htmlFor="paket_id"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Paket
                </label>
                <div className="relative">
                  <select
                    name="paket_id"
                    id="paket_id"
                    className="block w-full appearance-none rounded-lg border-2 border-blue-300 bg-white px-4 py-2 pr-8 text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={formData.paket_id}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="" disabled hidden>
                      Pilih Paket
                    </option>
                    {paket.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item["nama_paket"]}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg
                      className="h-4 w-4 fill-current"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div>
                <button className="w-full px-8 py-3 text-base font-semibold text-center text-white rounded-md outline-none hover:shadow-form bg-blue-400 hover:bg-indigo-600 focus:bg-indigo-500">
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