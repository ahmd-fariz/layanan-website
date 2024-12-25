import { useState, useEffect } from "react";
import axios from "axios";
import Head from "next/head";
import AdminLayout from "../layouts";
import { ToastContainer, toast } from "react-toastify"; // Tambahkan import ini
import "react-toastify/dist/ReactToastify.css"; // Pastikan ini ada
import { BASE_URL } from "../../../components/layoutsAdmin/apiConfig";

export default function Invoice() {
  const [settingData, setSettingData] = useState(null);
  const [customerData, setCustomerData] = useState(null);
  const [paketData, setpaketData] = useState([]);
  const [cartPaketData, setCartPaketData] = useState([]);
  const [invoiceData, setInvoiceData] = useState({
    refrensi: "",
    tanggal: "",
    tgl_jatuh_tempo: "",
    pelanggan_id: "",
    subtotal: 0,
    total_diskon: 0,
    total: 0,
  });
  const [currentReferenceNumber, setCurrentReferenceNumber] = useState(1);

  useEffect(() => {
    fetchSettingData();
    fetchCustomerData();
    fetchpaketData();
    generateNewReference();
  }, []);

  useEffect(() => {
    // Ambil nomor referensi terakhir dari localStorage saat komponen dimuat
    const storedReferenceNumber = localStorage.getItem(
      "currentReferenceNumber"
    );
    if (storedReferenceNumber) {
      setCurrentReferenceNumber(parseInt(storedReferenceNumber, 10));
    }
  }, []);

  const generateNewReference = () => {
    const paddedNumber = String(currentReferenceNumber).padStart(3, "0");
    const newReference = `GMT ${paddedNumber}`;

    // Update data invoice
    setInvoiceData((prevData) => ({ ...prevData, refrensi: newReference }));

    // Update nomor referensi berikutnya
    const newReferenceNumber = currentReferenceNumber + 1;
    setCurrentReferenceNumber(newReferenceNumber);

    // Simpan nomor referensi ke localStorage
    localStorage.setItem("currentReferenceNumber", newReferenceNumber);
  };

  const fetchSettingData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/setting`);
      setSettingData(response.data.data[0]);
    } catch (error) {
      console.error("Error fetching setting data:", error);
    }
  };

  const fetchCustomerData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/pelanggan`);
      setCustomerData(response.data);
    } catch (error) {
      console.error("Error fetching customer data:", error);
    }
  };

  const fetchpaketData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/paket`);
      setpaketData(response.data.data || []);
    } catch (error) {
      console.error("Error fetching available packages:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInvoiceData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlePackageChange = (index, field, value) => {
    const updatedCart = [...cartPaketData];
    updatedCart[index] = { ...updatedCart[index], [field]: value };

    if (field === "id_paket") {
      const selectedPaket = paketData.find(
        (paket) => paket.id === parseInt(value)
      );
      if (selectedPaket) {
        updatedCart[index].harga = selectedPaket.harga;
        updatedCart[index].nama_paket = selectedPaket.nama_paket;
      }
    }

    setCartPaketData(updatedCart);
  };

  const addPackage = () => {
    setCartPaketData((prevData) => [
      ...prevData,
      { id_paket: "", nama_paket: "", diskon: 0, harga: 0 },
    ]);
  };

  const removePackage = (index) => {
    const updatedCart = cartPaketData.filter((_, i) => i !== index);
    setCartPaketData(updatedCart);
  };

  const calculateTotals = () => {
    const subtotal = cartPaketData.reduce(
      (sum, item) => sum + (item.harga || 0),
      0
    );

    const totalDiskon = cartPaketData.reduce(
      (sum, item) => sum + ((item.harga || 0) * (item.diskon || 0)) / 100,
      0
    );

    const total = subtotal - totalDiskon;

    setInvoiceData((prevData) => ({
      ...prevData,
      subtotal,
      total_diskon: totalDiskon,
      total,
    }));
  };

  // Fungsi untuk notif mesage
  const showToastMessage = (message) => {
    toast.success(message, {
      position: "top-right",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (cartPaketData.some((item) => !item.id_paket)) {
        alert("Semua field paket harus diisi");
        return;
      }

      const invoiceResponse = await axios.post(
        `${BASE_URL}/api/invoice`,
        invoiceData
      );

      const invoiceId = invoiceResponse.data.id;

      const updatedCart = cartPaketData.map((item) => ({
        id_invoice: invoiceId,
        id_paket: parseInt(item.id_paket),
        diskon: parseFloat(item.diskon) || 0,
        harga: parseFloat(item.harga) || 0,
      }));

      await axios.post(`${BASE_URL}/api/cartpaket/`, updatedCart, {
        headers: {
          "Content-Type": "application/json",
        },
      });

     // console.log("Invoice and cart packages saved:", invoiceResponse.data);
      showToastMessage("Invoice berhasil disimpan");

      // Increment the reference number for the next invoice
      setCurrentReferenceNumber((prevNumber) => prevNumber + 1);
      generateNewReference();
    } catch (error) {
      console.error("Error creating invoice or updating cart:", error);
      alert("Terjadi kesalahan saat menyimpan invoice: " + error.message);
    }
  };

  return (
    <>
      <AdminLayout>
        <Head>
          <title>Create Invoice</title>
        </Head>
        <div className="bg-white rounded-xl lg:-mt-40 md:-mt-40">
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Create Invoice</h1>
            {settingData && (
              <div className="mb-4">
                <h2 className="text-xl font-semibold">
                  {settingData.nama_perusahaan}
                </h2>
                <p>Alamat: {settingData.alamat}</p>
                <p>Telp: {settingData.telp}</p>
                <p>Email: {settingData.email}</p>
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block mb-2">Pelanggan</label>
                <select
                  name="pelanggan_id"
                  value={invoiceData.pelanggan_id}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Pilih Pelanggan</option>
                  {customerData &&
                    customerData.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.nama}
                      </option>
                    ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block mb-2">Refrensi</label>
                <input
                  type="text"
                  name="refrensi"
                  value={invoiceData.refrensi}
                  readOnly
                  className="w-full p-2 border rounded bg-gray-100"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Tanggal Invoice</label>
                <input
                  type="date"
                  name="tanggal"
                  value={invoiceData.tanggal}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Jatuh Tempo</label>
                <input
                  type="date"
                  name="tgl_jatuh_tempo"
                  value={invoiceData.tgl_jatuh_tempo}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Info Paket</h3>
                {cartPaketData.map((item, index) => (
                  <div key={index} className="flex mb-2 items-center">
                    <select
                      value={item.id_paket}
                      onChange={(e) =>
                        handlePackageChange(index, "id_paket", e.target.value)
                      }
                      className="w-1/3 p-2 border rounded mr-2"
                    >
                      <option value="">Pilih Paket</option>
                      {paketData.map((pkg) => (
                        <option key={pkg.id} value={pkg.id}>
                          {pkg.nama_paket}
                        </option>
                      ))}
                    </select>
                    <p className="w-1/4 p-2 bg-gray-100 rounded mr-2">
                      Harga: Rp {parseFloat(item.harga).toLocaleString("id-ID")}
                      ,00
                    </p>
                    <input
                      type="number"
                      placeholder="Diskon (%)"
                      value={item.diskon || 0}
                      onChange={(e) =>
                        handlePackageChange(
                          index,
                          "diskon",
                          e.target.value === "" ? 0 : parseFloat(e.target.value)
                        )
                      }
                      className="w-1/4 p-2 border rounded mr-2"
                    />
                    <button
                      type="button"
                      onClick={() => removePackage(index)}
                      className="bg-red-500 text-white p-2 rounded"
                    >
                      Hapus
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addPackage}
                  className="bg-blue-500 text-white p-2 rounded"
                >
                  Tambah Paket
                </button>
              </div>
              <div className="mb-4">
                <button
                  type="button"
                  onClick={calculateTotals}
                  className="bg-green-500 text-white p-2 rounded"
                >
                  Hitung Total
                </button>
              </div>
              <div className="mb-4">
                <p>
                  Subtotal: Rp{" "}
                  {parseFloat(invoiceData.subtotal).toLocaleString("id-ID")},00
                </p>
                <p>
                  Diskon: Rp{" "}
                  {parseFloat(invoiceData.total_diskon).toLocaleString("id-ID")}
                  ,00
                </p>
                <p>
                  Total: Rp{" "}
                  {parseFloat(invoiceData.total).toLocaleString("id-ID")}
                  ,00
                </p>
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-blue-500 text-white p-2 rounded"
                >
                  Simpan Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      </AdminLayout>
      <ToastContainer /> {/* Tambahkan ini di dalam return */}
    </>
  );
}
