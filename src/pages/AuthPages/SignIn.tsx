import PageMeta from "../../components/common/PageMeta";
import Login from "../../components/auth/Login";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function SignIn() {

  useEffect(() => {
    checkToken();
  }, []);
  const navigate = useNavigate();

  const checkToken = () => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/admin-dashboard");
    }
  };
  return (
    <>
      <PageMeta
        title="Login Surat Pembinaan"
        description="Login Surat Pembinaan"
      />
      <Login />
    </>
  );
}
