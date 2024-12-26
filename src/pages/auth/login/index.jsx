import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useRouter } from "next/router";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import Head from "next/head";
import { BASE_URL } from "../../../components/layoutsAdmin/apiConfig";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cookies, setCookie] = useCookies(["token"]);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false); // State untuk melacak apakah formulir sudah dikirimkan
  const [showPassword, setShowPassword] = useState(false); // State untuk mengontrol visibilitas password
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true); // Menandai bahwa formulir sudah dikirimkan

    if (!email || email.includes('%') || email.includes('$')) {
        setError("Email tidak boleh mengandung karakter % atau $.");
        toast.error("Email tidak boleh mengandung karakter % atau $.", {
            position: "top-right",
        });
        return;
    }
    if (!password) {
        toast.error("Password wajib diisi!", {
            position: "top-right",
        });
        return;
    }
    
    try {
      const response = await axios.post(`${BASE_URL}/api/auth/login`, {
        email,
        password,
      });

      setCookie("token", response.data.token, { path: "/" });
      router.push("/admin/paket");
    } catch (error) {
      console.error("Login error:", error);
      showToastMessage();
    }
  };
  const showToastMessage = () => {
    toast.error("Email atau password salah !", {
      position: "top-right",
    });
  };
  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <div className="font-[sans-serif] bg-gray-100">
        <div className="grid md:grid-cols-2 lg:grid-cols-2 items-center lg:gap-0 gap-4">
          <div className="hidden md:block h-screen">
            <img src="/images/rb_399.png" className="w-full h-full object-cover my-12" alt="login-image" />
          </div>

          <form className="lg:col-span-1 max-w-lg w-full p-6 mx-auto" onSubmit={handleSubmit}>
            <div className="mb-12">
              <h3 className="text-gray-800 text-4xl font-extrabold">Sign in</h3>
              <p className="text-gray-800 text-sm mt-6">Don't have an account <a href="javascript:void(0);" className="text-blue-600 font-semibold hover:underline ml-1 whitespace-nowrap">Register here</a></p>
            </div>

            <div>
              <label className="text-gray-800 text-sm block mb-2">Email</label>
              <div className="relative flex items-center">
                <input
                  name="email"
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-transparent w-full text-sm text-gray-800 border-b border-gray-300 focus:border-blue-600 px-2 py-3 outline-none"
                  placeholder="Enter email"
                />
                {/* ... existing SVG icon ... */}
              </div>
            </div>

            <div className="mt-8">
              <label className="text-gray-800 text-sm block mb-2">Password</label>
              <div className="relative flex items-center">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-transparent w-full text-sm text-gray-800 border-b border-gray-300 focus:border-blue-600 px-2 py-3 outline-none"
                  placeholder="Enter password"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                >
                  {showPassword ? <i className="fas fa-eye-slash"></i> : <i className="fas fa-eye"></i>}
                </button>
                {/* ... existing SVG icon ... */}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 mt-6">
              <div className="flex items-center">
                <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 shrink-0 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                <label htmlFor="remember-me" className="text-gray-800 ml-3 block text-sm">Remember me</label>
              </div>
              <div>
                <a href="javascript:void(0);" className="text-blue-600 text-sm font-semibold hover:underline">Forgot Password?</a>
              </div>
            </div>

            <div className="mt-8">
              <button type="submit" className="w-full py-2.5 px-5 text-sm tracking-wide rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none">
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
