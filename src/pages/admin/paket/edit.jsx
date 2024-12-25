import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import AdminLayout from "../layouts";
import axios from "axios";
import Head from "next/head";
import { BASE_URL } from '../../../components/layoutsAdmin/apiConfig';

export default function Edit() {
  const router = useRouter();
  const { id } = router.query;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize formData state with empty strings for text inputs and null for file input
  // Inisialisasi state formData dengan nilai default jika tidak ada data sebelumnya
  const [formData, setFormData] = useState({
    nama_paket: "",
    harga: "",
    jumlah_pilihan_desain: "",
    status_website: "",
    kategori_website: "",
  });

  const [kategoriWebsite, setKategoriWebsite] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseId = await axios.get(
          `${BASE_URL}/api/paket/${id}`
        );

        const data = responseId.data;
        console.log("Data:", data);
        // Log the data object

        // Update formData state with data from the API response
        setFormData((prevData) => ({
          ...prevData,
          nama_paket: data.nama_paket || "",
          harga: data.harga || "",
          jumlah_pilihan_desain: data.jumlah_pilihan_desain || "0",
          status_website: data.status_website || "",
          kategori_website: data.kategori_website_id || "",
        }));
      } catch (error) {
        console.error("Error fetching data layanan:", error);
        setError(error);
      } finally {
        setLoading(false);
      }

      try {
        const response = await axios.get(`${BASE_URL}/api/kategoriWebsite`);
        setKategoriWebsite(response.data);
      } catch (error) {
        console.error("Error fetching data paket:", error);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  // Handle input change function
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    // Update formData state based on input name
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "gambar" ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("nama_paket", formData.nama_paket);
      formDataToSend.append("harga", formData.harga);
      formDataToSend.append(
        "jumlah_pilihan_desain",
        formData.jumlah_pilihan_desain
      );
      formDataToSend.append("status_website", formData.status_website);
      formDataToSend.append("kategori_website_id", formData.kategori_website);

      // // Jika ada gambar baru, tambahkan ke formDataToSend
      // if (formData.gambar) {
      //   formDataToSend.append("gambar", formData.gambar);
      // }

      const response = await axios.put(
        `${BASE_URL}/api/paket/${id}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status == 200) {
        router.push("/admin/paket");
      } else {
        console.error("Gagal mengirim data.", response);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <Head>
        <title>Edit Paket</title>
      </Head>

      <AdminLayout>
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
                  className="w-full rounded-md border-2 border-indigo-300 bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
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
                  className="w-full rounded-md border-2 border-indigo-300 bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
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
                    className="w-full rounded-md border-2 border-indigo-300 bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
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
                    className="block w-full px-4 py-3 text-base text-gray-900 bg-white border-2 border-indigo-300 rounded-lg shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150 ease-in-out"
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
                    name="kategori_website" // Ubah dari kategori_website_id ke kategori_website
                    id="kategori_website_id"
                    className="block w-full px-4 py-3 text-base text-gray-900 bg-white border-2 border-indigo-300 rounded-lg shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150 ease-in-out"
                    value={formData.kategori_website}
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
