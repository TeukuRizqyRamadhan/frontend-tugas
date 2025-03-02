import { useEffect, useState } from "react";
import API from "../api/api";
import Badge from "./ui/badge/Badge";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "./ui/table";

type StatistikSP = {
  totalSiswa: number;
  totalSiswaKenaSP: number;
  totalSP: number;
  siswaTerbanyakSP: { nama: string; jumlahSP: number; kelas: string } | null;
};

export default function RingkasanSuratPembinaan() {
  const [statistik, setStatistik] = useState<StatistikSP | null>(null);

  const fetchStatistik = async () => {
    try {
      const { data } = await API.get<StatistikSP>("/siswa/statistik-sp");
      setStatistik(data);
    } catch (error) {
      console.error("Gagal mengambil data statistik:", error);
    }
  };

  useEffect(() => {
    fetchStatistik();
  }, []);
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Ringkasan Surat Pembinaan
          </h3>
        </div>
      </div>
      <div className="max-w-full overflow-x-auto ">
        <Table>
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y ">
            <TableRow>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Total Siswa
              </TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Total Siswa Kena SP
              </TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Total Sp Yang Diberikan
              </TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Siswa Terbanyak SP
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {statistik && (
              <TableRow>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {statistik.totalSiswa}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {statistik.totalSiswaKenaSP}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {statistik.totalSP}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {statistik.siswaTerbanyakSP ? (
                    `${statistik.siswaTerbanyakSP.nama} - ${statistik.siswaTerbanyakSP.kelas} (${statistik.siswaTerbanyakSP.jumlahSP} SP)`
                  ) : (
                    <Badge size="sm" color="warning">Belum ada</Badge>
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
