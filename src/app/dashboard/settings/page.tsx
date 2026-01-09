"use client";

import { useEffect, useState } from "react";
import { getCookie } from "cookies-next";
import { User, Mail, Phone, Save, Loader2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import axios from "axios";

export default function SettingsPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [formData, setFormData] = useState({
        id: "",
        name: "",
        email: "",
        phone: "",
        bio: "Pelajar seumur hidup yang antusias dengan teknologi."
    });

    useEffect(() => {
        const fetchUserData = async () => {
            const token = getCookie("token");
            if (!token) {
                setIsFetching(false);
                return;
            }

            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";
                // Menggunakan users/getById seperti yang diminta user
                // Jika butuh ID spesifik, biasanya ID ada di payload token, 
                // namun jika API didesain untuk mengambil data user aktif via token:
                const response = await axios.get(`${apiUrl}/users/getById`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (response.data.success) {
                    const userData = response.data.data;
                    setFormData({
                        id: userData.id || "",
                        name: userData.name || "",
                        email: userData.email || "",
                        phone: userData.phone || "",
                        bio: userData.bio || "Pelajar seumur hidup yang antusias dengan teknologi."
                    });
                }
            } catch (error) {
                console.error("Failed to fetch user data:", error);
                toast.error("Gagal mengambil data profil");
            } finally {
                setIsFetching(false);
            }
        };

        fetchUserData();
    }, []);

    const handleSave = async () => {
        setIsLoading(true);
        const token = getCookie("token");

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";
            // Asumsi endpoint update profil
            const response = await axios.put(`${apiUrl}/users/update`, {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                bio: formData.bio
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                toast.success("Profil berhasil diperbarui!");
            } else {
                toast.error(response.data.message || "Gagal memperbarui profil");
            }
        } catch (error: any) {
            console.error("Save error:", error);
            const errorMessage = error.response?.data?.message || "Terjadi kesalahan saat menyimpan";
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="flex flex-1 flex-col gap-8 max-w-4xl">
            <header>
                <h1 className="text-3xl font-bold mb-2">Pengaturan Akun</h1>
                <p className="text-muted-foreground">Kelola informasi profil dan preferensi akun Anda.</p>
            </header>

            <div className="grid gap-8 md:grid-cols-[250px_1fr]">
                <Card>
                    <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                        <Avatar className="h-32 w-32 border-4 border-muted shadow-lg">
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name}`} />
                            <AvatarFallback className="text-4xl">{formData.name ? formData.name.charAt(0) : "U"}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                            <h3 className="font-medium">{formData.name}</h3>
                            <p className="text-xs text-muted-foreground">{formData.email}</p>
                        </div>
                        <Button variant="outline" size="sm" className="w-full">
                            Ubah Foto
                        </Button>
                    </CardContent>
                </Card>

                <Card className="shadow-md border-border/50">
                    <CardHeader>
                        <CardTitle>Informasi Pribadi</CardTitle>
                        <CardDescription>
                            Perbarui detail informasi pribadi Anda di sini.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nama Lengkap</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="pl-9 focus:ring-primary"
                                    placeholder="Nama Lengkap"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    value={formData.email}
                                    readOnly={true}
                                    className="pl-9 bg-muted/30 cursor-not-allowed opacity-80"
                                />
                            </div>
                            <p className="text-[10px] text-muted-foreground flex items-center gap-1 px-1">
                                <Info className="h-3 w-3" /> Email tidak dapat diubah untuk saat ini.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Nomor Telepon</Label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="phone"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="pl-9 focus:ring-primary"
                                    placeholder="0812..."
                                />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="border-t bg-muted/5 px-6 py-4">
                        <Button onClick={handleSave} disabled={isLoading} className="ml-auto shadow-sm">
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Menyimpan...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    Simpan Perubahan
                                </>
                            )}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
