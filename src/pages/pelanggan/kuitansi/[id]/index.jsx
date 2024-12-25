import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Head from "next/head";
import PelangganLayout from "../../layouts";
import { useCookies } from "react-cookie";
import { BASE_URL } from "../../../../components/layoutsAdmin/apiConfig";

export default function Kuitansi() {
  const router = useRouter();
  const { id } = router.query;
  const [cookies] = useCookies(["token"]);
  const [settingData, setSettingData] = useState(null);
  const [customerData, setCustomerData] = useState(null);
  const [cartPaketData, setCartPaketData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [invoiceData, setInvoiceData] = useState({
    refrensi: "",
    tanggal: "",
    tgl_jatuh_tempo: "",
    pelanggan_id: "",
    subtotal: 0,
    total_diskon: 0,
    total: 0,
    ppn: 0,
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
      const response = await axios.get(`${BASE_URL}/api/invoice/${id}`);

      const subtotal = response.data.subtotal;
      const ppn = subtotal * 0.11;
      const totalWithPPN = subtotal - response.data.total_diskon + ppn;

      setInvoiceData({
        ...response.data,
        ppn: ppn,
        total: totalWithPPN,
      });
      setCustomerData(response.data.pelanggas);
      setCartPaketData(response.data.cartPaket || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching customer data:", error);
      setLoading(false);
    }
  };

  const angkaTerbilang = (angka) => {
    const bilangan = [
      "",
      "Satu",
      "Dua",
      "Tiga",
      "Empat",
      "Lima",
      "Enam",
      "Tujuh",
      "Delapan",
      "Sembilan",
      "Sepuluh",
      "Sebelas",
      "Dua Belas",
      "Tiga Belas",
      "Empat Belas",
      "Lima Belas",
      "Enam Belas",
      "Tujuh Belas",
      "Delapan Belas",
      "Sembilan Belas",
    ];

    const konversiBilangan = (n) => {
      if (n < 20) return bilangan[n];
      if (n < 100)
        return `${bilangan[Math.floor(n / 10)]} Puluh ${
          bilangan[n % 10]
        }`.trim();
      if (n < 200) return `Seratus ${konversiBilangan(n - 100)}`.trim();
      if (n < 1000)
        return `${bilangan[Math.floor(n / 100)]} Ratus ${konversiBilangan(
          n % 100
        )}`.trim();
      if (n < 2000) return `Seribu ${konversiBilangan(n - 1000)}`.trim();
      if (n < 1000000)
        return `${konversiBilangan(
          Math.floor(n / 1000)
        )} Ribu ${konversiBilangan(n % 1000)}`.trim();
      if (n < 1000000000)
        return `${konversiBilangan(
          Math.floor(n / 1000000)
        )} Juta ${konversiBilangan(n % 1000000)}`.trim();
      return `${konversiBilangan(
        Math.floor(n / 1000000000)
      )} Milyar ${konversiBilangan(n % 1000000000)}`.trim();
    };

    const rupiah = Math.floor(angka);
    const sen = Math.round((angka - rupiah) * 100);
    let hasil = konversiBilangan(rupiah);

    if (sen > 0) {
      hasil += ` Koma ${konversiBilangan(sen)}`;
    }

    return `${hasil} Rupiah`;
  };

  useEffect(() => {
    if (id) {
      fetchSettingData();
      fetchCustomerData();
    }
  }, [id]);

  useEffect(() => {
    const handlePrint = () => {
      if (!loading && invoiceData && print === "true") {
        window.print();
      }
    };

    if (window.opener && !window.opener.closed) {
      if (!loading && invoiceData) {
        setTimeout(handlePrint, 1000);
      }
    }
  }, [loading, invoiceData]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const getPaketInfo = () => {
    if (cartPaketData && cartPaketData.length > 0) {
      const paket = cartPaketData[0].pakets;
      return {
        kategori:
          paket && paket.kategoriWebsite
            ? paket.kategoriWebsite.nama_kategori
            : "Paket Website",
        nama: paket ? paket.nama_paket : "Tidak tersedia",
      };
    }
    return { kategori: "Paket Website", nama: "Tidak tersedia" };
  };

  const paketInfo = getPaketInfo();

  return (
    <PelangganLayout>
      <Head>
        <title>Kuitansi</title>
        <style type="text/css" media="print">{`
          @page {
            size: A4;
            margin: 10mm;
          }
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
        `}</style>
      </Head>
      <div className="max-w-2xl mx-auto my-10 p-6 border border-gray-300 shadow-lg rounded-lg bg-white">
        <h1 className="text-4xl font-bold text-center mb-8 text-blue-500">
          KUITANSI
        </h1>
        <div className="mb-6">
          <div className="text-md md:text-lg grid grid-cols-2">
            <strong>No. Kuitansi</strong> 
            <span className="-ml-9 md:-ml-32"><strong>: </strong>{invoiceData.refrensi}</span>
          </div>
          <div className="text-md md:text-lg grid grid-cols-2">
            <strong>Tanggal</strong> 
            <span className="-ml-9 md:-ml-32"><strong>: </strong>{invoiceData.tanggal}</span>
          </div>
        </div>
        <div className="mb-6">
          <div className="text-md md:text-lg grid grid-cols-2">
            <strong>Telah Diterima Dari</strong> 
            <span className="-ml-9 md:-ml-32"><strong>: </strong>{customerData?.nama}</span>
          </div>
          <div className="text-md md:text-lg grid grid-cols-2">
            <strong>Uang Sejumlah</strong> 
            <span className="-ml-9 md:-ml-32"><strong>: </strong>{formatCurrency(invoiceData.total)}</span>
          </div>
          <div className="mt-2 text-md md:text-lg grid grid-cols-2">
            <strong>Terbilang</strong> 
            <span className="-ml-9 md:-ml-32"><strong>: </strong>{angkaTerbilang(invoiceData.total)}</span>
          </div>
        </div>
        <div className="mb-6">
          <div className="tetx-md md:text-lg grid grid-cols-2">
            <strong>Untuk Pembayaran</strong> 
            <span className="-ml-9 md:-ml-32"><strong>: </strong>{paketInfo.kategori}</span>
          </div>
          <div className="text-md md:text-lg grid grid-cols-2">
            <strong>Paket</strong> 
            <span className="-ml-9 md:-ml-32"><strong>: </strong>{paketInfo.nama}</span>
          </div>
        </div>
        <div className="mb-6">
          <div className="text-md md:text-lg grid grid-cols-2">
            <strong>Subtotal</strong> 
            <span className="-ml-9 md:-ml-32"><strong>: </strong>{formatCurrency(invoiceData.subtotal)}</span>
          </div>
          <div className="text-md md:text-lg grid grid-cols-2">
            <strong>Diskon</strong> 
            <span className="-ml-9 md:-ml-32"><strong>: </strong>{formatCurrency(invoiceData.total_diskon)}</span>
          </div>
          <div className="text-md md:text-lg grid grid-cols-2">
            <strong>PPN (11%):</strong> 
            <span className="-ml-9 md:-ml-32"><strong>: </strong>{formatCurrency(invoiceData.ppn)}</span>
          </div>
          <div className="text-md md:text-lg grid grid-cols-2">
            <strong>Total</strong> 
            <span className="-ml-9 md:-ml-32"><strong>: </strong>{formatCurrency(invoiceData.total)}</span>
          </div>
        </div>
        <div className="mt-10 text-center">
          <p className="text-lg">
            <strong>{settingData?.profil_perusahaan}</strong>
          </p>
            <span>Advice Acounting Henika</span>
          <div className="mt-16">
            <img
              src={settingData?.url_foto_ttd}
              alt="Tanda Tangan"
              className="mx-auto h-24"
            />
            <p className="text-lg">Penerima</p>
          </div>
        </div>
      </div>
    </PelangganLayout>
  );
}
