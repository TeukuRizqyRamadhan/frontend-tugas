import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "./ui/table";
import Badge from "./ui/badge/Badge";
import { useEffect, useState } from "react";
import API from "../api/api";

type Leaderboard = {
  nama: string;
  spCount: number;
  kelas: string;
};

export default function Top5SuratPembinaan() {
  const [leaderboard, setLeaderboard] = useState<Leaderboard[]>([]);

  const fetchLeaderboard = async () => {
    try {
      const { data } = await API.get<Leaderboard[]>("/siswa/leaderboard-sp");
      setLeaderboard(data);
    } catch (error) {
      console.error("Gagal mengambil data leaderboard:", error);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Top 5 Surat Pembinaan
          </h3>
        </div>
      </div>
      <div className="max-w-full overflow-x-auto">
        {leaderboard?.length > 0 ? (
          <Table>
            {/* Table Header */}
            <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
              <TableRow>
                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  No
                </TableCell>
                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Nama Siswa
                </TableCell>
                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Kelas
                </TableCell>
                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Jumlah SP
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
              {leaderboard.map((item, index) => (
                <TableRow key={item?.nama || index}>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {index + 1}
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {item?.nama ?? "Tidak ada data"}
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {item?.kelas ?? "Tidak ada data"}
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    <Badge
                      size="sm"
                      color={
                        item.spCount >= 10
                          ? "error"
                          : item.spCount >= 5
                            ? "warning"
                            : "success"
                      }
                    >
                      {item?.spCount ?? 0}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-gray-500 mt-4">Belum ada data leaderboard SP.</p>
        )}
      </div>
    </div>
  );
}
