import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import API from "../api/api";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import { useNavigate } from "react-router-dom";

export default function DaftarTugas() {
  const [kelas, setKelas] = useState([]); // Menyimpan daftar kelas
  const [tugas, setTugas] = useState([]); // Menyimpan daftar tugas berdasarkan kelas
  const [selectedKelas, setSelectedKelas] = useState(""); // ID kelas yang dipilih
  const [selectedTugas, setSelectedTugas] = useState(""); // ID tugas yang dipilih
  const [jawaban, setJawaban] = useState([]); // Menyimpan daftar jawaban siswa

  // Fetch daftar kelas saat halaman dimuat
  useEffect(() => {
    API.get("/classes")
      .then((response) => setKelas(response.data))
      .catch((error) => console.error("Error fetching kelas:", error));
  }, []);

  // Handle perubahan kelas
  const handleKelasChange = (event) => {
    const kelasId = event.target.value;
    setSelectedKelas(kelasId);
    setSelectedTugas(""); // Reset pilihan tugas
    setJawaban([]); // Reset jawaban

    if (kelasId) {
      API.get(`/tasks?classId=${kelasId}`) // Perbaiki query param jadi "classId"
        .then((response) => {
          const sortedTasks = response.data.sort(
            (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
          );
          setTugas(sortedTasks);
        })
        .catch((error) => console.error("Error fetching tugas:", error));
    } else {
      setTugas([]);
    }
  };

  // Handle perubahan tugas
  const handleTugasChange = (event) => {
    const tugasId = event.target.value;
    setSelectedTugas(tugasId);

    if (tugasId) {
      API.get(`/tasks/uploads/task/${tugasId}`) // Fetch jawaban siswa berdasarkan tugas
        .then((response) => {
          setJawaban(response.data); // Menyimpan daftar jawaban
          console.log("Jawaban:", response.data);
        })
        .catch((error) => {
          console.error("Error fetching jawaban:", error);
        });
    } else {
      setJawaban([]);
    }
  };


  return (
    <>
      <PageMeta title="Daftar Tugas" description="Daftar Tugas" />
      <PageBreadcrumb pageTitle="Daftar Tugas" />

      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 p-5 lg:p-6">
        <div className="max-w-2xl mx-auto">
          {/* Pilih Kelas */}
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Pilih Kelas:</label>
          <select
            value={selectedKelas}
            onChange={handleKelasChange}
            className="mt-2 p-2 border rounded w-full dark:bg-gray-800 dark:text-white"
          >
            <option value="">-- Pilih Kelas --</option>
            {kelas.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>

          {/* Pilih Tugas */}
          {selectedKelas && (
            <>
              <label className="block mt-4 text-sm font-medium text-gray-700 dark:text-gray-300">Pilih Tugas:</label>
              <select
                value={selectedTugas}
                onChange={handleTugasChange}
                className="mt-2 p-2 border rounded w-full dark:bg-gray-800 dark:text-white"
              >
                <option value="">-- Pilih Tugas --</option>
                {tugas.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.title}
                  </option>
                ))}
              </select>
            </>
          )}

          {/* Tabel Jawaban Siswa */}
          {selectedTugas && (
            <table className="mt-4 w-full border-collapse border border-gray-300 dark:border-gray-700">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-800">
                  <th className="border border-gray-300 dark:border-gray-700 p-2">Nama Siswa</th>
                  <th className="border border-gray-300 dark:border-gray-700 p-2">Jawaban</th>
                </tr>
              </thead>
              <tbody>
                {jawaban.length > 0 ? (
                  jawaban.map((item) => (
                    <tr key={item.id} className="text-center">
                      <td className="border border-gray-300 dark:border-gray-700 p-2">{item.name || "Tanpa Nama"}</td>
                      <td className="border border-gray-300 dark:border-gray-700 p-2">
                        {item.fileUrl ? (
                          <a
                            href={`http://192.168.1.185:3000${item.fileUrl}`} // Pastikan URL benar
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline"
                          >
                            Lihat Jawaban
                          </a>
                        ) : (
                          "Belum ada jawaban"
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2" className="border border-gray-300 dark:border-gray-700 p-2 text-center">
                      Tidak ada jawaban untuk tugas ini.
                    </td>
                  </tr>
                )}

              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
