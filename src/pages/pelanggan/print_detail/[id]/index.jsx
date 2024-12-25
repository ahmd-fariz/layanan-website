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
      console.log("tes", response.data);

      // Calculate PPN (11% of subtotal)
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
    <>
      <Head>
        <title>Invoice Detail</title>
        <style type="text/css" media="print">{`
          @page {
            size: A4 landscape;
            margin: 10mm;
          }
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          #printable-content {
            width: 100%;
            height: auto;
            display: flex;
            flex-direction: column;
            font-family: Arial, sans-serif;
          }
          .invoice-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
            border-bottom: 2px solid #000;
            padding-bottom: 10px;
          }
          .invoice-header h1 {
            font-size: 1.5em;
            margin: 0;
          }
          .invoice-header img {
            max-width: 100px;
            height: auto;
          }
          .invoice-items {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
          }
          .invoice-item {
            width: 100%;
            margin-bottom: 20px;
          }
          .invoice-total {
            align-self: flex-end;
            margin-top: 20px;
            font-weight: bold;
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
            padding: 8px;
            text-align: center;
          }
        }
      `}</style>
      <div className="flex flex-col overflow-hidden bg-white rounded-xl md:-mt-44">
        <div className="sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
            <div className="invoice-container p-6 bg-white rounded-md shadow-md">
              <div className="invoice-header">
                <div className="flex items-center">
                  <img
                    className="w-20 h-20 mr-4"
                    src={settingData?.gambar_setting}
                    alt=""
                  />
                  <div>
                    <h1 className="text-xl font-bold">
                      {settingData?.profil_perusahaan}
                    </h1>
                    <p>{settingData?.alamat}</p>
                    <p>
                      Tel: {settingData?.telp} | Email: {settingData?.email}
                    </p>
                  </div>
                </div>
                <div>
                  <h1 className="text-xl font-bold">Invoice</h1>
                  <p>Referensi: {invoiceData?.refrensi}</p>
                  <p>Tanggal: {invoiceData?.tanggal}</p>
                  <p>Jatuh Tempo: {invoiceData?.tgl_jatuh_tempo}</p>
                </div>
              </div>

              <div className="invoice-items">
                <div className="w-1/2 pr-4">
                  <h3 className="font-bold">Tagihan Kepada</h3>
                  <hr className="border-black w-full mb-2" />
                  <p>Nama: {customerData?.nama}</p>
                  <p>Alamat: {customerData?.alamat}</p>
                  <p>Telepon: {customerData?.telp}</p>
                  <p>Email: {customerData?.email}</p>
                </div>
              </div>

              <div className="invoice-item">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-700 text-white">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Paket
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Nama Kategori
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Harga
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Diskon
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-300 divide-y divide-gray-200">
                    {cartPaketData.map((item, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {item.pakets.nama_paket}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {item.pakets.kategoriWebsite.nama_kategori}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          Rp {parseFloat(item.harga).toLocaleString("id-ID")},00
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          Rp {parseFloat(item.diskon).toLocaleString("id-ID")}
                          ,00
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between mt-4">
                <div className="w-1/3">
                  <h3 className="text-sm text-center mb-2">
                    Dengan Hormat, {settingData?.profil_perusahaan}
                  </h3>
                  <div className="flex justify-center">
                    <img
                      className="h-28 w-auto absolute"
                      src={settingData?.url_foto_cap}
                      alt=""
                    />
                    <img
                      className="h-28 w-auto"
                      src={settingData?.url_foto_ttd}
                      alt=""
                    />
                  </div>
                  <h3 className="text-sm text-center mt-4">
                    {settingData?.profil_perusahaan}
                  </h3>
                </div>
                <div className="w-1/3">
                  <div className="flex justify-between text-sm font-semibold mt-2">
                    <div>Subtotal</div>
                    <div>Rp {invoiceData.subtotal.toLocaleString()},00</div>
                  </div>
                  <div className="flex justify-between text-sm font-semibold mt-2">
                    <div>Total Diskon</div>
                    <div>
                      (Rp {invoiceData.total_diskon.toLocaleString()},00)
                    </div>
                  </div>
                  <div className="flex justify-between text-sm font-semibold mt-2">
                    <div>PPN (11%)</div>
                    <div>Rp {invoiceData.total_pajak.toLocaleString()},00</div>
                  </div>
                  <div className="flex justify-between text-lg font-bold mt-2 underline">
                    <div>Total</div>
                    <div>Rp {invoiceData.total.toLocaleString()},00</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
