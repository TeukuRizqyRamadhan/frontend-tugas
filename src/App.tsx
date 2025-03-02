import { BrowserRouter as Router, Routes, Route } from "react-router";
import NotFound from "./pages/OtherPage/NotFound";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import ClassDetail from "./pages/ClassDetail";
import AdminDashboard from "./pages/AdminDashboard";
import Task from "./pages/Task";
import DaftarTugas from "./pages/DaftarTugas";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<Login />} />
            <Route path="/kelas/:id" element={<ClassDetail />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/tasks/:id" element={<Task />} />
            <Route path="/daftar-tugas" element={<DaftarTugas />} />
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
