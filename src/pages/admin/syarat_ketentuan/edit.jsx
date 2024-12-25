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
  const [formData, setFormData] = useState({
    nama_syarat_ketentuan: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/syaratketentuan/${id}`
        );

        const data = response.data;
        const { nama_syarat_ketentuan } = data;
        setFormData((prevData) => ({
          ...prevData,
          nama_syarat_ketentuan: nama_syarat_ketentuan || "",
        }));
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,

      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      formDataToSend.append(
        "nama_syarat_ketentuan",
        formData.nama_syarat_ketentuan
      );

      const response = await axios.patch(
        `${BASE_URL}/api/syaratketentuan/${id}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        router.push("/admin/syarat_ketentuan");
      } else {
        console.error("Gagal mengirim data.", response);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <AdminLayout>
      <Head>
        <title>Edit Syarat & Ketentuan</title>
      </Head>
      <div className="flex items-center justify-center p-12">
        <div className="mx-auto w-full max-w-[550px] bg-white rounded-lg lg:-mt-40">
        <div className="relative py-3">
            <Link
              href={"/admin/syarat_ketentuan"}
              className="absolute right-4 top-10" // Ubah posisi ke kanan
            >
              <div className="flex items-center gap-2 px-8 py-2 font-semibold text-white rounded-lg cursor-pointer bg-orange-400 hover:bg-orange-500 text-md">
                <i className="fas fa-arrow-left"></i>
                <span>Kembali</span>
              </div>
            </Link>
          </div>
          <form className="py-20 bg-white px-9" onSubmit={handleSubmit}>
            <div className="mb-5">
              <label
                htmlFor="nama_syarat_ketentuan"
                className="mb-3 block text-base font-medium text-[#07074D]"
              >
                Nama Syarat & Ketentuan
              </label>
              <input
                type="text"
                name="nama_syarat_ketentuan"
                id="nama_syarat_ketentuan"
                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
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
