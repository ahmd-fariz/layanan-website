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
    nama_rek: "",
    no_rek: "",
    atas_nama: "",
    image_bank: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/bank/${id}`
        );
        // console.log("API response:", response.data); // Log the entire API response
        const data = response.data;
        //  console.log("Data:", data);
        // Log the data object
        // Access attributes directly
        const { nama_rek, no_rek, atas_nama, image_bank } = data;
        // Update formData state with data from the API response
        setFormData((prevData) => ({
          ...prevData,
          nama_rek: nama_rek || "",
          no_rek: no_rek || "",
          atas_nama: atas_nama || "",
          image_bank: image_bank || "",
        }));
      } catch (error) {
        console.error("Error fetching data:", error); // Perbaiki pesan error
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
      [name]: name === "image_bank" ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("nama_rek", formData.nama_rek);
      formDataToSend.append("no_rek", formData.no_rek);
      formDataToSend.append("atas_nama", formData.atas_nama);
      
      // Hanya tambahkan image_bank jika ada file yang dipilih
      if (formData.image_bank) {
        formDataToSend.append("image_bank", formData.image_bank);
      }

      const response = await axios.patch(
        `${BASE_URL}/api/bank/${id}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status == 200) {
        router.push("/admin/pembayaran");
      } else {
        console.error("Gagal mengirim data.", response);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <AdminLayout>
      <Head><title>Edit Pembayaran</title></Head>
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
              />
            </div>

            <div className="mb-6">
              <label className="mb-5 block text-base font-semibold text-[#07074D]">
                Gambar
              </label>
              <div className="mb-8">
                <input
                  type="file"
                  name="image_bank"
                  id="image_bank"
                  htmlFor="image_bank"
                  className="w-full rounded-md border-2 border-indigo-300 bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                  onChange={handleInputChange}
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
              />
            </div>
            <div className="mb-5">
              <label
                htmlFor="lokasi"
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