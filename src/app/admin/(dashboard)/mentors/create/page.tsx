"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Upload, Eye, EyeOff, User, Mail, Shield, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axios from "axios";
import { getCookie } from "cookies-next";

export default function CreateMentorPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        gelar_depan: "",
        gelar_belakang: "",
        avatar: "",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const token = getCookie("admin_token");
        // Optional: Validation check if token exists, though middleware handles protection
        if (!token) {
            // Just a safety check
        }

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

            // Payload matching the struct requirements
            // Note: Password usually needs to be sent for creation unless auto-generated
            const payload = {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                gelar_depan: formData.gelar_depan,
                gelar_belakang: formData.gelar_belakang,
                avatar: formData.avatar
            };

            await axios.post(`${apiUrl}/mentors`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            toast.success("Mentor berhasil dibuat", {
                description: `${formData.name} telah berhasil ditambahkan.`,
            });

            router.push("/admin/mentors");
        } catch (error: any) {
            console.error("Create mentor error:", error);
            const errorMessage = error.response?.data?.message || "Gagal membuat mentor";
            toast.error("Gagal", {
                description: errorMessage,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const fullName = `${formData.gelar_depan ? formData.gelar_depan + " " : ""}${formData.name}${formData.gelar_belakang ? ", " + formData.gelar_belakang : ""}`.trim();

    return (
        <div className="w-full max-w-7xl mx-auto space-y-8 pb-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground mb-2">
                        <Link href="/admin/mentors" className="hover:text-primary transition-colors flex items-center text-sm">
                            <ArrowLeft className="h-3 w-3 mr-1" /> Kembali ke Daftar
                        </Link>
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight">Tambah Mentor Baru</h2>
                    <p className="text-muted-foreground">Buat akun mentor baru untuk mulai mengajar.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" asChild>
                        <Link href="/admin/mentors">Batal</Link>
                    </Button>
                    <Button onClick={handleSubmit} disabled={isLoading}>
                        {isLoading ? "Menyimpan..." : (
                            <>
                                <Save className="mr-2 h-4 w-4" /> Simpan Mentor
                            </>
                        )}
                    </Button>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Left Column: Form Forms */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Account Credentials */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <Shield className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <CardTitle>Akun Login</CardTitle>
                                    <CardDescription>Informasi ini digunakan untuk login ke portal mentor.</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <Separator />
                        <CardContent className="pt-6 grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="email">Alamat Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="nama@kelassantai.com"
                                        className="pl-9"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        placeholder="Minimal 8 karakter"
                                        required
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                                        ) : (
                                            <Eye className="h-4 w-4 text-muted-foreground" />
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Profile Information */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-blue-500/10 rounded-lg">
                                    <User className="h-5 w-5 text-blue-500" />
                                </div>
                                <div>
                                    <CardTitle>Profil Publik</CardTitle>
                                    <CardDescription>Informasi yang akan ditampilkan kepada siswa.</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <Separator />
                        <CardContent className="pt-6 space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nama Lengkap</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Contoh: Budi Santoso"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="gelar_depan">Gelar Depan</Label>
                                    <Input
                                        id="gelar_depan"
                                        value={formData.gelar_depan}
                                        onChange={handleInputChange}
                                        placeholder="Dr., Ir., Prof."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="gelar_belakang">Gelar Belakang</Label>
                                    <Input
                                        id="gelar_belakang"
                                        value={formData.gelar_belakang}
                                        onChange={handleInputChange}
                                        placeholder="S.Kom, M.T., Ph.D"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="avatar">Foto Profil (URL)</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="avatar"
                                        value={formData.avatar}
                                        onChange={handleInputChange}
                                        placeholder="https://..."
                                    />
                                    <Button type="button" variant="secondary" onClick={() => toast.info("Fitur upload belum tersedia")}>
                                        <Upload className="h-4 w-4 mr-2" /> Upload
                                    </Button>
                                </div>
                                <p className="text-xs text-muted-foreground">Disarankan menggunakan rasio 1:1 (Persegi).</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Live Preview */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24 space-y-4">
                        <Label className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Live Preview</Label>
                        <Card className="overflow-hidden border-2 border-primary/10 shadow-lg">
                            <div className="h-24 bg-gradient-to-r from-primary/20 to-blue-500/20 w-full" />
                            <CardContent className="relative pt-0 text-center px-6 pb-8">
                                <div className="absolute -top-12 left-1/2 -translate-x-1/2">
                                    <Avatar className="h-24 w-24 border-4 border-background shadow-sm">
                                        <AvatarImage src={formData.avatar} className="object-cover" />
                                        <AvatarFallback className="text-xl bg-muted">
                                            {formData.name ? formData.name.substring(0, 2).toUpperCase() : "MN"}
                                        </AvatarFallback>
                                    </Avatar>
                                </div>
                                <div className="mt-14 space-y-1">
                                    <h3 className="font-bold text-xl leading-tight text-foreground">
                                        {fullName || "Nama Mentor"}
                                    </h3>
                                    <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                                        <CheckCircle2 className="h-3 w-3 text-blue-500" /> Mentor Terverifikasi
                                    </p>
                                </div>

                                <div className="mt-6 flex flex-col gap-2">
                                    <Badge variant="outline" className="w-full justify-center py-1.5 font-normal text-muted-foreground">
                                        {formData.email || "email@mentors.com"}
                                    </Badge>
                                    <Button className="w-full" size="sm" variant="secondary">
                                        Lihat Profil Lengkap
                                    </Button>
                                </div>
                            </CardContent>
                            <CardFooter className="bg-muted/50 p-4 text-xs text-muted-foreground text-center ">
                                Ini adalah tampilan kartu mentor yang akan dilihat oleh siswa.
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
