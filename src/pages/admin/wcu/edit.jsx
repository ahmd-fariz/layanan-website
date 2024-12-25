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
    isi: "", // Set default value to empty string
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/wcu/${id}`);
        // console.log("API response:", response); // Log the entire API response
        if (!response.data.data || !response.data.data.attributes) {
          throw new Error("Data tidak lengkap.");
        }
        const data = response.data.data;
        // Log the data object
        // Access attributes directly
        const { isi } = data.attributes;
        console.log("Isi:", isi); // Tambahkan ini untuk melihat data
        // Update formData state with data from the API response
        setFormData((prevData) => ({
          ...prevData,
          isi: isi || "",
        }));
      } catch (error) {
        console.error("Error fetching data wcu:", error);
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
      [name]: name === "gambar" ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("isi", formData.isi); // Pastikan key ini sesuai dengan yang diharapkan oleh backend

      const response = await axios.patch(
        `${BASE_URL}/api/wcu/${id}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        router.push("/admin/wcu");
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
        <title>Edit WCU</title>
      </Head>
      <div className="flex items-center justify-center p-12">
        <div className="mx-auto w-full max-w-[700px] bg-white rounded-lg lg:-mt-40">
        <div className="relative py-2">
            <Link href={"/admin/wcu"} className="absolute right-4 top-10">
              <div className="flex items-center gap-2 px-8 py-2 font-semibold text-white rounded-lg cursor-pointer text-end bg-orange-400 text-md">
                <i className="fas fa-arrow-left"></i>
                <span>Kembali</span>
              </div>
            </Link>
          </div>

          <form className="pt-12 bg-white px-9" onSubmit={handleSubmit}>
            <div className="mb-5">
              <label
                htmlFor="wcu"
                className="mb-3 block text-base font-medium text-[#07074D]"
              >
                Isi
              </label>
              <textarea
                name="isi"
                id="isi"
                rows="5"
                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                value={formData.isi} // Gunakan nilai awal jika value kosong
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
