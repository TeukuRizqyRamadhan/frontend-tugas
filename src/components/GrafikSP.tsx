import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useState, useEffect } from "react";
import API from "../api/api"; // Sesuaikan dengan path API-mu
import { Dropdown } from "../components/ui/dropdown/Dropdown";
import { DropdownItem } from "../components/ui/dropdown/DropdownItem";
import { MoreDotIcon } from "../icons"; // Pastikan Anda memiliki ikon ini

export default function GrafikSP() {
  const [series, setSeries] = useState([{ name: "Surat Pembinaan", data: Array(12).fill(0) }]);
  const [filter, setFilter] = useState("bulan"); // Default filter: Bulanan
  const [categories, setCategories] = useState(["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]);
  const [isOpen, setIsOpen] = useState(false); // State untuk dropdown

  useEffect(() => {
    fetchSPData();
  }, [filter]); // Ambil data setiap kali filter berubah

  const fetchSPData = async () => {
    try {
      const { data } = await API.get(`/siswa/sp-grafik?filter=${filter}`); // Endpoint menyesuaikan filter
      processData(data);
    } catch (error) {
      console.error("Gagal mengambil data Surat Pembinaan:", error);
    }
  };

  const processData = (data: any[]) => {
    if (filter === "hari") {
      // SP Harian (7 hari terakhir)
      const dailyData = Array(7).fill(0);
      const today = new Date();
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(today.getDate() - i);
        return date.toISOString().split("T")[0]; // Format YYYY-MM-DD
      }).reverse();

      data.forEach((item) => {
        const itemDate = item.tanggal.split("T")[0]; // Ambil YYYY-MM-DD
        const index = last7Days.indexOf(itemDate);
        if (index !== -1) {
          dailyData[index] += 1;
        }
      });

      setCategories(last7Days);
      setSeries([{ name: "Surat Pembinaan", data: dailyData }]);
    } else if (filter === "bulan") {
      // SP Bulanan (12 bulan)
      const monthlyData = Array(12).fill(0);
      data.forEach((item) => {
        const month = new Date(item.tanggal).getMonth(); // Ambil bulan (0-11)
        monthlyData[month] += 1;
      });

      setCategories(["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]);
      setSeries([{ name: "Surat Pembinaan", data: monthlyData }]);
    } else if (filter === "tahun") {
      // SP Tahunan (5 tahun terakhir)
      const yearData: { [key: string]: number } = {};
      const currentYear = new Date().getFullYear();
      const last5Years = Array.from({ length: 5 }, (_, i) => (currentYear - i).toString()).reverse();

      last5Years.forEach((year) => (yearData[year] = 0));

      data.forEach((item) => {
        const year = new Date(item.tanggal).getFullYear().toString();
        if (yearData[year] !== undefined) {
          yearData[year] += 1;
        }
      });

      setCategories(last5Years);
      setSeries([{ name: "Surat Pembinaan", data: Object.values(yearData) }]);
    }
  };

  const options: ApexOptions = {
    colors: ["#465fff"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 220,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "80%",
        borderRadius: 5,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: { enabled: false },
    stroke: { show: true, width: 4, colors: ["transparent"] },
    xaxis: {
      categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Outfit",
    },
    grid: { yaxis: { lines: { show: true } } },
    fill: { opacity: 1 },
    tooltip: {
      y: { formatter: (val: number) => `${val} SP` },
    },
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
    closeDropdown();
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Grafik Surat Pembinaan</h3>
        <div className="relative inline-block">
          <button className="dropdown-toggle" onClick={toggleDropdown}>
            <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 size-6" />
          </button>
          <Dropdown isOpen={isOpen} onClose={closeDropdown} className="w-40 p-2">
            <DropdownItem onItemClick={() => handleFilterChange("hari")} className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300">
              Harian
            </DropdownItem>
            <DropdownItem onItemClick={() => handleFilterChange("bulan")} className="flex w-full font-normal text-left text-gray-500 rounded lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300">
              Bulanan
            </DropdownItem>
            <DropdownItem onItemClick={() => handleFilterChange("tahun")} className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300">
              Tahunan
            </DropdownItem>
          </Dropdown>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="-ml-5 min-w-[650px] xl:min-w-full pl-2">
          <Chart options={options} series={series} type="bar" height={220} />
        </div>
      </div>
    </div>
  );
}