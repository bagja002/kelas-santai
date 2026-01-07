"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Pencil, Clock, Calendar, User, BookOpen, Currency, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import axios from "axios";
import { getCookie } from "cookies-next";
import { Course } from "@/lib/constants";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminCourseDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;

    const [course, setCourse] = useState<Course | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCourse = async () => {
            if (!id) return;
            try {
                const token = getCookie("admin_token");
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";
                const response = await axios.get(`${apiUrl}/courses/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (response.data.success) {
                    setCourse(response.data.data);
                } else {
                    toast.error(response.data.message || "Gagal memuat detail kelas");
                }
            } catch (error) {
                console.error("Fetch course error:", error);
                toast.error("Terjadi kesalahan saat memuat data kelas");
            } finally {
                setIsLoading(false);
            }
        };

        fetchCourse();
    }, [id]);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric"
        });
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center space-x-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <Skeleton className="h-8 w-64" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Skeleton className="h-[400px] md:col-span-2" />
                    <Skeleton className="h-[300px]" />
                </div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
                <h2 className="text-2xl font-bold">Kelas tidak ditemukan</h2>
                <Button onClick={() => router.push("/admin/courses")}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Daftar
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground mb-2">
                        <Link href="/admin/courses" className="hover:text-primary transition-colors flex items-center text-sm">
                            <ArrowLeft className="h-3 w-3 mr-1" /> Kembali ke Daftar
                        </Link>
                    </div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">{course.title}</h1>
                        <Badge variant={
                            course.status === 'published' ? 'default' :
                                course.status === 'draft' ? 'secondary' : 'destructive'
                        } className="capitalize">
                            {course.status}
                        </Badge>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" asChild>
                        <Link href={`/admin/courses/${id}/edit`}>
                            <Pencil className="mr-2 h-4 w-4" /> Edit Kelas
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Overview */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Deskripsi Kelas</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                                {course.description}
                            </p>

                            {course.silabus && (
                                <div className="bg-secondary/10 p-4 rounded-lg">
                                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                                        <BookOpen className="h-4 w-4 text-primary" /> Target Pembelajaran
                                    </h3>
                                    <p className="text-sm text-muted-foreground">{course.silabus}</p>
                                </div>
                            )}

                            {course.garis_besar && (
                                <div className="bg-secondary/10 p-4 rounded-lg">
                                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-primary" /> Garis Besar Materi
                                    </h3>
                                    <p className="text-sm text-muted-foreground">{course.garis_besar}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Curriculum */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Kurikulum</CardTitle>
                            <CardDescription>Daftar materi yang akan dipelajari dalam kelas ini.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {course.curiculum && course.curiculum.length > 0 ? (
                                <div className="space-y-4">
                                    {course.curiculum.map((item, index) => (
                                        <div key={item.id} className="flex gap-4 p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
                                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                                                {index + 1}
                                            </div>
                                            <div className="space-y-1">
                                                <h4 className="font-semibold text-sm leading-none">{item.name}</h4>
                                                <p className="text-sm text-muted-foreground">{item.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-muted-foreground">
                                    Belum ada data kurikulum.
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informasi Kelas</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Currency className="h-4 w-4" />
                                    <span className="text-sm font-medium">Harga</span>
                                </div>
                                <span className="font-bold text-lg">{formatPrice(course.price)}</span>
                            </div>
                            <Separator />

                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/10 rounded-md">
                                        <User className="h-4 w-4 text-primary" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs text-muted-foreground">Mentor</span>
                                        <span className="font-medium">{course.mentor_name || "-"}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/10 rounded-md">
                                        <Clock className="h-4 w-4 text-primary" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs text-muted-foreground">Durasi</span>
                                        <span className="font-medium">{course.duration} ({course.total_jp} JP)</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/10 rounded-md">
                                        <Calendar className="h-4 w-4 text-primary" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs text-muted-foreground">Periode</span>
                                        <span className="font-medium text-sm">
                                            {formatDate(course.start_date)} - {formatDate(course.end_date)}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/10 rounded-md">
                                        <BookOpen className="h-4 w-4 text-primary" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs text-muted-foreground">Level & Kategori</span>
                                        <span className="font-medium text-sm">{course.level} • {course.category}</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium">Statistik</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center p-4 bg-secondary/10 rounded-lg">
                                    <div className="text-2xl font-bold">{course.rating}</div>
                                    <div className="text-xs text-muted-foreground">Rating</div>
                                </div>
                                <div className="text-center p-4 bg-secondary/10 rounded-lg">
                                    {/* Mock data for now */}
                                    <div className="text-2xl font-bold">0</div>
                                    <div className="text-xs text-muted-foreground">Siswa Aktif</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
