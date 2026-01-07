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

// ... imports ...
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

const registerSchema = z.object({
    name: z.string().min(3, "Nama lengkap harus minimal 3 karakter"),
    no_telp: z.string().min(10, "No telpon harus minimal 10 karakter"),
    email: z.string().email("Format email tidak valid"),
    password: z.string().min(8, "Password minimal 8 karakter"),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Password tidak sama",
    path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
    });

    const router = useRouter();

    const onSubmit = async (data: RegisterFormValues) => {
        setIsLoading(true);
        const toastId = toast.loading("Sedang memproses pendaftaran...", {
            description: "Mohon tunggu sebentar.",
        });

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

            // Artificial delay to show the loading state better (optional, but good for UX if API is too fast)
            // await new Promise(resolve => setTimeout(resolve, 1000)); 

            const response = await axios.post(`${apiUrl}/users/register`, {
                name: data.name,
                email: data.email,
                password: data.password,
                no_telp: data.no_telp,
            });

            const result = response.data;

            if (result.success) {
                // Success
                toast.success("Registrasi berhasil!", {
                    id: toastId,
                    description: "Silakan masuk menggunakan akun baru anda.",
                    duration: 5000,
                });
                router.push("/login");
            } else {
                toast.error("Registrasi gagal", {
                    id: toastId,
                    description: result.message || "Terjadi kesalahan saat mendaftar.",
                });
            }

        } catch (error: any) {
            console.error("Register error:", error);
            if (axios.isAxiosError(error) && error.response) {
                const result = error.response.data;
                if (result.error && result.error.includes("Duplicate entry")) {
                    setError("email", {
                        type: "manual",
                        message: "Email sudah terdaftar. Gunakan email lain."
                    });
                    toast.error("Email sudah terdaftar", {
                        id: toastId,
                        description: "Silakan gunakan email lain atau masuk.",
                    });
                } else {
                    toast.error("Gagal mendaftar", {
                        id: toastId,
                        description: result.message || "Silakan cek kembali data anda.",
                    });
                }
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
                    <CardTitle className="text-2xl font-bold">Daftar Akun Baru</CardTitle>
                    <CardDescription>
                        Mulai perjalanan belajar anda bersama Kelas Santai
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div className="grid grid-cols-2 gap-6">
                        <Button variant="outline" className="w-full">
                            Google
                        </Button>
                        <Button variant="outline" className="w-full">
                            Github
                        </Button>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card px-2 text-muted-foreground">
                                Atau daftar dengan email
                            </span>
                        </div>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Nama Lengkap</Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="John Doe"
                                {...register("name")}
                                className={errors.name ? "border-red-500 focus-visible:ring-red-500" : ""}
                            />
                            {errors.name && (
                                <p className="text-xs text-red-500">{errors.name.message}</p>
                            )}
                        </div>
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
                            <Label htmlFor="no_telp">No Telpon</Label>
                            <Input
                                id="no_telp"
                                type="phone"
                                placeholder="08123456789"
                                {...register("no_telp")}
                                className={errors.no_telp ? "border-red-500 focus-visible:ring-red-500" : ""}
                            />
                            {errors.no_telp && (
                                <p className="text-xs text-red-500">{errors.no_telp.message}</p>
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
                        <div className="grid gap-2">
                            <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    {...register("confirmPassword")}
                                    className={errors.confirmPassword ? "border-red-500 focus-visible:ring-red-500 pr-10" : "pr-10"}
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                                    ) : (
                                        <Eye className="h-4 w-4 text-muted-foreground" />
                                    )}
                                    <span className="sr-only">
                                        {showConfirmPassword ? "Hide password" : "Show password"}
                                    </span>
                                </Button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>
                            )}
                        </div>
                        <Button className="w-full bg-primary text-white hover:bg-primary/90" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Daftar Sekarang
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                    <div className="text-center text-sm text-muted-foreground">
                        Sudah punya akun?{" "}
                        <Link href="/login" className="underline underline-offset-4 hover:text-primary">
                            Masuk
                        </Link>
                    </div>
                    <p className="text-center text-xs text-muted-foreground mt-2 px-4">
                        Dengan mendaftar, anda setuju dengan <Link href="#" className="underline hover:text-primary">Syarat & Ketentuan</Link> serta <Link href="#" className="underline hover:text-primary">Kebijakan Privasi</Link> kami.
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
