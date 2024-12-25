import AdminLayout from "../layouts";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import Head from "next/head";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BASE_URL } from "../../../components/layoutsAdmin/apiConfig";

const Setting = () => {
  const [allsetting, setAllSetting] = useState([]); // State untuk menyimpan semua data
  const [setting, setSetting] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Ambil semua data sekali saja
      const response = await axios.get(`${BASE_URL}/api/setting`);
      // console.log("response", response.data.data)
      setAllSetting(response.data.data);

      // Filter data berdasarkan pencarian dan pagination
      const filteredData = response.data.data.filter((item) =>
        item.email.toLowerCase().includes(searchTerm.toLowerCase())
      );

      // Update data untuk ditampilkan berdasarkan pagination
      const paginatedData = filteredData.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
      );

      setSetting(paginatedData);
      setTotalCount(filteredData.length);
      setTotalPages(Math.ceil(filteredData.length / pageSize));
    } catch (error) {
      console.error("Error fetching data paket:", error);
      setError(error.response ? error.response.data : error);
    } finally {
      setLoading(false);
    }
  };

  // kondisi search
  useEffect(() => {
    fetchData(); // Pastikan fetchData dipanggil saat currentPage atau searchTerm berubah
  }, [currentPage, searchTerm]);

  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset ke halaman pertama saat pencarian dilakukan
  };

  const handleDelete = (id) => {
    setItemToDelete(id);
    toggleModalDelete();
  };

  const toggleModalDelete = () => {
    setShowDeleteModal(!showDeleteModal);
  };

  const handleDeleteItem = async () => {
    setIsDeleting(true);
    try {
      const response = await axios.delete(
        `${BASE_URL}/api/setting/${itemToDelete}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status != 200) {
        throw new Error("Gagal menghapus data");
      }

      //  setSetting(setting.filter((item) => item.id !== itemToDelete));
      fetchData();
      toast.success("Item berhasil dihapus", {
        position: "top-right",
      });
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
    } finally {
      setIsDeleting(false);
      toggleModalDelete();
    }
  };

  if (error) {
    return (
      <div className="text-center text-red-500">Error: {error.message}</div>
    );
  }

  return (
    <>
      <ToastContainer />
      <Head>
        <title>Data Setting</title>
      </Head>
      <AdminLayout>
        <div className="flex items-center justify-between mb-4 lg:-mt-48 md:-mt-48">
          <input
            type="text"
            placeholder="Cari Setting..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-48 md:w-56 lg:w-72 rounded-xl border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
          />
          <Link
            href={"/admin/setting/add"}
            className="z-10 flex items-center gap-1 px-4 py-2 text-white rounded-md shadow-sm bg-orange-400"
          >
            <i className="fa-solid fa-plus"></i>
            Setting
          </Link>
        </div>
        <div className="flex flex-col overflow-x-auto bg-white rounded-xl">
          <div className=" sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm font-light text-left">
                  <thead className="font-medium border-b dark:border-neutral-500">
                    <tr>
                      <th scope="col" className="px-6 py-4">
                        #
                      </th>
                      <th scope="col" className="px-6 py-4">
                        Setting Warna
                      </th>

                      <th scope="col" className="px-6 py-4">
                        WA
                      </th>

                      <th scope="col" className="px-6 py-4">
                        Telepon
                      </th>

                      <th scope="col" className="px-6 py-4">
                        Email
                      </th>

                      <th scope="col" className="px-6 py-4">
                        Profil Perusahaan
                      </th>

                      <th scope="col" className="px-6 py-4">
                        Alamat
                      </th>

                      <th scope="col" className="px-6 py-4">
                        Url Google Maps
                      </th>

                      <th scope="col" className="px-6 py-4">
                        Foto
                      </th>
                      <th scope="col" className="px-6 py-4">
                        Foto Cap
                      </th>
                      <th scope="col" className="px-6 py-4">
                        Bidang Perusahaan
                      </th>
                      <th scope="col" className="px-6 py-4">
                        Foto Ttd
                      </th>
                      <th scope="col" className="px-6 py-4">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {setting.map((item, index) => (
                      <tr
                        className="border-b dark:border-neutral-500"
                        key={item.id}
                      >
                        <td className="px-6 py-4 font-medium whitespace-nowrap">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.setting_warna}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.wa}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.telp}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.profil_perusahaan}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.alamat}
                        </td>
                        <td
                          className="px-6 py-4 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs"
                          title={item.url_gmaps} // Menampilkan teks lengkap saat dihover
                        >
                          {item.url_gmaps}
                        </td>

                        <td className="py-4 whitespace-nowrap">
                          <img
                            src={item.gambar_setting}
                            alt="Foto"
                            className="object-scale-down w-24 h-24 rounded-2xl"
                          />
                        </td>

                        <td className="py-4 whitespace-nowrap">
                          <img
                            src={item.url_foto_cap}
                            alt="Foto"
                            className="object-scale-down w-24 h-24 rounded-2xl"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.bidang_perusahaan}
                        </td>

                        <td className="py-4 whitespace-nowrap">
                          <img
                            src={item.url_foto_ttd}
                            alt="Foto"
                            className="object-scale-down w-24 h-24 rounded-2xl"
                          />
                        </td>

                        <td className="flex items-center gap-1 px-6 py-4 mt-8 whitespace-nowrap">
                          <Link href={"/admin/setting/edit?id=" + item.id}>
                            <div
                              className="items-center w-auto px-5 py-2 mb-2 tracking-wider text-white rounded-full shadow-sm bg-orange-400"
                              aria-label="edit"
                            >
                              <i className="fa-solid fa-pen"></i>
                            </div>
                          </Link>

                          <button
                            onClick={() => handleDelete(item.id)}
                            disabled={isDeleting}
                            className="items-center w-auto px-5 py-2 mb-2 tracking-wider text-white rounded-full shadow-sm bg-orange-400"
                            aria-label="delete"
                          >
                            {isDeleting ? (
                              "Menghapus..."
                            ) : (
                              <i className="fa-solid fa-trash"></i>
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {/* pagination */}
                <div className="flex justify-center gap-5 my-4">
                  <button
                    onClick={() =>
                      setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-400"
                  >
                    Prev
                  </button>
                  <div className="flex">
                    {Array.from({ length: totalPages }, (_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentPage(index + 1)}
                        className={`mx-1 px-3 py-1 rounded-md ${
                          currentPage === index + 1
                            ? "bg-gray-300"
                            : "bg-gray-200 hover:bg-gray-400"
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() =>
                      setCurrentPage((prevPage) =>
                        Math.min(prevPage + 1, totalPages)
                      )
                    }
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-400"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 transition-opacity">
            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>
          <div className="relative w-full max-w-md transition transform bg-white rounded-lg shadow-xl">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Hapus Item
              </h3>
              <p className="max-w-2xl mt-1 text-sm text-gray-500">
                Apakah Anda yakin ingin menghapus item ini?
              </p>
            </div>
            <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                onClick={handleDeleteItem}
                className="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-red-500 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Hapus
              </button>
              <button
                type="button"
                onClick={toggleModalDelete}
                className="inline-flex justify-center w-full px-4 py-2 mt-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Setting;
