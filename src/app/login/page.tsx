"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Coffee, ArrowLeft, Loader2, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { setCookie } from "cookies-next";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const loginSchema = z.object({
    email: z.string().email("Format email tidak valid"),
    password: z.string().min(6, "Password minimal 6 karakter"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormValues) => {
        setIsLoading(true);
        const toastId = toast.loading("Sedang masuk...", {
            description: "Mohon tunggu sebentar.",
        });

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

            const response = await axios.post(`${apiUrl}/users/login`, {
                email: data.email,
                password: data.password,
            });

            const result = response.data;

            if (result.success) {
                // Simpan token ke cookies
                setCookie("token", result.data.token, {
                    maxAge: 60 * 60 * 24 * 7, // 7 hari
                    path: "/",
                });

                toast.success(result.message || "Login berhasil", {
                    id: toastId,
                    description: "Selamat datang kembali!",
                    duration: 3000,
                });

                // Force full reload to ensure Navbar updates
                window.location.href = "/";
            } else {
                toast.error("Login gagal", {
                    id: toastId,
                    description: result.message || "Terjadi kesalahan saat masuk.",
                });
            }
        } catch (error: any) {
            console.error("Login error:", error);
            if (axios.isAxiosError(error) && error.response) {
                const result = error.response.data;
                toast.error("Login gagal", {
                    id: toastId,
                    description: result.error || result.message || "Email atau password salah.",
                });
            } else {
                toast.error("Gagal menghubungi server", {
                    id: toastId,
                    description: "Periksa koneksi internet anda atau coba lagi nanti.",
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-[80vh] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <Card className="w-full max-w-md shadow-2xl shadow-primary/10 border-border/50">
                <CardHeader className="space-y-1 text-center">
                    <Link href="/" className="absolute top-4 left-4 text-muted-foreground hover:text-primary transition-colors">
                        <ArrowLeft className="h-6 w-6" />
                    </Link>
                    <div className="flex justify-center mb-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                            <Coffee className="h-6 w-6" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold">Selamat Datang</CardTitle>
                    <CardDescription>
                        Masuk ke akun Kelas Santai anda
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    {/* <div className="grid grid-cols-2 gap-6">
                        <Button variant="outline" className="w-full">
                            Google
                        </Button>
                        <Button variant="outline" className="w-full">
                            Github
                        </Button>
                    </div> */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card px-2 text-muted-foreground">
                                Atau lanjut dengan
                            </span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="nama@contoh.com"
                                {...register("email")}
                                className={errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}
                            />
                            {errors.email && (
                                <p className="text-xs text-red-500">{errors.email.message}</p>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    {...register("password")}
                                    className={errors.password ? "border-red-500 focus-visible:ring-red-500 pr-10" : "pr-10"}
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                                    ) : (
                                        <Eye className="h-4 w-4 text-muted-foreground" />
                                    )}
                                    <span className="sr-only">
                                        {showPassword ? "Hide password" : "Show password"}
                                    </span>
                                </Button>
                            </div>
                            {errors.password && (
                                <p className="text-xs text-red-500">{errors.password.message}</p>
                            )}
                        </div>
                        <Button className="w-full bg-primary text-white hover:bg-primary/90" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Masuk
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                    <div className="text-center text-sm text-muted-foreground">
                        Belum punya akun?{" "}
                        <Link href="/register" className="underline underline-offset-4 hover:text-primary">
                            Daftar
                        </Link>
                    </div>
                    <div className="text-center text-xs text-muted-foreground mt-2">
                        <Link href="/forgot-password" className="hover:text-primary">Lupa password?</Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
