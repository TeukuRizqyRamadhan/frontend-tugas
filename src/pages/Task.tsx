import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import API from "../api/api";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import { FiUploadCloud } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";

interface TaskData {
  class: {
    name: string
    note?: string
  }
  title: string;
  description: string;
  fileUrl: string;
}

export default function Task() {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [taskData, setTaskData] = useState<TaskData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        const response = await API.get(`/tasks/${id}`);
        setTaskData(response.data);
        console.log(response)
      } catch (error) {
        console.error("Gagal mengambil data tugas:", error);
      }
    };

    fetchTaskDetails();
  }, [id]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!name || !selectedFile) {
      alert("Silakan masukkan nama dan pilih file sebelum mengunggah.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("file", selectedFile);
    formData.append("note", note);
    formData.append("taskId", id as string); // Menggunakan taskId dari URL

    try {
      const response = await API.post("/upload", formData);
      console.log("Response dari server:", response.data);

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "File berhasil diunggah.",
      }).then(() => {
        navigate("/dashboard");
      })
        ;

      setName("");
      setSelectedFile(null);
    } catch (error) {
      console.error("Error saat mengunggah:", error);
      alert("Terjadi kesalahan saat mengunggah.");
    }
  };

  return (
    <>
      <PageMeta title="Dashboard" description="Dashboard" />
      <PageBreadcrumb pageTitle="Dashboard" />

      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 p-5 lg:p-6">
        <div className="w-2xl mx-auto mb-5">

          <div className="flex flex-col">
            {taskData ? (
              <> <div className="header">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">
                  Kelas: {taskData.class.name}
                </h1>
                <h1 className="text-3xl font-bold text-gray-800 mb-6">
                  Tugas: {taskData.title}
                </h1>
                <p className="text-gray-600 mb-4">Catatan: {taskData.description}</p>
              </div>

                <div className="">


                  {/* Tampilkan file tugas jika ada */}
                  {taskData.fileUrl && (() => {
                    const fileUrl = `${API.defaults.baseURL}${taskData.fileUrl.replace(/\\/g, "/")}`;
                    const fileExtension = taskData.fileUrl.split('.').pop()?.toLowerCase();
                    const isImage = ["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(fileExtension || "");

                    return isImage ? (
                      <img src={fileUrl} alt="Tugas" style={{ height: "300px" }} className="mb-4 rounded-lg shadow" />
                    ) : (
                      <a
                        href={fileUrl}
                        download
                        className="mb-4 inline-block px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                      >
                        Download File Tugas
                      </a>
                    );
                  })()}
                </div>

                {/* Card untuk upload tugas */}
                <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl">
                  <h2 className="text-xl font-semibold mb-4">Upload Tugas</h2>

                  <input
                    type="text"
                    placeholder="Masukkan Nama Anda"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 border rounded-lg mb-4"
                  />
                  <input
                    type="text"
                    placeholder="Masukkan Keterangan"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full p-2 border rounded-lg mb-4"
                  />

                  <input type="file" className="hidden" id="fileUpload" onChange={handleFileChange} />
                  <label
                    htmlFor="fileUpload"
                    className="cursor-pointer flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-400 rounded-lg text-gray-600 hover:bg-gray-100"
                  >
                    <FiUploadCloud className="text-2xl" />
                    <span>{selectedFile ? selectedFile.name : "Pilih file untuk diunggah"}</span>
                  </label>

                  {selectedFile && (
                    <p className="mt-4 text-green-600 font-medium">File terpilih: {selectedFile.name}</p>
                  )}

                  <button
                    onClick={handleSubmit}
                    className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                  >
                    Unggah Tugas
                  </button>
                </div>
              </>
            ) : (
              <p className="text-gray-500">Memuat data tugas...</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
