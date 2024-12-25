import { useState, useEffect } from "react";
import axios from "axios";
import Head from "next/head";
import PelangganLayout from "../layouts";
import { useCookies } from "react-cookie";
import Link from "next/link";
import { BASE_URL } from "../../../components/layoutsAdmin/apiConfig";
import CekRole from "@/components/CekRole";

export default function Invoice() {
  const [cookies] = useCookies(["token"]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [noInvoicesMessage, setNoInvoicesMessage] = useState("");

  const roleId = CekRole(); // Pastikan CekRole mengembalikan ID yang valid

  useEffect(() => {
    if (cookies.token && roleId) {
      fetchInvoiceData(); // Panggil fungsi untuk mengambil data invoice
    }
  }, [cookies.token, roleId]);

  const fetchInvoiceData = async () => {
    setLoading(true);
    setError(null);
    setNoInvoicesMessage(""); // Reset pesan tidak ada invoice
    try {
      const response = await axios.get(
        `${BASE_URL}/api/invoice/user/${roleId}`
      );
      //console.log("invoice", response.data);

      // Jika respons mengandung pesan bahwa tidak ada invoice
      if (response.data.message === "No invoices found for this user") {
        setNoInvoicesMessage("Tidak ada data invoice untuk pengguna ini.");
        setInvoices([]);
      } else {
        setInvoices(response.data);
      }
    } catch (error) {
      console.error("Error fetching invoice data:", error);
      setError("Anda tidak memiliki invoice");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <PelangganLayout>
        <div>Loading...</div>
      </PelangganLayout>
    );
  }

  if (error) {
    return (
      <PelangganLayout>
        <div>{error}</div>
      </PelangganLayout>
    );
  }

  const handlePrint = (id) => {
    const printWindow = window.open(
      `/pelanggan/print_detail/${id}?print=true`,
      "_blank",
      "width=800,height=600"
    );

    if (printWindow) {
      const checkPrintReady = setInterval(() => {
        if (printWindow.document.readyState === "complete") {
          clearInterval(checkPrintReady);
          printWindow.focus(); // Fokus ke jendela baru
          setTimeout(() => {
            printWindow.print();
          }, 1000); // Delay untuk memastikan rendering selesai
        }
      }, 100);

      printWindow.onerror = (error) => {
        console.error("Error in print window:", error);
        alert(
          "Terjadi kesalahan saat memuat halaman cetak. Silakan coba lagi."
        );
      };
    } else {
      alert(
        "Tidak dapat membuka jendela cetak. Pastikan popup tidak diblokir."
      );
    }
  };

  return (
    <PelangganLayout>
      <Head>
        <title>Data Invoice</title>
      </Head>
      <div className="flex flex-col bg-white overflow-x-auto lg:overflow-x-hidden rounded-xl md:-mt-44">
        <div className="sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
            <div className="overflow-x-auto lg:overflow-x-hidden">
              {noInvoicesMessage ? (
                <div>{noInvoicesMessage}</div>
              ) : invoices.length > 0 ? (
                <table className="min-w-full text-sm font-light text-left">
                  <thead className="font-medium border-b dark:border-neutral-500">
                    <tr>
                      <th scope="col" className="px-12 py-4">
                        Nama Paket
                      </th>
                      <th scope="col" className="px-12 py-4">
                        Nama Kategori
                      </th>
                      <th scope="col" className="px-12 py-4">
                        Print Di Sini
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((invoice, index) =>
                      invoice.cartPaket?.map((item, subIndex) => (
                        <tr key={`${index}-${subIndex}`}>
                          <td className="px-12 py-4 whitespace-nowrap">
                            {item.paket?.nama_paket ||
                              "Nama paket tidak di temukan"}
                          </td>
                          <td className="px-12 py-4 whitespace-nowrap">
                            {item.paket?.kategoriWebsite?.nama_kategori ||
                              "Nama Kategori tidak di temukan"}
                          </td>
                          <td className="flex items-center gap-1 px-12 py-4 mt-8 whitespace-nowrap">
                            <Link
                              href={`/pelanggan/detail_invoice/${invoice.id}`}
                            >
                              <div
                                className="items-center w-auto px-5 py-2 mb-2 tracking-wider text-white font-semibold rounded-full shadow-sm bg-orange-400 hover:bg-orange-600"
                                aria-label="edit"
                              >
                                <i class="fa-solid fa-info"></i>
                              </div>
                            </Link>
                            <button onClick={() => handlePrint(invoice.id)}>
                              <div className="items-center w-auto px-5 py-2 mb-2 tracking-wider text-white font-semibold rounded-full shadow-sm bg-orange-400 hover:bg-orange-600">
                                <i class="fa-solid fa-print"></i>
                              </div>
                            </button>
                            <Link href={`/pelanggan/kuitansi/${invoice.id}`}>
                              <button>
                                <div className="item-center w-auto px-5 py-2 mb-2 tracking-wider text-white font-semibold rounded-full shadow-sm bg-orange-400 hover:bg-orange-600">
                                  <i class="fa-solid fa-file-lines"></i>
                                </div>
                              </button>
                            </Link>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              ) : (
                <div>No invoice data available.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PelangganLayout>
  );
}
