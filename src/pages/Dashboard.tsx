import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import API from "../api/api";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import { FiLock, FiUnlock } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

interface ClassData {
  id: number;
  name: string;
  isLocked: boolean;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [classes, setClasses] = useState<ClassData[]>([]);

  useEffect(() => {

    fetchClasses();
  }, [navigate]);

  const fetchClasses = async () => {
    try {
      const response = await API.get("/classes", {
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

  return (
    <>
      <PageMeta title="Dashboard" description="Dashboard" />
      <PageBreadcrumb pageTitle="Dashboard" />

      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 p-5 lg:p-6">
        <div className="max-w-2xl mx-auto">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {classes.map((kelas) => (
              <div
                key={kelas.id}
                className={`p-6 bg-white rounded-lg shadow-md transition-all duration-300 transform
                            hover:scale-105 hover:shadow-lg flex flex-col items-center justify-center text-center 
                            ${kelas.isLocked ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
                onClick={() => !kelas.isLocked && navigate(`/kelas/${kelas.id}`)}
              >
                <h2 className="text-2xl font-semibold">{kelas.name}</h2>
                {kelas.isLocked ? (
                  <FiLock className="text-red-500 text-3xl mt-3" />
                ) : (
                  <FiUnlock className="text-green-500 text-3xl mt-3" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
