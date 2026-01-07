"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff, Lock, Mail, Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { setCookie } from "cookies-next";
import axios from "axios";

export default function AdminLoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

            const response = await axios.post(`${apiUrl}/admins/login`, {
                email: formData.email,
                password: formData.password,
            });

            if (response.data.success) {
                toast.success("Login Berhasil", {
                    description: "Selamat datang kembali, Admin!",
                });

                // Assuming the token is in response.data.data.token based on standard response format
                // Adjust if your backend response structure is different
                const token = response.data.data?.token || response.data.token;

                if (token) {
                    setCookie("admin_token", token, { maxAge: 60 * 60 * 24 });
                    router.push("/admin/dashboard");
                } else {
                    throw new Error("Token tidak ditemukan dalam respons");
                }

            } else {
                toast.error("Login Gagal", {
                    description: response.data.message || "Email atau password salah. Silakan coba lagi.",
                });
            }
        } catch (error: any) {
            console.error("Login error:", error);
            let errorMessage = "Terjadi kesalahan pada server.";

            if (axios.isAxiosError(error) && error.response) {
                errorMessage = error.response.data.message || error.response.data.error || "Kredensial tidak valid";
            }

            toast.error("Login Gagal", {
                description: errorMessage,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
            <div className="w-full max-w-md">
                <div className="flex justify-center mb-8">
                    <div className="flex items-center gap-2 font-bold text-2xl text-primary">
                        <div className="bg-primary/10 p-2 rounded-lg">
                            <ShieldCheck className="h-8 w-8 text-primary" />
                        </div>
                        Kelas Santai <span className="text-foreground/70 font-normal">Admin</span>
                    </div>
                </div>

                <Card className="border-primary/10 shadow-xl shadow-primary/5">
                    <CardHeader className="space-y-1 text-center">
                        <CardTitle className="text-2xl font-bold">Akses Dashboard</CardTitle>
                        <CardDescription>
                            Masukan kredensial admin Anda untuk melanjutkan
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Admin</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        name="email"
                                        placeholder="admin@kelassantai.com"
                                        type="email"
                                        className="pl-10"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        className="pl-10 pr-10"
                                        value={formData.password}
                                        onChange={handleChange}

                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-0 top-0 h-full hover:bg-transparent text-muted-foreground hover:text-foreground"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                        <span className="sr-only">Toggle password visibility</span>
                                    </Button>
                                </div>
                            </div>
                            <Button className="w-full font-bold h-11 mt-2" type="submit" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Sedang Memproses...
                                    </>
                                ) : (
                                    "Masuk Dashboard"
                                )}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-2 text-center text-sm text-muted-foreground">
                        <p>Hanya personel yang berwenang yang dapat mengakses halaman ini.</p>
                    </CardFooter>
                </Card>

                <div className="mt-8 text-center text-xs text-muted-foreground">
                    &copy; {new Date().getFullYear()} Kelas Santai Admin Portal. All rights reserved.
                </div>
            </div>
        </div>
    );
}
