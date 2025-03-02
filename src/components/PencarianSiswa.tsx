import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import API from "../api/api";

type Siswa = {
  id: string;
  nama: string;
  kelas: string;
};

export default function PencarianSiswa() {
  const [nama, setNama] = useState("");
  const [hasil, setHasil] = useState<Siswa[]>([]);
  const [selectedSiswa, setSelectedSiswa] = useState<Siswa | null>(null);
  const [keterangan, setKeterangan] = useState("");
  const [jenisPelanggaran, setJenisPelanggaran] = useState("");
  const navigate = useNavigate();

  const cariSiswa = async (keyword: string) => {
    setNama(keyword);
    if (keyword.length > 1) {
      try {
        const { data } = await API.get<Siswa[]>(
          `/siswa/search?nama=${keyword}`
        );
        setHasil(data);
      } catch (error) {
        console.error("Error fetching siswa:", error);
      }
    } else {
      setHasil([]);
    }
  };

  const handleBuatSP = async () => {
    if (!selectedSiswa) {
      return Swal.fire(
        "Peringatan!",
        "Silakan pilih siswa terlebih dahulu.",
        "warning"
      );
    }
    if (!jenisPelanggaran) {
      return Swal.fire(
        "Peringatan!",
        "Silakan pilih jenis pelanggaran.",
        "warning"
      );
    }
    if (!keterangan.trim()) {
      return Swal.fire(
        "Peringatan!",
        "Keterangan tidak boleh kosong!",
        "warning"
      );
    }

    try {
      const result = await Swal.fire({
        title: "Konfirmasi",
        text: `Anda yakin ingin membuat Surat Pembinaan untuk ${selectedSiswa.nama}?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Ya, Buat SP",
        cancelButtonText: "Batal",
      });

      if (result.isConfirmed) {
        await API.post("/siswa/sp", {
          siswaId: selectedSiswa.id,
          jenisPelanggaran,
          keterangan,
        });

        Swal.fire(
          "Berhasil!",
          "Surat Pembinaan berhasil dibuat.",
          "success"
        ).then(() => {
          window.location.reload();
        });
      }
    } catch (error) {
      console.error("Error membuat SP:", error);
      Swal.fire("Terjadi Kesalahan", "Gagal membuat Surat Pembinaan.", "error");
    }
  };

  const cekSP = () => {
    if (!selectedSiswa) return;
    navigate(
      `detail-siswa/${selectedSiswa.id}/${selectedSiswa.nama}/${selectedSiswa.kelas}`
    );
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-6 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
        Pencarian Siswa
      </h3>
      <p className="text-gray-500 text-sm mb-4">
        Masukkan nama siswa untuk mencari data
      </p>

      <input
        type="text"
        className="border p-2 w-full rounded-lg focus:ring-2 focus:ring-blue-400 outline-none dark:bg-gray-800 dark:text-white"
        placeholder="Cari siswa..."
        value={nama}
        onChange={(e) => cariSiswa(e.target.value)}
      />

      {hasil.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold dark:text-white">
            Hasil Pencarian
          </h3>
          <ul className="mt-2 space-y-2">
            {hasil.map((siswa) => (
              <li
                key={siswa.id}
                className="border rounded-lg p-3 cursor-pointer transition-all"
              >
                <div
                  className={`flex justify-between items-center p-2 rounded-lg ${
                    selectedSiswa?.id === siswa.id
                      ? "bg-blue-200 text-blue-800 dark:bg-gray-800"
                      : "hover:bg-blue-100 dark:hover:bg-gray-800"
                  }`}
                  onClick={() =>
                    setSelectedSiswa(
                      selectedSiswa?.id === siswa.id ? null : siswa
                    )
                  }
                >
                  <span className="font-semibold dark:text-white">
                    {siswa.nama} - {siswa.kelas}
                  </span>
                </div>

                {selectedSiswa?.id === siswa.id && (
                  <div className="mt-2 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
                    <h3 className="text-lg font-semibold mb-2 dark:text-white">
                      Buat Surat Pembinaan
                    </h3>
                    <label className="block mb-2 dark:text-white">
                      Jenis Pelanggaran:
                    </label>
                    <div className="flex flex-col md:flex-row gap-3 mb-2 dark:text-white">
                      {["Keterlambatan", "Ketertiban", "Penampilan"].map(
                        (item) => (
                          <label key={item} className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="jenisPelanggaran"
                              value={item}
                              onChange={(e) =>
                                setJenisPelanggaran(e.target.value)
                              }
                            />
                            {item}
                          </label>
                        )
                      )}
                    </div>
                    <input
                      type="text"
                      className="border p-2 w-full rounded-lg focus:ring-2 focus:ring-blue-400 outline-none dark:bg-gray-800 dark:text-white"
                      placeholder="Keterangan..."
                      value={keterangan}
                      onChange={(e) => setKeterangan(e.target.value)}
                    />
                    <button
                      className="mt-3 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition-all"
                      onClick={handleBuatSP}
                    >
                      Buat SP
                    </button>
                    <button
                      className="mt-3 w-full bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg transition-all"
                      onClick={cekSP}
                      onMouseEnter={(e) =>
                        ((e.target as HTMLButtonElement).style.cursor =
                          "pointer")
                      }
                    >
                      Cek Jumlah SP
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
