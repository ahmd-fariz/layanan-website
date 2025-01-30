import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Head from "next/head";
import { BASE_URL } from '../../../components/layoutsAdmin/apiConfig';

export default function Register() {
  const router = useRouter();
  const [nama, setNama] = useState("");
  const [telp, setTelp] = useState("");
  const [email, setEmail] = useState("");
  const [alamat, setAlamat] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    if (!nama || !telp || !email || !alamat || !password) {
      toast.error("Semua kolom harus diisi!");
      setSubmitted(false);
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/api/pelanggan`, {
        nama,
        telp,
        email,
        alamat,
        password,
      });

      toast.success("Registrasi berhasil!");
      setTimeout(() => {
        router.push("/auth_pelanggan/login");
      }, 1500);
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Terjadi kesalahan saat registrasi!");
      setSubmitted(false);
    }
  };

  return (
    <>
      <Head>
        <title>Register</title>
      </Head>
      <section className="flex flex-col items-center mx-auto md:flex-row lg:px-28 min-h-screen bg-cyan-100 py-6">
        {/* <div className="hidden lg:block md:w-1/2 xl:w-2/3">
          <Image
            src="/images/login.svg"
            alt="Login Illustration"
            width={300}
            height={300}
            className="mt-10 w-96 ml-28"
          />
        </div> */}

        <div className="flex items-center justify-center w-full px-6 bg-white md:max-w-md lg:max-w-full md:mx-auto md:w-1/2 xl:w-1/3 lg:px-16 xl:px-12 shadow-lg sm:rounded-3xl">
          <div className="w-full h-100">
            <h1 className="mt-12 text-2xl font-extrabold leading-tight md:text-2xl text-transparent bg-clip-text bg-gradient-to-br from-[#1B1B1B] from-20% via-[#1D1D1D] via-20% to-[#A8CF45]">
              Pusat Daftar Akun
            </h1>

            <form className="mt-6" onSubmit={handleSubmit}>
              <div className="relative">
                <label className="block font-bold text-gray-700">Nama</label>
                <input
                  type="text"
                  name="nama"
                  id="nama"
                  className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-blue-500"
                  placeholder="Nama"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  required
                />
              </div>

              <div className="relative mt-4">
                <label className="block font-bold text-gray-700">Kontak</label>
                <input
                  type="number"
                  name="telp"
                  id="telp"
                  className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-blue-500"
                  placeholder="telp"
                  value={telp}
                  onChange={(e) => setTelp(e.target.value)}
                  required
                />
              </div>

              <div className="relative mt-4">
                <label className="block font-bold text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-blue-500"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="relative mt-4">
                <label className="block font-bold text-gray-700">Alamat</label>
                <input
                  type="alamat"
                  name="alamat"
                  id="alamat"
                  className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-blue-500"
                  placeholder="alamat"
                  value={alamat}
                  onChange={(e) => setAlamat(e.target.value)}
                  required
                />
              </div>

              <div className="relative mt-4">
                <label className="block font-bold text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-blue-500"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength="6"
                />
              </div>

              <button
                type="submit"
                className={`block w-full px-4 py-3 mt-6 font-semibold text-white rounded-lg bg-gradient-to-r from-lime-400 to-lime-600 hover:bg-indigo-400 focus:bg-indigo-400 ${
                  submitted ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={submitted}
              >
                {submitted ? "Mendaftar..." : "Daftar"}
              </button>
            </form>

            <hr className="my-6 border-gray-300 w-full" />

            <p className="mt-0 text-center">
              Sudah Punya Akun?
              <Link
                href={"/auth_pelanggan/login"}
                className="text-blue-500 hover:text-blue-700 font-semibold ml-1"
              >
                Masuk
              </Link>
            </p>
          </div>
        </div>
      </section>
      <ToastContainer />
    </>
  );
}
