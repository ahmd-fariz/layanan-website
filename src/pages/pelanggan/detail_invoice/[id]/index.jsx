import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Head from "next/head";
import PelangganLayout from "../../layouts";
import { useCookies } from "react-cookie";
import { BASE_URL } from "../../../../components/layoutsAdmin/apiConfig";

export default function Invoice() {
  const router = useRouter();
  const { id } = router.query;
  const [cookies] = useCookies(["token"]); // Ambil cookie
  const [settingData, setSettingData] = useState(null);
  const [customerData, setCustomerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cartPaketData, setCartPaketData] = useState([]);
  const [invoiceData, setInvoiceData] = useState({
    refrensi: "",
    tanggal: "",
    tgl_jatuh_tempo: "",
    pelanggan_id: "",
    subtotal: 0,
    total_diskon: 0,
    total: 0,
    total_pajak: 0,
  });

  const fetchSettingData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/setting/`);
      setSettingData(response.data.data[0]);
    } catch (error) {
      console.error("Error fetching setting data:", error);
    }
  };

  const fetchCustomerData = async () => {
    try {
      console.log(id);
      const response = await axios.get(`${BASE_URL}/api/invoice/${id}`);
      const subtotal = response.data.subtotal;
      const ppn = subtotal * 0.11;
      const total = subtotal - response.data.total_diskon + ppn;

      setInvoiceData({
        ...response.data,
        total_pajak: ppn,
        total: total,
      });
      setCustomerData(response.data.pelanggas);
      setCartPaketData(response.data.cartPaket);
    } catch (error) {
      console.error("Error fetching customer data:", error);
    }
  };

  useEffect(() => {
    if (id) {
      // Pastikan id sudah tersedia
      fetchSettingData();
      fetchCustomerData();
    }
  }, [id]); // Tambahkan id sebagai dependency


  useEffect(() => {
    const handlePrint = () => {
      if (!loading && invoiceData && print === "true") {
        window.print();
      }
    };

    if (window.opener && !window.opener.closed) {
      if (!loading && invoiceData) {
        setTimeout(handlePrint, 1000); // Delay print by 1 second
      }
    }
  }, [loading, invoiceData]);
  return (
    <PelangganLayout>
      <Head>
        {/* tes */}
        <title>Invoice Detail </title>
        <style type="text/css" media="print">{`
          @page {
            size: A4; /* Mengatur ukuran halaman cetak menjadi A4 */
            margin: 10mm;
          }
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          #printable-content {
            width: 100%;
            height: auto; /* Mengubah height menjadi auto untuk menghindari overflow */
            display: flex;
            flex-direction: column;
            font-family: Arial, sans-serif; /* Menambahkan font untuk tampilan lebih baik */
          }
          .invoice-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
            border-bottom: 2px solid #000; /* Menambahkan garis bawah untuk header */
            padding-bottom: 10px; /* Menambahkan padding bawah */
            padding-left: 10px; /* Menambahkan padding kiri */
            padding-right: 10px; /* Menambahkan padding kanan */
          }
          .invoice-header h1 {
            font-size: 1.5em; /* Menyesuaikan ukuran font untuk header */
            margin: 0; /* Menghilangkan margin untuk menghindari tumpang tindih */
          }
          .invoice-header img {
            max-width: 100px; /* Membatasi lebar gambar agar tidak terlalu besar */
            height: auto; /* Menjaga proporsi gambar */
          }

          .invoice-items {
            display: grid; /* Ubah dari flex ke grid */
            grid-template-columns: repeat(2, 1fr); /* Membuat dua kolom */
            gap: 20px; /* Menambahkan jarak antar item */
            margin-bottom: 20px; /* Menambahkan margin bawah */
            margin-left: -20px; /* Menggeser ke kiri dengan margin negatif */
          }

          .invoice-total {
            align-self: flex-end;
            margin-top: 20px;
            font-weight: bold; /* Menebalkan total */
          }
        `}</style>
      </Head>
      <style jsx global>{`
        @media print {
          .navbar,
          .sidebar,
          .no-print {
            display: none !important;
          }
          .invoice-container {
            margin: 0;
            padding: 0;
            box-shadow: none;
            width: 100%;
          }
          .invoice-item th,
          .invoice-item td {
            padding: 8px; /* Menambahkan padding untuk tabel */
            text-align: center; /* Menyelaraskan teks ke tengah */
          }
        }
      `}</style>
      <div className="flex flex-col overflow-hidden bg-white rounded-xl md:-mt-44">
        <div className="sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
            <div className="invoice-container p-6 bg-white rounded-md shadow-md">
              {/* Konten invoice */}
              <div className="grid grid-flow-col">
                <div className="grid grid-cols-2 mb-6">
                  <div className="md:mx-4 text-center items-center">
                    <h1 className="text-lg md:text-xl font-bold mb-2">
                      {settingData?.profil_perusahaan}
                    </h1>
                    <img
                      className="w-20 h-20 mx-auto mt-4"
                      src={settingData?.gambar_setting}
                      alt=""
                    />
                  </div>

                  <div className="mx-auto md:mx-12">
                    <h1 className="text-xl font-bold pb-2">Invoice</h1>
                    <div className="text-gray-600 max-sm:text-sm grid grid-cols-2">
                      <div>Referensi</div>
                      <div className="md:-ml-16">: {invoiceData?.refrensi}</div>
                    </div>
                    <div className="text-gray-600 max-sm:text-sm grid grid-cols-2">
                      <div>Tanggal</div>
                      <div className="md:-ml-16">: {invoiceData?.tanggal}</div>
                    </div>
                    <div className="text-gray-600 max-sm:text-sm grid grid-cols-2">
                      <div>Jatuh Tempo </div>
                      <div className="md:-ml-16">: {invoiceData?.tgl_jatuh_tempo}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="invoice-items grid grid-flow-row md:grid-flow-row lg:grid-cols-2  pt-6 pb-12">
                <div className="mt-6 md:mt-6 lg:mt-0 ">
                  <h3 className="font-bold">Informasi Perusahaan</h3>
                  <hr className="border-black w-3/4 mb-4" />
                  <div className="text-gray-600">
                    <div className="grid grid-cols-2 max-sm:text-sm">
                      <span>Nama Perusahaan</span>
                      <span className="-ml-45 md:-ml-75">: {settingData?.profil_perusahaan}</span>
                    </div>
                    <div className="grid grid-cols-2 max-sm:text-sm">
                      <span>Alamat Perusahaan</span>
                      <span className="-ml-45 md:-ml-75">: {settingData?.alamat}</span>
                    </div>
                    <div className="grid grid-cols-2 max-sm:text-sm">
                      <span>Telepon Perusahaan</span>
                      <span className="-ml-45 md:-ml-75">: 0{settingData?.telp}</span>
                    </div>
                    <div className="grid grid-cols-2 max-sm:text-sm">
                      <span>Email Perusahaan</span>
                      <span className="-ml-45 md:-ml-75">: {settingData?.email}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 md:mt-6 lg:mt-0">
                  <h3 className="font-bold">Tagihan Kepada</h3>
                  <hr className="border-black w-3/4 mb-4" />
                  <div className="text-gray-600">
                    <div className="grid grid-cols-2 max-sm:text-sm">
                      <span>Nama Pelanggan</span>
                      <span className="-ml-55 md:-ml-75">: {customerData?.nama}</span>
                    </div>
                    <div className="grid grid-cols-2 max-sm:text-sm">
                      <span>Alamat Pelanggan</span>
                      <span className="-ml-55 md:-ml-75">: {customerData?.alamat}</span>
                    </div>
                    <div className="grid grid-cols-2 max-sm:text-sm">
                      <span>Telepon Pelanggan</span>
                      <span className="-ml-55 md:-ml-75">: {customerData?.telp}</span>
                    </div>
                    <div className="grid grid-cols-2 max-sm:text-sm">
                      <span>Email Pelanggan</span>
                      <span className="-ml-55 md:-ml-75">: {customerData?.email}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="invoice-item mb-6">
                <table className="min-w-full divide-y divide-gray-200 max-sm:text-sm">
                  <thead className="bg-gray-700 text-white">
                    <tr>
                      <th className="mx-auto py-3 text-center text-xs font-medium uppercase tracking-wider">
                        Paket
                      </th>
                      <th className="mx-auto py-3 text-center text-xs font-medium uppercase tracking-wider">
                        Nama Kategori
                      </th>
                      <th className="mx-auto py-3 text-center text-xs font-medium uppercase tracking-wider">
                        Harga
                      </th>
                      <th className="mx-auto py-3 text-center text-xs font-medium uppercase tracking-wider">
                        Diskon
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-300 divide-y divide-gray-200">
                    {cartPaketData.map((item, index) => (
                      <tr key={index}>
                        <td className="mx-auto text-sm py-4 text-center">
                          {item.pakets.nama_paket}
                        </td>
                        <td className="mx-auto text-sm py-4 text-center">
                          {item.pakets.kategoriWebsite.nama_kategori}
                        </td>
                        <td className="mx-auto text-sm py-4 text-center">
                          Rp {parseFloat(item.harga).toLocaleString("id-ID")}
                        </td>
                        <td className="mx-auto text-sm py-4 text-center">
                          {parseFloat(item.diskon).toLocaleString("id-ID")}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="invoice-items grid md:grid-flow-row lg:grid-flow-col">
                <div className="grid md:grid-flow-row lg:flex-row lg:flex lg:mx-12 lg:mt-8">
                  <div className="grid flow-row my-auto md:me-0">
                    <div>
                      <h3 className="text-sm text-center mb-2">
                        Dengan Hormat, {settingData?.profil_perusahaan}
                      </h3>
                      <div className="flex lg:justify-center md:justify-center justify-center">
                        <img
                          className="h-28 w-auto absolute"
                          src={settingData?.url_foto_cap}
                          alt=""
                        />
                        <img
                          className="h-28 w-auto ml-12"
                          src={settingData?.url_foto_ttd}
                          alt=""
                        />
                      </div>
                      <div>
                        <h3 className="text-sm text-center mt-4">
                          {settingData?.profil_perusahaan}
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-flow-row mt-4 flex-grow">
                  <div className="grid grid-cols-2 text-sm font-semibold mt-2">
                    <div>Subtotal</div>
                    <div>Rp {invoiceData.subtotal.toLocaleString()},00</div>
                  </div>
                  <div className="grid grid-cols-2 text-sm font-semibold mt-2">
                    <div>Total Diskon</div>
                    <div>
                      (Rp {invoiceData.total_diskon.toLocaleString()},00)
                    </div>
                  </div>
                  <div className="grid grid-cols-2 text-sm font-semibold mt-2">
                    <div>PPN (11%)</div>
                    <div>Rp {invoiceData.total_pajak.toLocaleString()},00</div>
                  </div>
                  <div className="grid grid-cols-2 text-lg font-bold mt-2 underline">
                    <div>Total</div>
                    <div>Rp {invoiceData.total.toLocaleString()},00</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PelangganLayout>
  );
}
