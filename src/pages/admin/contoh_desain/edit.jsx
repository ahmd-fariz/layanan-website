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

  // Initialize formData state with default values
  const [formData, setFormData] = useState({
    link_contoh_desain: "",
    gambar_link_contoh_desain: null,
    is_gambar: "",
    deskripsi: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/contohdesain/${id}`
        );
        const data = response.data;
        // Update formData state with data from the API response
        setFormData({
          link_contoh_desain: data.link_contoh_desain || "",
          gambar_link_contoh_desain: data.gambar_link_contoh_desain || "",
          is_gambar: data.is_gambar ? "1" : "0",
          deskripsi: data.deskripsi || "",
        });
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

  //Handle input change function
  const handleInputChange = ({ target: { name, value, files } }) => {
    if (name === "is_gambar" && value === "0") {
      // Reset link_contoh_desain jika is_gambar dipilih sebagai "Tidak"
      setFormData((prevData) => ({
        ...prevData,
        is_gambar: value,
        link_contoh_desain: "",
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: name === "gambar_link_contoh_desain" ? files[0] : value,
        ...(name === "gambar_link_contoh_desain" && {
          gambarUrl: URL.createObjectURL(files[0]),
        }),
      }));
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      // Append data to formData
      formDataToSend.append("is_gambar", formData.is_gambar);

      if (formData.is_gambar === "1" && formData.gambar_link_contoh_desain) {
        formDataToSend.append(
          "gambar_link_contoh_desain",
          formData.gambar_link_contoh_desain
        );
      } else if (formData.is_gambar === "0") {
        formDataToSend.append(
          "link_contoh_desain",
          formData.link_contoh_desain
        );
      }

      formDataToSend.append("deskripsi", formData.deskripsi);

      console.log("is_gambar value:", formData.is_gambar);


      const response = await axios.patch(
        `${BASE_URL}/api/contohdesain/${id}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": formData.is_gambar
              ? "multipart/form-data"
              : "application/json",
          },
        }
      );

      if (response.status === 200) {
        router.push("/admin/contoh_desain");
      } else {
        console.error("Gagal mengirim data.", response);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error loading data: {error.message}</p>;
  }

  return (
    <AdminLayout>
      <Head>
        <title>Edit Contoh Desain</title>
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
            {formData.is_gambar !== "1" && (
              <div className="mt-4 mb-5">
                <label
                  htmlFor="link_contoh_desain"
                  className="mb-3 block text-base font-medium text-[#07074D]"
                >
                  Link Contoh Desain
                </label>
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
            )}

            <div className="mt-4 mb-5">
              <label
                htmlFor="is_gambar"
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

            {formData.is_gambar === "1" && (
              <div className="mb-6">
                <label className="mb-5 block text-base font-semibold text-[#07074D]">
                  Gambar
                </label>
                <input
                  type="file"
                  name="gambar_link_contoh_desain"
                  id="gambar_link_contoh_desain"
                  className="w-full rounded-md border-2 border-blue-300 bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                  onChange={handleInputChange}
                />
              </div>
            )}

            <div className="mb-5">
              <label
                htmlFor="deskripsi"
                className="mb-3 block text-base font-medium text-[#07074D]"
              >
                Deskripsi
              </label>
              <input
                type="text"
                name="deskripsi"
                id="deskripsi"
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
