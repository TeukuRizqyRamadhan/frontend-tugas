import PageMeta from "../../components/common/PageMeta";
import RingkasanSuratPembinaan from "../../components/RingkasanSuratPembinaan";
import GrafikSP from "../../components/GrafikSP";
import Top5SuratPembinaan from "../../components/Top5SuratPembinaan";
import PencarianSiswa from "../../components/PencarianSiswa";
import Informasi from "../../components/Informasi";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkTokenExpiration = () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/"); // Jika token tidak ada, langsung arahkan ke halaman login
        return;
      }

      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const currentTime = Math.floor(Date.now() / 1000);

        if (payload.exp < currentTime) {
          localStorage.removeItem("token"); // Hapus token yang expired
          console.log("Token telah kadaluarsa, dihapus dari localStorage.");
          navigate("/"); // Arahkan ke halaman login
        }
      } catch (error) {
        console.error("Gagal mengecek token:", error);
        localStorage.removeItem("token"); // Jika gagal parse, hapus token
        navigate("/");
      }
    };

    checkTokenExpiration(); // Panggil saat komponen dimuat

    const interval = setInterval(checkTokenExpiration, 5000); // Cek setiap 5 detik

    return () => clearInterval(interval); // Hapus interval saat komponen unmount
  }, [navigate]); // Pastikan useEffect berjalan setiap navigasi berubah

  return (
    <>
      <PageMeta title="Surat Pembinaan" description="Surat Pembinaan" />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12">
          <PencarianSiswa />
        </div>
        <div className="col-span-12 space-y-6 xl:col-span-7">
          <RingkasanSuratPembinaan />
          <GrafikSP />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <Top5SuratPembinaan />
          <Informasi />
        </div>

      </div>
    </>
  );
}
