"use client";

import { useEffect, useState } from "react";
import { getCookie } from "cookies-next";
import { User, Mail, Phone, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

export default function SettingsPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "Pengguna",
        email: "user@kelassantai.com",
        phone: "081234567890",
        bio: "Pelajar seumur hidup yang antusias dengan teknologi."
    });

    const handleSave = async () => {
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        toast.success("Profil berhasil diperbarui!");
        setIsLoading(false);
    };

    return (
        <div className="flex flex-1 flex-col gap-8 max-w-4xl">
            <header>
                <h1 className="text-3xl font-bold mb-2">Pengaturan Akun</h1>
                <p className="text-muted-foreground">Kelola informasi profil dan preferensi akun Anda.</p>
            </header>

            <div className="grid gap-8 md:grid-cols-[250px_1fr]">
                <Card>
                    <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                        <Avatar className="h-32 w-32 border-4 border-muted">
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name}`} />
                            <AvatarFallback className="text-4xl">{formData.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <Button variant="outline" size="sm" className="w-full">
                            Ubah Foto
                        </Button>
                    </CardContent>
                </Card>

                <Card>
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
                                    className="pl-9"
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
                                    className="pl-9 bg-muted/50"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Nomor Telepon</Label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="phone"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="pl-9"
                                />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="border-t bg-muted/20 px-6 py-4">
                        <Button onClick={handleSave} disabled={isLoading} className="ml-auto">
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
