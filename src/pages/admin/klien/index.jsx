import AdminLayout from "../layouts";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import Head from "next/head";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { parseCookies } from "nookies";
import { useRouter } from "next/router";
import { BASE_URL } from '../../../components/layoutsAdmin/apiConfig';

const Klien = ({ isLoggedIn }) => {
  const [allKlien, setAllKlien] = useState([]); // State untuk menyimpan semua data
  const router = useRouter();
  const [klien, setKlien] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      // Ambil semua data sekali saja
      const response = await axios.get(`${BASE_URL}/api/klien`);
      setAllKlien(response.data.data);

      // Filter data berdasarkan pencarian dan pagination
      const filteredData = response.data.data.filter((item) =>
        item.nama_klien.toLowerCase().includes(searchTerm.toLowerCase())
      );

      // Update data untuk ditampilkan berdasarkan pagination
      const paginatedData = filteredData.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
      );

      setKlien(paginatedData);
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

  const handleDelete = async (id) => {
    setIsDeleting(true);
    const confirmDelete = window.confirm(
      "Apakah Anda yakin ingin menghapus item ini?"
    );
    if (!confirmDelete) {
      setIsDeleting(false);
      return;
    }
    try {
      const response = await axios.delete(
        `${BASE_URL}/api/klien/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status != 200) {
        throw new Error("Gagal menghapus data");
      }

      fetchData();
      showToastMessage();
    } catch (error) { 
      console.error("Terjadi kesalahan:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const showToastMessage = () => {
    toast.success("Item berhasil dihapus", {
      position: "top-right",
    });
  };

  if (error) {
    return (
      <div className="text-center text-red-500">
        Error: {error.message || "Terjadi kesalahan pada server"}
      </div>
    );
  }

  const firstPage = Math.max(1, currentPage - 4); // Menghitung halaman pertama yang akan ditampilkan

  if (!isLoggedIn) {
    if (typeof window !== "undefined") {
      // Cek apakah kode sedang berjalan di sisi klien
      router.push("/auth/login"); // Mengarahkan pengguna kembali ke halaman login
    }
    return <p>Loading...</p>; // or display loading indicator
  }
  return (
    <>
      <Head>
        <title>Data Klien</title>
      </Head>
      <AdminLayout>
        <ToastContainer />

        <div className="flex items-center justify-between mb-4 lg:-mt-48 md:-mt-48">
        <input
            type="text"
            placeholder="Cari klien..."
            value={searchTerm}
            onChange={handleSearchInputChange}
            className="w-48 md:w-56 lg:w-72 rounded-lg border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
          />
          <Link
            href={"/admin/klien/add"}
            className="flex items-center gap-1 px-4 py-2 text-white rounded-md shadow-sm bg-orange-400"
          >
            <i className="fa-solid fa-plus"></i>
            Klien
          </Link>
        </div>
        <div className="flex flex-col overflow-x-auto  bg-white rounded-xl">
          <div className="sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm font-light text-left">
                  <thead className="font-medium border-b dark:border-neutral-500">
                    <tr>
                      <th scope="col" className="px-4 py-4">
                        Nama Paket
                      </th>
                      <th scope="col" className="px-4 py-4">
                        Nama Klien
                      </th>
                      <th scope="col" className="px-4 py-4">
                        Nama Kategori Klien
                      </th>
                      <th scope="col" className="px-4 py-4">
                        Url Klien
                      </th>
                      <th scope="col" className="px-4 py-4">
                        Logo Klien
                      </th>
                      <th scope="col" className="px-4 py-4">
                        Headline
                      </th>
                      <th scope="col" className="px-4 py-4">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {klien.map((item) => (
                      <tr
                        className="border-b dark:border-neutral-500 "
                        key={item.id}
                      >
                        <td className="px-4 py-4 whitespace-nowrap">
                          {item.paket.nama_paket}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {item.nama_klien}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {item.kategori_klien.nama_kategori_klien}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {item.url_klien}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <img
                            src={item.logo_klien}
                            alt="Foto"
                            className="object-scale-down w-24 h-24 rounded-2xl"
                          />
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {item.is_headline ? "Ya" : "Tidak"}
                        </td>
                        <td className="flex items-center gap-1 px-6 py-4 mt-8 whitespace-nowrap">
                          <Link href={"/admin/klien/edit?id=" + item.id}>
                            <div
                              className="items-center w-auto px-5 py-2 mb-2 tracking-wider text-white rounded-full shadow-sm bg-orange-400 hover:bg-orange-700"
                              aria-label="edit"
                            >
                              <i className="fa-solid fa-pen"></i>
                            </div>
                          </Link>

                          <button
                            onClick={() => handleDelete(item.id)}
                            disabled={isDeleting}
                            className="items-center w-auto px-5 py-2 mb-2 tracking-wider text-white rounded-full shadow-sm bg-orange-400 hover:bg-orange-700"
                            aria-label="delete"
                          >
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination */}
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
                    {Array.from(
                      { length: Math.min(totalPages, 5) },
                      (_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentPage(firstPage + index)}
                          className={`mx-1 px-3 py-1 rounded-md ${
                            currentPage === firstPage + index
                              ? "bg-orange-400 text-white"
                              : "bg-gray-200 hover:bg-gray-400"
                          }`}
                        >
                          {firstPage + index}
                        </button>
                      )
                    )}
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
    </>
  );
};
// middleware
export async function getServerSideProps(context) {
  // Mendapatkan cookies dari konteks
  const cookies = parseCookies(context);

  // Mengecek apakah token JWT ada di cookies
  const isLoggedIn = !!cookies.token;

  // Mengembalikan props untuk komponen Dashboard
  return {
    props: { isLoggedIn },
  };
}

export default Klien;
