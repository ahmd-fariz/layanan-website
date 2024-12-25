import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import AdminLayout from "../layouts";
import axios from "axios";
import Head from "next/head";
import { BASE_URL } from "../../../components/layoutsAdmin/apiConfig";

export default function Edit() {
  const router = useRouter();
  const { id } = router.query;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize formData state with empty strings for text inputs and null for file input
  // Inisialisasi state formData dengan nilai default jika tidak ada data sebelumnya
  const [formData, setFormData] = useState({
    jenis_testimoni: "", // Set default value to empty string
    gambar_testimoni: null, // Set default value to null
    judul_testimoni: "", // Set default value to empty string
    deskripsi_testimoni: "", // Set default value to empty string
    is_publish: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/testimoni/${id}`);
        // console.log("API response:", response); // Log the entire API response
        if (!response.data) {
          throw new Error("Data tidak lengkap.");
        }
        const data = response.data;
        // Log the data object
        // Access attributes directly
        const { gambar_testimoni, judul_testimoni, deskripsi_testimoni } = data;
        // Update formData state with data from the API response
        setFormData((prevData) => ({
          ...prevData,
          jenis_testimoni: data.jenis_testimoni ? "Wa" : "Email",
          gambar_testimoni: gambar_testimoni || "",
          judul_testimoni: judul_testimoni || "",
          deskripsi_testimoni: deskripsi_testimoni || "",
          is_publish: data.is_publish ? "1" : "0",
        }));
      } catch (error) {
        console.error("Error fetching data testimoni:", error);
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
      [name]: name === "gambar_testimoni" ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("judul_testimoni", formData.judul_testimoni);
      formDataToSend.append(
        "deskripsi_testimoni",
        formData.deskripsi_testimoni
      );
      formDataToSend.append("jenis_testimoni", formData.jenis_testimoni);
      formDataToSend.append("is_publish", formData.is_publish);

      // Jika ada gambar baru, tambahkan ke formDataToSend
      if (formData.gambar_testimoni) {
        formDataToSend.append("gambar_testimoni", formData.gambar_testimoni);
      }

      const response = await axios.patch(
        `${BASE_URL}/api/testimoni/${id}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status == 200) {
        router.push("/admin/testimoni");
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
        <title>Edit Testimoni</title>
      </Head>
      <div className="flex items-center justify-center p-12">
        <div className="mx-auto w-full max-w-[700px] bg-white rounded-lg lg:-mt-40">
          <div className="flex justify-end pt-4 px-4">
            <Link href={"/admin/testimoni"} className="relative">
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
                />
              </div>
            </div>

            <div className="mb-5">
              <label
                htmlFor="jabatan"
                className="mb-3 block text-base font-medium text-[#07074D]"
              >
                Judul Testimoni
              </label>
              <input
                type="text"
                name="judul_testimoni"
                id="judul_testimoni"
                className="w-full rounded-md border-2 border-indigo-300 bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                value={formData.judul_testimoni} // Gunakan nilai awal jika value kosong
                onChange={handleInputChange}
              />
            </div>

            <div className="mb-5">
              <label
                htmlFor="testimoni"
                className="mb-3 block text-base font-medium text-[#07074D]"
              >
                Deskripsi Testimoni
              </label>
              <textarea
                name="deskripsi_testimoni"
                id="deskripsi_testimoni"
                rows="5"
                className="w-full rounded-md border-2 border-indigo-300 bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                value={formData.deskripsi_testimoni} // Gunakan nilai awal jika value kosong
                onChange={handleInputChange}
              ></textarea>
            </div>

            <div className="mt-4 mb-5">
              <label
                htmlFor="is_publish"
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
