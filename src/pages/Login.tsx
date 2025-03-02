import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import { useAuthStore } from "../store/authStore";
import Swal from "sweetalert2";
import Button from "../components/ui/button/Button";
import Input from "../components/form/input/InputField";
import Label from "../components/form/Label";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const setToken = useAuthStore((state: any) => state.setToken);
    const navigate = useNavigate();

    // Cek apakah sudah login
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) navigate("/admin-dashboard");
    }, [navigate]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await API.post("/auth/login", { username, password });
            const token = response.data;
            console.log(token);

            localStorage.setItem("token", token);
            setToken(token);

            Swal.fire({
                title: "Login Berhasil!",
                text: "Selamat datang di dashboard",
                icon: "success",
                timer: 2000,
                showConfirmButton: false,
            }).then(() => {
                navigate("/admin-dashboard");
            });
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Periksa kembali username dan password Anda.";
            Swal.fire({
                title: "Login Gagal!",
                text: errorMessage,
                icon: "error",
            });
        }
    };

    return (
        <div className="flex min-h-screen w-full p-5">
            <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
                <div>
                    <div className="mb-5 sm:mb-8">
                        <img
                            className="mx-auto dark:hidden"
                            src="../src/assets/SMP.png"
                            width={300}
                            alt="Logo SMP"
                        />
                        <img
                            className="mx-auto hidden dark:block "
                            src="../src/assets/SMP-dark.png"
                            width={300}
                            alt="Logo SMP"
                        />
                    </div>
                    <form onSubmit={handleLogin}>
                        <div className="space-y-6">
                            <div>
                                <Label>
                                    Username <span className="text-error-500">*</span>
                                </Label>
                                <Input
                                    placeholder="Username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                            <div>
                                <Label>
                                    Password <span className="text-error-500">*</span>
                                </Label>
                                <div className="relative">
                                    <Input
                                        type="password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div>
                                <Button className="w-full" size="sm">
                                    Sign in
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
