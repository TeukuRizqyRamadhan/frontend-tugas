import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import { useState } from "react";
import API from "../api/api";
import Swal from "sweetalert2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, getYear } from "date-fns";
import "../assets/styles/style.css"; // Tambahkan ini

export default function ExportSP() {
  const [filter, setFilter] = useState("hari");
  const [date, setDate] = useState<Date | null>(null);

  const validateDate = () => {
    if (!date) {
      Swal.fire("Peringatan!", "Silakan pilih rentang waktu sebelum mengekspor.", "warning");
      return false;
    }
    return true;
  };

  const handleExport = async (type: string) => {
    if (!validateDate()) return;

    const formattedDate = filter === "tahun" ? getYear(date!) : format(date!, filter === "bulan" ? "yyyy-MM" : "yyyy-MM-dd");

    try {
      const response = await API.get(`/siswa/export-${type}`, {
        params: { filter, date: formattedDate },
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `data-${filter}-${formattedDate}.${type === "sp" ? "csv" : "xlsx"}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      Swal.fire("Sukses!", "Data berhasil diekspor!", "success");
    } catch (error) {
      Swal.fire("Gagal!", "Terjadi kesalahan saat mengekspor data.", "error");
    }
  };

  return (
    <>
      <PageMeta title="Export Data" description="Export Data" />
      <PageBreadcrumb pageTitle="Export Data" />
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 p-5 lg:p-6">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl font-bold mb-2 dark:text-white">Export Data Surat Pembinaan</h2>
          <p className="text-gray-600 mb-4 dark:text-gray-400">Silakan pilih rentang waktu</p>

          <div className="mt-2 flex flex-col gap-2">
            <select className="border p-2 w-full dark:bg-gray-800 dark:text-white" value={filter} onChange={(e) => { setFilter(e.target.value); setDate(null); }}>
              <option value="hari">Per Hari</option>
              <option value="bulan">Per Bulan</option>
              <option value="tahun">Per Tahun</option>
            </select>

            {filter === "hari" && (
              <DatePicker
                selected={date}
                onChange={(date) => setDate(date)}
                dateFormat="yyyy-MM-dd"
                className="border p-2 w-full dark:bg-gray-800 dark:text-white"
                placeholderText="Pilih Tanggal"
              />
            )}
            {filter === "bulan" && (
              <DatePicker
                selected={date}
                onChange={(date) => setDate(date)}
                dateFormat="yyyy-MM"
                showMonthYearPicker
                className="border p-2 w-full dark:bg-gray-800 dark:text-white"
                placeholderText="Pilih Bulan"
              />
            )}
            {filter === "tahun" && (
              <DatePicker
                selected={date}
                onChange={(date) => setDate(date)}
                dateFormat="yyyy"
                showYearPicker
                className="border p-2 w-full dark:bg-gray-800 dark:text-white"
                placeholderText="Pilih Tahun"
              />
            )}
          </div>

          <div className="flex justify-end mt-4">
            <button onClick={() => handleExport("sp")} className="bg-blue-500 text-white px-4 py-2 ml-2 rounded hover:bg-blue-600 transition">Export CSV</button>
            <button onClick={() => handleExport("excel")} className="bg-green-500 text-white px-4 py-2 ml-2 rounded hover:bg-green-600 transition">Export Excel</button>
          </div>
        </div>
      </div>
    </>
  );
}
