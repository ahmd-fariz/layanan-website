import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import "@/styles/globals.css";
import NextTopLoader from "nextjs-toploader";
import "@/styles/tailwind.css";
import Head from "next/head";
import ButtonWa from "@/components/elements/ButtonWa";
export default function App({ Component, pageProps, router }) {
    const isInsideAdmin = router.pathname.startsWith("/admin");
    const isInsidePelanggan = router.pathname.startsWith("/pelanggan");
    const isLoginPage = router.pathname === "/auth/login"; // Tambahkan kondisi untuk halaman login
    const isLoginPelanggan = router.pathname === "/auth_pelanggan/login"; // Tambahkan kondisi untuk halaman login

    if (isInsideAdmin || isInsidePelanggan || isLoginPage || isLoginPelanggan) {
        // Perbarui kondisi untuk mengembalikan hanya komponen
        return <Component {...pageProps }
        />;
    }

    // Jika tidak berada di dalam folder admin atau halaman login, tampilkan Navbar dan Footer
    return ( <
        div className = "overflow-x-hidden" >
        <
        Head >
        <
        title > GMT SOFT DEVELOPMENT < /title>{" "} <
        meta name = "description"
        content = "Jasa Pembuatan Website" / >
        <
        /Head>{" "} <
        NextTopLoader color = "#A8CF45" / >
        <
        Navbar / >
        <
        Component {...pageProps }
        /> <ButtonWa / >
        <
        Footer / >
        <
        /div>
    );
}