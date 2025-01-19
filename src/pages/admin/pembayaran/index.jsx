import AdminLayout from "../layouts";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import Head from "next/head";
import { parseCookies } from "nookies";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify"; // Tambahkan import ini
import "react-toastify/dist/ReactToastify.css"; // Pastikan ini ada
import { BASE_URL } from "../../../components/layoutsAdmin/apiConfig";

const Pembayaran = ({ isLoggedIn }) => {
  const router = useRouter();
  const [bank, setBank] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  useEffect(() => {
    fetchData();
  }, [currentPage]); // Fetch data when currentPage changes

  const fetchData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/bank/`);
      //console.log(response.data)
      setBank(response.data.data);
      setTotalPages(response.data.data.totalPages);
      setPageSize(response.data.data.pageSize);
      setTotalCount(response.data.data.totalCount);
    } catch (error) {
      console.error("Error fetching data bank:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };
  const toggleModalDelete = () => {
    setShowDeleteModal(!showDeleteModal);
  };
  const handleDelete = async () => {
    const id = isDeleting;
    try {
      const response = await fetch(`${BASE_URL}/api/bank/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Gagal menghapus data");
      }

      setBank(bank.filter((item) => item.id !== id));
      showToastMessage("Data berhasil dihapus!"); // Tampilkan pesan sukses
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
    } finally {
      setShowDeleteModal(false);
    }
  };

  // Fungsi untuk notif mesage
  const showToastMessage = (message) => {
    toast.success(message, {
      position: "top-right",
    });
  };

  if (error) {
    return (
      <div className="text-center text-red-500">Error: {error.message}</div>
    );
  }
  // Jika pengguna belum login, arahkan kembali ke halaman login
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
        <title>Data Pembayaran</title>
      </Head>
      <AdminLayout>
        <div className="flex items-center justify-end mb-4 lg:-mt-48 md:-mt-48">
          {!loading && totalPages === 1 ? (
            <p></p>
          ) : (
            <Link
              href={"/admin/pembayaran/add"}
              className="flex items-center gap-1 px-4 py-2 text-white rounded-md shadow-sm bg-orange-400"
            >
              <i className="fa-solid fa-plus"></i>
              Bank
            </Link>
          )}
        </div>
        <div className="flex flex-col overflow-x-auto  bg-white rounded-xl">
          <div className=" sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm font-light text-left">
                  <thead className="font-medium border-b dark:border-neutral-500">
                    <tr>
                      <th scope="col" className="px-6 py-4">
                        Nama Rekening
                      </th>

                      <th scope="col" className="px-6 py-4">
                        No Rekening
                      </th>
                      <th scope="col" className="px-6 py-4">
                        Image Bank
                      </th>
                      <th scope="col" className="px-6 py-4">
                        Atas Nama
                      </th>

                      <th scope="col" className="px-6 py-4">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {bank && bank.length > 0 ? (
                      bank.map((item) => (
                        <tr
                          className="border-b dark:border-neutral-500"
                          key={item.id}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.nama_rek || "Tidak tersedia"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.no_rek || "Tidak tersedia"}
                          </td>
                          <td className="py-4 whitespace-nowrap">
                            {item.url_image_bank ? (
                              <img
                                src={item.url_image_bank}
                                alt={item.image_bank || "Gambar tidak tersedia"}
                                className="object-scale-down w-24 h-24 rounded-2xl"
                              />
                            ) : (
                              "Gambar tidak tersedia"
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.atas_nama || "Tidak tersedia"}
                          </td>
                          <td className="flex items-center gap-1 px-6 py-4 mt-8 whitespace-nowrap">
                            <Link href={"/admin/pembayaran/edit?id=" + item.id}>
                              <div
                                className="items-center w-auto px-5 py-2 mb-2 tracking-wider text-white rounded-full shadow-sm bg-orange-400"
                                aria-label="edit"
                              >
                                <i className="fa-solid fa-pen"></i>
                              </div>
                            </Link>
                            <button
                              onClick={() => {
                                toggleModalDelete();
                                setIsDeleting(item.id);
                              }}
                              className="items-center w-auto px-5 py-2 mb-2 tracking-wider text-white rounded-full shadow-sm bg-orange-400"
                              aria-label="delete"
                            >
                              <i className="fa-solid fa-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="text-center py-4">
                          Data tidak tersedia
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                {/* pagination */}
                {/* <div className="flex justify-center gap-5 my-4">
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
                </div> */}
              </div>
            </div>
          </div>
        </div>
        {/* Modal delete */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 transition-opacity">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <div className="relative w-full max-w-md transition transform bg-white rounded-lg shadow-xl">
              <div className="px-4 py-5 sm:px-6">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Delete Administrators
                  </h3>
                  <p className="max-w-2xl mt-1 text-sm text-gray-500">
                    Apakah Anda yakin ingin menghapus data ini?
                  </p>
                </div>
              </div>
              <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleDelete}
                  className="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-red-500 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="inline-flex justify-center w-full px-4 py-2 mt-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </AdminLayout>
      <ToastContainer /> {/* Tambahkan ini di dalam return */}
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
export default Pembayaran;
