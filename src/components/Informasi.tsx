export default function Informasi() {
  const now = new Date();
  const formattedDate = now.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const formattedTime = now.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "Asia/Jakarta",
  });

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 mt-5">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          📅 Informasi Terbaru
        </h2>
      </div>
      <p className="text-gray-700 dark:text-gray-300 text-sm">
        🔹 Data terbaru telah diperbarui pada{" "}
        <span className="font-semibold">
          {formattedDate} - {formattedTime} WIB
        </span>
        .
      </p>
      <p className="text-gray-700 dark:text-gray-300 text-sm mt-2">
        📌 Catatan: Pengumpulan data di website ini telah dimulai sejak{" "}
        <span className="font-semibold">12 Februari 2025</span>.
      </p>
    </div>
  );
}
