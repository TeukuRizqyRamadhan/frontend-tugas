import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import API from "../api/api";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import { FiFile, FiLock, FiUnlock, FiUpload } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

interface ClassData {
  id: number;
  name: string;
  isLocked: boolean;
}

export default function AdminDashboard() {
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [titles, setTitles] = useState<{ [key: number]: string }>({});
  const [descriptions, setDescriptions] = useState<{ [key: number]: string }>({});
  const [selectedFiles, setSelectedFiles] = useState<{ [key: number]: File | null }>({});
  const [fileNames, setFileNames] = useState<{ [key: number]: string }>({}); // ✅ Untuk preview nama file
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    if (!token) {
      Swal.fire({
        title: "Akses Ditolak!",
        text: "Silakan login terlebih dahulu.",
        icon: "error",
      }).then(() => navigate("/admin"));
      return;
    }
    fetchClasses();
  }, [token, navigate]);

  const fetchClasses = async () => {
    try {
      const response = await API.get("/classes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClasses(response.data);
    } catch (error) {
      Swal.fire({
        title: "Gagal Memuat Kelas!",
        text: "Terjadi kesalahan saat mengambil data kelas.",
        icon: "error",
      });
    }
  };

  const toggleLock = async (id: number, isLocked: boolean) => {
    try {
      await API.patch(
        `/classes/${id}/lock`,
        { isLocked: !isLocked },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setClasses((prev) =>
        prev.map((cls) => (cls.id === id ? { ...cls, isLocked: !cls.isLocked } : cls))
      );
      Swal.fire({
        title: "Berhasil!",
        text: `Kelas ${isLocked ? "dibuka" : "dikunci"}.`,
        icon: "success",
      });
    } catch (error) {
      Swal.fire({
        title: "Gagal!",
        text: "Terjadi kesalahan saat mengubah status kelas.",
        icon: "error",
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, classId: number) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setSelectedFiles((prev) => ({ ...prev, [classId]: file }));
      setFileNames((prev) => ({ ...prev, [classId]: file.name })); // ✅ Simpan nama file
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    classId: number,
    field: "title" | "description"
  ) => {
    if (field === "title") {
      setTitles((prev) => ({ ...prev, [classId]: e.target.value }));
    } else {
      setDescriptions((prev) => ({ ...prev, [classId]: e.target.value }));
    }
  };

  const uploadAssignment = async (classId: number) => {
    if (!titles[classId] || !descriptions[classId] || !selectedFiles[classId]) {
      Swal.fire({
        title: "Peringatan!",
        text: "Judul, deskripsi, dan file wajib diisi.",
        icon: "warning",
      });
      return;
    }

    const formData = new FormData();
    formData.append("title", titles[classId]);
    formData.append("description", descriptions[classId]);
    formData.append("file", selectedFiles[classId]!); // ✅ Pastikan ini sesuai dengan backend
    formData.append("classId", classId.toString());

    console.log("Mengirim FormData:");
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    try {
      const response = await API.post(`/tasks`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Response dari server:", response.data);
      Swal.fire({ title: "Berhasil!", text: "Tugas berhasil diunggah.", icon: "success" });

      setTitles((prev) => ({ ...prev, [classId]: "" }));
      setDescriptions((prev) => ({ ...prev, [classId]: "" }));
      setSelectedFiles((prev) => ({ ...prev, [classId]: null }));
      setFileNames((prev) => ({ ...prev, [classId]: "" }));
    } catch (error) {
      console.error("Error saat upload:", error);
      Swal.fire({ title: "Gagal!", text: "Terjadi kesalahan saat upload tugas.", icon: "error" });
    }
  };

  return (
    <>
      <PageMeta title="Dashboard" description="Dashboard" />
      <PageBreadcrumb pageTitle="Dashboard" />

      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 p-5 lg:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((cls) => (
            <div
              key={cls.id}
              className="p-6 bg-white rounded-lg shadow-md border border-gray-300"
            >
              <div className="flex justify-between items-center mb-4">
                <span className="font-semibold text-lg">{cls.name}</span>
                <button
                  className="px-4 py-2 text-white rounded flex items-center gap-2 bg-gray-700 hover:bg-gray-900"
                  onClick={() => toggleLock(cls.id, cls.isLocked)}
                >
                  {cls.isLocked ? <FiLock className="text-red-400" /> : <FiUnlock className="text-green-400" />}
                  {cls.isLocked ? "Terkunci" : "Terbuka"}
                </button>
              </div>

              <input
                type="text"
                placeholder="Judul Tugas..."
                className="border p-3 rounded w-full mb-2"
                value={titles[cls.id] || ""}
                onChange={(e) => handleInputChange(e, cls.id, "title")}
              />

              <input
                type="text"
                placeholder="Tambahkan keterangan..."
                className="border p-3 rounded w-full mb-2"
                value={descriptions[cls.id] || ""}
                onChange={(e) => handleInputChange(e, cls.id, "description")}
              />

              <label htmlFor={`upload-${cls.id}`} className="cursor-pointer px-4 py-2 bg-blue-500 text-white rounded flex items-center gap-2 hover:bg-blue-600">
                <FiUpload /> Pilih File
              </label>
              <input type="file" className="hidden" id={`upload-${cls.id}`} onChange={(e) => handleFileChange(e, cls.id)} />

              {fileNames[cls.id] && <p className="mt-2 text-sm text-gray-600"><FiFile /> {fileNames[cls.id]}</p>}

              <button className="mt-4 px-4 py-2 bg-green-500 text-white rounded w-full hover:bg-green-600" onClick={() => uploadAssignment(cls.id)}>
                Upload
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
