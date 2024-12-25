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
    nama_kategori: "", // Set default value to empty string
    deskripsi_kategori: "", // Set default value to empty string
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/kategoriWebsite/${id}`
        );

        const data = response.data;

        setFormData((prevData) => ({
          ...prevData,
          nama_kategori: data.nama_kategori || "",
          deskripsi_kategori: data.deskripsi_kategori || "",
        }));
      } catch (error) {
        console.error("Error fetching data kategori website:", error);
        setError(error);
      } finally {
        setLoading(false);
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
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("nama_kategori", formData.nama_kategori);
      formDataToSend.append("deskripsi_kategori", formData.deskripsi_kategori);

      // Jika ada gambar baru, tambahkan ke formDataToSend
      if (formData.gambar) {
        formDataToSend.append("gambar", formData.gambar);
      }

      const response = await axios.patch(
        `${BASE_URL}/api/kategoriWebsite/${id}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Cek status respons
      if (response.status === 200) {
        router.push("/admin/kategoriWebsite");
      } else {
        console.error("Gagal mengirim data.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <AdminLayout>
      <Head>
        <title>Edit Kategori Website</title>
      </Head>
      <div className="flex items-center justify-center p-12">
        <div className="mx-auto w-full max-w-[700px] bg-white rounded-lg lg:-mt-40">
          <div className="flex justify-end pt-4 px-4">
            <Link href={"/admin/kategoriWebsite"} className="relative">
              <div className="flex items-center gap-2 px-8 py-2 font-semibold text-white rounded-lg cursor-pointer text-end bg-orange-400">
                <i className="fas fa-arrow-left"></i>
                <span>Kembali</span>
              </div>
            </Link>
          </div>

          <form className="py-4 bg-white px-9" onSubmit={handleSubmit}>
            <div className="mb-5">
              <label
                htmlFor="nama_kategori"
                className="mb-3 block text-base font-medium text-[#07074D]"
              >
                Nama Kategori
              </label>
              <input
                type="text"
                name="nama_kategori"
                id="nama_kategori"
                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                value={formData.nama_kategori}
                onChange={handleInputChange}
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
                name="deskripsi_kategori"
                id="deskripsi_kategori"
                rows="3"
                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                value={formData.deskripsi_kategori} // Gunakan nilai awal jika value kosong
                onChange={handleInputChange}
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
