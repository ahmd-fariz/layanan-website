import AdminLayout from "../layouts";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import Head from "next/head";
import { parseCookies } from "nookies";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BASE_URL } from '../../../components/layoutsAdmin/apiConfig';

const ConntohDesain = ({ isLoggedIn }) => {
  const router = useRouter();
  const [contohDesain, setContohDesain] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/contohDesain`
        );
        setContohDesain(response.data);
      } catch (error) {
        console.error("Error fetching data contoh desain:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleModalDelete = () => {
    setShowDeleteModal(!showDeleteModal);
  };

  const handleDelete = async () => {
    const id = isDeleting;
    try {
      const response = await axios.delete(
        `${BASE_URL}/api/contohdesain/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status != 200) {
        throw new Error("Gagal menghapus data");
      }

      setContohDesain(contohDesain.filter((item) => item.id !== id));
      toast.success("Data berhasil dihapus!");
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
      toast.error("Gagal menghapus data!");
    } finally {
      setShowDeleteModal(false);
    }
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
        <title>Data Contoh Desain</title>
      </Head>
      <AdminLayout>
        <ToastContainer />
        <div className="flex items-center justify-end mb-4 lg:-mt-48 md:-mt-48">
          <Link
            href={"/admin/contoh_desain/add"}
            className="flex items-center gap-1 px-4 py-2 text-white rounded-md shadow-sm bg-orange-400 hover:bg-orange-600"
          >
            <i className="fa-solid fa-plus"></i>
            Contoh Desain
          </Link>
        </div>
        <div className="flex flex-col overflow-x-auto  bg-white rounded-xl">
          <div className=" sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm font-light text-left">
                  <thead className="font-medium border-b dark:border-neutral-500">
                    <tr>
                      <th scope="col" className="px-6 py-4">
                        Link Contoh Desain
                      </th>
                      <th scope="col" className="px-6 py-4">
                        Deskripsi
                      </th>
                      <th scope="col" className="px-6 py-4">
                        Is Gambar
                      </th>
                      <th scope="col" className="px-6 py-4">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {contohDesain.map((item) => (
                      <tr
                        className="border-b dark:border-neutral-500"
                        key={item.id}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.is_gambar ? (
                            <>
                              <img
                                src={item.link_contoh_desain}
                                alt="foto"
                                width={100}
                              />
                            </>
                          ) : (
                            <>{item.link_contoh_desain}</>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.deskripsi}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.is_gambar ? "Ya" : "Tidak"}
                        </td>
                        <td className="flex items-center gap-1 px-6 py-4 mt-8 whitespace-nowrap">
                          <Link
                            href={"/admin/contoh_desain/edit?id=" + item.id}
                          >
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
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
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

export default ConntohDesain;
