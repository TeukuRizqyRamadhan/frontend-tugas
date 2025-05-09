import { useState, useEffect } from "react";
import API from "../api/api";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import { FiArrowRight, FiLock, FiUnlock } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";

interface Assignment {
  id: number;
  title: string;
  description: string;
  fileUrl: string;
  isLocked: boolean;
}

export default function ClassDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [className, setClassName] = useState("");
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [userRole, setUserRole] = useState<string | null>(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchClassDetails = async () => {
      try {
        const classResponse = await API.get(`/classes/${id}`);
        setClassName(classResponse.data.name);

        const taskResponse = await API.get(`/tasks?classId=${id}`);
        setAssignments(taskResponse.data);
      } catch (error) {
        console.error("Gagal mengambil data kelas dan tugas:", error);
      }
    };

    const fetchUserRole = async () => {
      if (token) {
        try {
          const userResponse = await API.get("/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUserRole(userResponse.data.role);
        } catch (error) {
          console.error("Gagal mengambil data pengguna:", error);
        }
      }
    };

    fetchClassDetails();
    fetchUserRole();
  }, [id, token]);

  const toggleLock = async (taskId: number, isLocked: boolean) => {
    try {
      await API.patch(
        `/tasks/${taskId}/lock`,
        { isLocked: !isLocked },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAssignments((prev) =>
        prev.map((task) =>
          task.id === taskId ? { ...task, isLocked: !isLocked } : task
        )
      );
    } catch (error) {
      console.error("Gagal mengubah status kunci tugas:", error);
    }
  };

  return (
    <>
      <PageMeta title="Dashboard" description="Dashboard" />
      <PageBreadcrumb pageTitle="Dashboard" />

      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 p-5 lg:p-6">
        <div className="w-2xl mx-auto mb-5">
          <h1 className="text-3xl font-bold mb-6">Kelas {className}</h1>
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Daftar Tugas</h2>
            {assignments.length > 0 ? (
              assignments.map((task) => {
                const fileUrl = `${API.defaults.baseURL}${task.fileUrl.replace(
                  /\\/g,
                  "/"
                )}`;
                const fileExtension = task.fileUrl
                  .split(".")
                  .pop()
                  ?.toLowerCase();
                const isImage = [
                  "jpg",
                  "jpeg",
                  "png",
                  "gif",
                  "bmp",
                  "webp",
                ].includes(fileExtension || "");

                return (
                  <div
                    key={task.id}
                    className="border-b p-4 flex justify-between items-center"
                  >
                    <div>
                      <h3 className="text-lg font-medium flex items-center gap-2">
                        {task.title}
                        {task.isLocked ? (
                          <FiLock
                            className="text-red-500"
                            title="Tugas Dikunci"
                          />
                        ) : (
                          <FiUnlock
                            className="text-green-500"
                            title="Tugas Terbuka"
                          />
                        )}
                      </h3>
                      {/* {isImage ? (
                        <img src={fileUrl} alt="Tugas" style={{ height: "300px" }} />
                      ) : (
                        <a
                          href={fileUrl}
                          download
                          className="mt-2 inline-block px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                        >
                          Download File
                        </a>
                      )} */}
                      <p className="text-gray-500">
                        Catatan: {task.description}
                      </p>
                    </div>
                    <div className="flex gap-3">
                      {task.isLocked ? (
                        <button
                          className="flex items-center gap-2 px-4 py-2 bg-gray-400 text-gray-700 rounded-md cursor-not-allowed"
                          disabled
                        >
                          Upload Disini <FiArrowRight />
                        </button>
                      ) : (
                        <button
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                          onClick={() => navigate(`/tasks/${task.id}`)}
                        >
                          Upload Disini <FiArrowRight />
                        </button>
                      )}

                      {userRole === "GURU" && token && (
                        <button
                          className={`flex items-center gap-2 px-4 py-2 ${task.isLocked
                              ? "bg-red-600 hover:bg-red-700"
                              : "bg-green-600 hover:bg-green-700"
                            } text-white rounded-md`}
                          onClick={() => toggleLock(task.id, task.isLocked)}
                        >
                          {task.isLocked ? <FiUnlock /> : <FiLock />}{" "}
                          {task.isLocked ? "Buka" : "Kunci"}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500">Tidak ada tugas untuk kelas ini.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
