import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import API from "../api/api";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";

export default function DaftarTugas() {

  interface Tugas {
    id: string;
    title: string;
    createdAt: string;
  }

  interface Jawaban {
    id: string;
    name: string;
    fileUrl: string;
  }

  const [kelas, setKelas] = useState<{ id: string; name: string }[]>([]);
  const [tugas, setTugas] = useState<Tugas[]>([]);
  const [selectedKelas, setSelectedKelas] = useState<string>("");
  const [selectedTugas, setSelectedTugas] = useState<string>("");
  const [jawaban, setJawaban] = useState<Jawaban[]>([]);
  const [isValidToken, setIsValidToken] = useState(false);
  const [isGuru, setIsGuru] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await API.get("/auth/me"); // Pastikan endpoint ini benar
        if (response.data.role === "GURU") {
          setIsGuru(true);
        }
        setIsValidToken(true);
      } catch (error) {
        setIsValidToken(false);
        setIsGuru(false);
      }
    };

    checkAuth();
  }, []);

  // Fetch daftar kelas saat halaman dimuat
  useEffect(() => {
    API.get("/classes")
      .then((response) => setKelas(response.data))
      .catch((error) => console.error("Error fetching kelas:", error));
  }, []);

  // Handle perubahan kelas
  const handleKelasChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const kelasId = event.target.value;
    setSelectedKelas(kelasId);
    setSelectedTugas("");
    setJawaban([]);

    if (kelasId) {
      API.get(`/tasks?classId=${kelasId}`)
        .then((response) => {
          const sortedTasks = response.data.sort(
            (a: Tugas, b: Tugas) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
          setTugas(sortedTasks);
        })
        .catch((error) => console.error("Error fetching tugas:", error));
    } else {
      setTugas([]);
    }
  };

  // Handle perubahan tugas
  const handleTugasChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const tugasId = event.target.value;
    setSelectedTugas(tugasId);

    if (tugasId) {
      API.get(`/tasks/uploads/task/${tugasId}`)
        .then((response) => {
          setJawaban(response.data);
          console.log("Jawaban:", response.data);
        })
        .catch((error) => {
          console.error("Error fetching jawaban:", error);
        });
    } else {
      setJawaban([]);
    }
  };

  const deleteTask = async (taskId: string) => {
    Swal.fire({
      title: "Konfirmasi",
      text: "Apakah Anda yakin ingin menghapus tugas ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await API.delete(`/tasks/${taskId}`);
          setTugas((prev) => prev.filter((t) => t.id !== taskId));
          setSelectedTugas("");
          setJawaban([]);
          Swal.fire("Berhasil!", "Tugas telah dihapus.", "success");
        } catch (error) {
          Swal.fire("Gagal!", "Tidak dapat menghapus tugas.", "error");
        }
      }
    });
  };

  const deleteJawaban = async (jawabanId: string) => {
    Swal.fire({
      title: "Konfirmasi",
      text: "Apakah Anda yakin ingin menghapus jawaban ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await API.delete(`/tasks/uploads/${jawabanId}`);
          setJawaban((prev) => prev.filter((j) => j.id !== jawabanId));
          Swal.fire("Berhasil!", "Jawaban telah dihapus.", "success");
        } catch (error) {
          Swal.fire("Gagal!", "Tidak dapat menghapus jawaban.", "error");
        }
      }
    });
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

          {selectedTugas && isValidToken && isGuru && (
            <div className="mt-4 flex justify-end">
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
                onClick={() => deleteTask(selectedTugas)}
              >
                Hapus Tugas
              </button>
            </div>
          )}

          {selectedTugas && (
            <table className="w-full border-collapse mt-4">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-800">
                  <th className="border border-gray-300 dark:border-gray-700 p-2">No</th>
                  <th className="border border-gray-300 dark:border-gray-700 p-2">Nama Siswa</th>
                  {isValidToken && isGuru && (
                    <>
                      <th className="border border-gray-300 dark:border-gray-700 p-2">Jawaban</th>
                      <th className="border border-gray-300 dark:border-gray-700 p-2">Aksi</th>
                    </>
                  )}
                </tr>
              </thead>

              <tbody>
                {jawaban.length > 0 ? (
                  jawaban.map((item, index) => (
                    <tr key={item.id} className="text-center">
                      <td className="border border-gray-300 dark:border-gray-700 p-2">{index + 1}</td>
                      <td className="border border-gray-300 dark:border-gray-700 p-2">{item.name || "Tanpa Nama"}</td>

                      {isValidToken && isGuru && (
                        <>
                          <td className="border border-gray-300 dark:border-gray-700 p-2">
                            {item.fileUrl ? (
                              <a
                                href={`http://192.168.1.185:3000${item.fileUrl}`}
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
                          <td className="border border-gray-300 dark:border-gray-700 p-2">
                            <button
                              className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-700"
                              onClick={() => deleteJawaban(item.id)}
                            >
                              Hapus
                            </button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={isValidToken && isGuru ? 4 : 2} className="border border-gray-300 dark:border-gray-700 p-2 text-center">
                      Tidak ada jawaban untuk tugas ini.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div >
    </>
  );
}
