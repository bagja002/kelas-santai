"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Upload, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { MENTORS, Mentor } from "@/lib/constants";
import { getCookie } from "cookies-next";
import axios from "axios";

interface CurriculumItem {
    name: string;
    description: string;
    no_urut: number;
}

export default function CreateCoursePage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [mentors, setMentors] = useState<Mentor[]>([]);

    useEffect(() => {
        const fetchMentors = async () => {
            try {
                const token = getCookie("admin_token");
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";
                const response = await axios.get(`${apiUrl}/mentors`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                // Adjust based on actual response: response.data.data if wrapped
                const fetchedMentors = response.data.data || response.data;
                setMentors(Array.isArray(fetchedMentors) ? fetchedMentors : []);
            } catch (error) {
                console.error("Failed to fetch mentors:", error);
                toast.error("Gagal memuat daftar mentor");
            }
        };

        fetchMentors();
    }, []);

    // Form States
    const [formData, setFormData] = useState({
        name: "",
        title: "",
        description: "",
        price: "",
        level: "",
        rating: "",
        category: "",
        picture: "",
        duration: "",
        total_jp: "",
        mentor_id: "",
        mentor_name: "", // Added to store mentor name for display/consistency
        start_date: "",
        end_date: "",
        silabus: "",
        garis_besar: "",
        status: "draft",
    });

    const [curriculum, setCurriculum] = useState<CurriculumItem[]>([]);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Basic validation
        if (file.size > 5 * 1024 * 1024) {
            toast.error("Ukuran file terlalu besar (Max 5MB)");
            return;
        }

        setIsUploading(true);
        const uploadToast = toast.loading("Mengupload gambar...");

        try {
            const token = getCookie("admin_token");
            const formDataUpload = new FormData();
            formDataUpload.append("file", file); // Adjust field name if backend requires differentiation

            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

            const response = await axios.post(`${apiUrl}/courses/upload`, formDataUpload, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data.success || response.data.url) {
                // Assuming response format: { success: true, url: "...", data: { url: "..." } }
                const imageUrl = response.data.url || response.data.data?.url || response.data.data;
                setFormData(prev => ({ ...prev, picture: imageUrl }));
                toast.success("Gambar berhasil diupload", { id: uploadToast });
            } else {
                throw new Error("Gagal mendapatkan URL gambar");
            }

        } catch (error) {
            console.error("Upload error:", error);
            toast.error("Gagal mengupload gambar", { id: uploadToast });
        } finally {
            setIsUploading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;

        if (id === "price") {
            // Remove non-digit characters
            const rawValue = value.replace(/\D/g, "");
            // Format with dots
            const formattedValue = rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            setFormData(prev => ({ ...prev, [id]: formattedValue }));
        } else {
            setFormData(prev => ({ ...prev, [id]: value }));
        }
    };

    const handleSelectChange = (key: string, value: string) => {
        if (key === "mentor_id") {
            const selectedMentor = mentors.find(m => m.id === value);
            setFormData(prev => ({
                ...prev,
                mentor_id: value,
                mentor_name: selectedMentor ? selectedMentor.name : ""
            }));
        } else {
            setFormData(prev => ({ ...prev, [key]: value }));
        }
    };

    const addCurriculumItem = () => {
        setCurriculum([...curriculum, { name: "", description: "", no_urut: 0 }]);
    };

    const removeCurriculumItem = (index: number) => {
        const newCurriculum = [...curriculum];
        newCurriculum.splice(index, 1);
        setCurriculum(newCurriculum);
    };

    const handleCurriculumChange = (index: number, field: keyof CurriculumItem, value: string) => {
        setCurriculum(prev => prev.map((item, i) => {
            if (i !== index) return item;
            return {
                ...item,
                [field]: field === "no_urut" ? parseInt(value) || 0 : value
            };
        }));
    };

    const handleSubmit = async (status: string) => {
        setIsLoading(true);

        // Get admin token
        const token = getCookie("admin_token");
        if (!token) {
            toast.error("Tidak ada otorisasi", {
                description: "Silakan login kembali sebagai admin.",
            });
            setIsLoading(false);
            return;
        }

        // Sanitize price (remove dots)
        const sanitizedPrice = parseFloat(formData.price.replace(/\./g, "")) || 0;

        const payload = {
            ...formData,
            status: status, // Use the status passed from button
            price: sanitizedPrice,
            rating: parseFloat(formData.rating) || 5.0, // Default rating 5.0 for new courses
            total_jp: parseInt(formData.total_jp) || 0,
            curiculum: curriculum,
        };

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

            const response = await axios.post(`${apiUrl}/courses`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data.success || response.status === 201 || response.status === 200) {
                toast.success("Kelas berhasil dibuat", {
                    description: status === 'published' ? "Kelas telah dipublikasikan." : "Draft kelas tersimpan.",
                });
                router.push("/admin/courses");
            } else {
                throw new Error(response.data.message || "Gagal membuat kelas");
            }

        } catch (error: any) {
            console.error("Create course error:", error);
            let errorMessage = "Terjadi kesalahan pada server.";
            if (axios.isAxiosError(error) && error.response) {
                errorMessage = error.response.data.message || error.response.data.error || "Gagal menghubungi server";
            }
            toast.error("Gagal membuat kelas", {
                description: errorMessage,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6 w-full mx-auto pb-10">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/admin/courses">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Tambah Kelas Baru</h2>
                    <p className="text-muted-foreground">Isi detail lengkap kelas termasuk kurikulum.</p>
                </div>
            </div>

            <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Basic Info */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Informasi Dasar</CardTitle>
                            <CardDescription>Detail utama mengenai kelas ini</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Judul Kelas (Title)</Label>
                                    <Input id="title" value={formData.title} onChange={handleInputChange} placeholder="Contoh: Mastering React.js" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nama Internal (Name)</Label>
                                    <Input id="name" value={formData.name} onChange={handleInputChange} placeholder="contoh-slug-react-js" required />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Deskripsi Singkat</Label>
                                <Textarea id="description" value={formData.description} onChange={handleInputChange} placeholder="Jelaskan ringkasan kelas..." rows={3} required />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="category">Kategori</Label>
                                    <Input id="category" value={formData.category} onChange={handleInputChange} placeholder="Contoh: Programming, Design" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="level">Tingkat Kesulitan</Label>
                                    <Select value={formData.level} onValueChange={(v) => handleSelectChange("level", v)} required>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih Level" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Beginner">Beginner</SelectItem>
                                            <SelectItem value="Intermediate">Intermediate</SelectItem>
                                            <SelectItem value="Advanced">Advanced</SelectItem>
                                            <SelectItem value="All Levels">All Levels</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Details & Metadata */}
                    <Card className="md:col-span-1">
                        <CardHeader>
                            <CardTitle>Detail & Jadwal</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="mentor_id">Mentor</Label>
                                <Select value={formData.mentor_id} onValueChange={(v) => handleSelectChange("mentor_id", v)} required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih Mentor" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {mentors.map((mentor) => (
                                            <SelectItem key={mentor.id} value={mentor.id}>
                                                {mentor.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="price">Harga (IDR)</Label>
                                    <Input id="price" type="text" value={formData.price} onChange={handleInputChange} placeholder="0" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="total_jp">Total JP</Label>
                                    <Input id="total_jp" type="number" value={formData.total_jp} onChange={handleInputChange} placeholder="0" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="duration">Durasi</Label>
                                <Input id="duration" value={formData.duration} onChange={handleInputChange} placeholder="Contoh: 8 Minggu" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="start_date">Tanggal Mulai</Label>
                                    <Input id="start_date" type="date" value={formData.start_date} onChange={handleInputChange} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="end_date">Tanggal Selesai</Label>
                                    <Input id="end_date" type="date" value={formData.end_date} onChange={handleInputChange} required />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Content & Syllabus */}
                    <Card className="md:col-span-1">
                        <CardHeader>
                            <CardTitle>Konten</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="garis_besar">Garis Besar</Label>
                                <Textarea id="garis_besar" value={formData.garis_besar} onChange={handleInputChange} placeholder="Poin-poin utama materi..." rows={4} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="silabus">Silabus (Ringkasan)</Label>
                                <Textarea id="silabus" value={formData.silabus} onChange={handleInputChange} placeholder="Ringkasan topik..." rows={4} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Media */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Media</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <Label htmlFor="picture">URL Gambar / Upload</Label>
                                <div className="flex gap-4">
                                    <Input
                                        id="picture"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileUpload}
                                        disabled={isUploading}
                                        className="flex-1"
                                    />
                                    {isUploading && (
                                        <div className="flex items-center px-3">
                                            <span className="text-xs text-muted-foreground animate-pulse">Uploading...</span>
                                        </div>
                                    )}
                                </div>
                                {formData.picture && (
                                    <p className="text-xs text-green-600 truncate max-w-[300px]">
                                        File: <a href={formData.picture} target="_blank" rel="noreferrer" className="underline">{formData.picture}</a>
                                    </p>
                                )}
                                <p className="text-xs text-muted-foreground">Upload gambar sampul kelas (max 2MB).</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Curriculum Builder */}
                    <Card className="md:col-span-2">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Kurikulum Detil</CardTitle>
                                <CardDescription>Tambahkan sesi atau modul pembelajaran.</CardDescription>
                            </div>
                            <Button type="button" variant="secondary" onClick={addCurriculumItem} size="sm">
                                <Plus className="h-4 w-4 mr-2" /> Tambah Sesi
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {curriculum.length === 0 && (
                                <p className="text-sm text-center text-muted-foreground py-8 border-2 border-dashed rounded-lg">
                                    Belum ada kurikulum ditambahkan. Klik tombol "Tambah Sesi".
                                </p>
                            )}
                            {curriculum.map((item, index) => (
                                <div key={index} className="flex gap-4 items-start p-4 border rounded-md bg-muted/30">
                                    <div className="grid gap-4 flex-1 md:grid-cols-3">
                                        <div className="space-y-2">
                                            <Label className="text-xs">Nama Sesi</Label>
                                            <Input
                                                value={item.name}
                                                onChange={(e) => handleCurriculumChange(index, "name", e.target.value)}
                                                placeholder="Judul pertemuan..."
                                            />
                                        </div>
                                        <div className="space-y-2 md:col-span-2">
                                            <Label className="text-xs">Deskripsi</Label>
                                            <Input
                                                value={item.description}
                                                onChange={(e) => handleCurriculumChange(index, "description", e.target.value)}
                                                placeholder="Penjelasan singkat materi..."
                                            />
                                        </div>
                                        <div className="space-y-2 md:col-span-2">
                                            <Label className="text-xs">No Urut</Label>
                                            <Input
                                                value={item.no_urut}
                                                onChange={(e) => handleCurriculumChange(index, "no_urut", e.target.value)}
                                                placeholder="No urut sesi..."
                                            />
                                        </div>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="text-destructive hover:text-destructive/90 mt-6"
                                        onClick={() => removeCurriculumItem(index)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Final Actions */}
                    <Card className="md:col-span-2 border-none shadow-none bg-transparent">
                        <CardContent className="p-0 flex justify-end gap-4">
                            <Button variant="outline" asChild>
                                <Link href="/admin/courses">Batal</Link>
                            </Button>
                            <Button type="button" variant="secondary" onClick={() => handleSubmit('draft')}>
                                Simpan Draft
                            </Button>
                            <Button disabled={isLoading} onClick={() => handleSubmit('published')}>
                                {isLoading ? "Menyimpan..." : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" /> Publish Kelas
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </form>
        </div>
    );
}

