

"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BookOpen, Clock, Star, Users, CheckCircle, ArrowLeft, Loader2, User } from "lucide-react";
import { useState, useEffect } from "react";
import { getCookie } from "cookies-next";
import axios from "axios";
import { toast } from "sonner";
import { Course } from "@/lib/constants";
import { Skeleton } from "@/components/ui/skeleton";

export default function CourseDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;

    const [course, setCourse] = useState<Course | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEnrolling, setIsEnrolling] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    useEffect(() => {
        const fetchCourse = async () => {
            if (!id) return;
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";
                const response = await axios.get(`${apiUrl}/courses/${id}`);

                if (response.data.success) {

                    const courseData = response.data.data;
                    // Sort kurikulum berdasarkan no_urut
                    if (courseData.curiculum && courseData.curiculum.length > 0) {
                        courseData.curiculum.sort((a: any, b: any) => a.no_urut - b.no_urut);
                    }
                    setCourse(courseData);
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

    const handleRegister = async () => {
        if (!course) return;

        const token = getCookie("token");

        if (!token) {
            toast.error("Silakan masuk terlebih dahulu", {
                description: "Anda harus memiliki akun untuk mendaftar kelas.",
                action: {
                    label: "Masuk",
                    onClick: () => router.push(`/login?redirect_to=${encodeURIComponent(`/courses/${course.id}`)}`),
                },
            });
            return;
        }

        setIsEnrolling(true);
        const toastId = toast.loading("Sedang mendaftar kelas...");

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

            const response = await axios.post(
                `${apiUrl}/user-courses/enroll`,
                {
                    course_id: course.id,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.data.success) {
                toast.success("Berhasil mendaftar kelas!", {
                    id: toastId,
                    description: "Selamat belajar!",
                });
                setShowPaymentModal(true);
            } else {
                toast.error("Gagal mendaftar kelas", {
                    id: toastId,
                    description: response.data.message || "Terjadi kesalahan.",
                });
            }

        } catch (error: any) {
            console.error("Enrollment error:", error);
            if (axios.isAxiosError(error) && error.response) {
                const errorMessage = error.response.data.message || error.response.data.error;
                if (errorMessage && errorMessage.toLowerCase().includes("already enrolled")) {
                    toast.info("Anda sudah terdaftar", {
                        id: toastId,
                        description: "Anda sudah mengambil kelas ini sebelumnya.",
                    });
                } else {
                    toast.error("Gagal mendaftar kelas", {
                        id: toastId,
                        description: errorMessage || "Terjadi kesalahan pada server.",
                    });
                }

            } else {
                toast.error("Gagal menghubungi server", {
                    id: toastId,
                    description: "Periksa koneksi internet anda.",
                });
            }
        } finally {
            setIsEnrolling(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background pb-20 pt-20 container mx-auto px-4">
                <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-[250px]" />
                            <Skeleton className="h-4 w-[200px]" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
                <h1 className="text-2xl font-bold">Kelas tidak ditemukan</h1>
                <Button onClick={() => router.push("/")} variant="outline">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Course Header / Hero */}
            <div className="relative h-[300px] md:h-[400px] w-full overflow-hidden">
                <img
                    src={course.picture || `https://placehold.co/1200x600/png?text=${encodeURIComponent(course.title)}`}
                    alt={course.title}
                    className="object-cover w-full h-full brightness-50"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                <div className="container absolute bottom-0 left-1/2 -translate-x-1/2 px-4 pb-12 pt-20">
                    <Button onClick={() => router.back()} variant="ghost" className="text-white/80 hover:text-white mb-6 p-0 hover:bg-transparent">
                        <ArrowLeft className="mr-2 h-5 w-5" /> Kembali
                    </Button>
                    <div className="flex flex-wrap gap-2 mb-4">
                        <Badge className="bg-primary hover:bg-primary/90">Batch 12</Badge>
                        <Badge variant="secondary">{course.level}</Badge>
                        <Badge variant="outline" className="text-white border-white/40">{course.category}</Badge>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 shadow-sm">{course.title}</h1>
                    <div className="flex items-center gap-4 text-white/90 text-sm md:text-base">
                        <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-bold">{course.rating}</span> (120 Review)
                        </div>
                        <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>500+ Siswa</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{course.duration}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 mt-8 md:mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8 order-2 lg:order-1">
                    <section>
                        <h2 className="text-2xl font-bold mb-4">Tentang Kelas</h2>
                        <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                            {course.description}
                        </p>
                        {course.garis_besar && (
                            <div className="mt-4 p-4 bg-secondary/10 rounded-lg">
                                <h3 className="font-semibold mb-2">Garis Besar Materi</h3>
                                <p className="text-muted-foreground text-sm">{course.garis_besar}</p>
                            </div>
                        )}
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">Kurikulum</h2>
                        {course.curiculum && course.curiculum.length > 0 ? (
                            <div className="space-y-4">
                                <p className="text-muted-foreground mb-4 whitespace-pre-line">{course.silabus}</p>
                                <div className="grid gap-4">
                                    {course.curiculum.map((item, i) => (
                                        <div key={item.id || i} className="flex gap-4 p-4 rounded-xl border border-border/50 bg-card hover:bg-secondary/10 transition-colors">
                                            <div className="flex z-10 h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white ring-4 ring-background">
                                                {item.no_urut}
                                            </div>
                                            <div className="space-y-1">
                                                <h3 className="font-semibold leading-none">{item.name}</h3>
                                                <p className="text-sm text-muted-foreground">{item.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="p-4 rounded-lg bg-yellow-50 text-yellow-800 border border-yellow-200">
                                <p>Kurikulum untuk kelas ini sedang kami perbarui. Silakan hubungi admin untuk info lebih lanjut.</p>
                            </div>
                        )}
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">Mentor</h2>
                        <Card className="flex flex-col sm:flex-row items-center gap-6 p-6 overflow-hidden">
                            <div className="h-16 w-16 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                                <User className="h-8 w-8" />
                            </div>
                            <div className="text-center sm:text-left">
                                <h3 className="text-xl font-bold">{course.mentor_name || course.mentor || "Instruktur Ahli"}</h3>
                                <p className="text-primary font-medium mb-2">Expert Instructor</p>
                                <p className="text-sm text-muted-foreground">Berpengalaman di bidangnya dan siap membimbing Anda menguasai materi.</p>
                            </div>
                        </Card>
                    </section>
                </div>

                {/* Sidebar / Enrollment Card */}
                <div className="lg:col-span-1 order-1 lg:order-2">
                    <Card className="sticky top-24 shadow-xl shadow-primary/5 border-primary/20 overflow-hidden">
                        <div className="bg-secondary/30 p-4 text-center border-b border-border/50">
                            <span className="text-sm font-medium text-muted-foreground">Harga Kelas</span>
                        </div>
                        <CardContent className="p-6 space-y-6">
                            <div className="text-center">
                                <span className="text-3xl md:text-4xl font-bold text-primary">{formatPrice(course.price)}</span>
                                {course.price > 0 && (
                                    <p className="text-sm text-muted-foreground mt-1 line-through decoration-destructive/50">
                                        {formatPrice(course.price * 1.5)}
                                    </p>
                                )}
                            </div>

                            <Button onClick={handleRegister} className="w-full h-12 text-lg font-bold shadow-lg shadow-primary/25" disabled={isEnrolling}>
                                {isEnrolling && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isEnrolling ? "Sedang Mendaftar..." : "Daftar Sekarang"}
                            </Button>

                            <div className="space-y-3 pt-2">
                                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                    <BookOpen className="h-4 w-4 text-primary" />
                                    <span>{course.total_jp} Jam Pelajaran (JP)</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                    <Clock className="h-4 w-4 text-primary" />
                                    <span>Akses Selamanya</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                    <Users className="h-4 w-4 text-primary" />
                                    <span>Grup Diskusi Premium</span>
                                </div>
                            </div>

                            <Separator />
                            <p className="text-xs text-center text-muted-foreground">
                                Jaminan uang kembali 7 hari jika tidak puas.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Payment Modal */}
            {
                showPaymentModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                        <Card className="w-full max-w-md shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
                            <CardHeader className="text-center pb-2">
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                                    <CheckCircle className="h-10 w-10 text-green-600" />
                                </div>
                                <CardTitle className="text-2xl">Pendaftaran Berhasil!</CardTitle>
                            </CardHeader>
                            <CardContent className="text-center space-y-6">
                                <p className="text-muted-foreground">
                                    Terima kasih telah mendaftar di kelas <span className="font-semibold text-foreground">{course.title}</span>.
                                    <br />
                                    Selesaikan pembayaran untuk mulai belajar.
                                </p>
                                <div className="flex flex-col gap-3">
                                    <Button
                                        onClick={() => router.push("/cart")}
                                        className="w-full h-12 text-lg font-bold"
                                    >
                                        Lanjut ke Pembayaran
                                    </Button>
                                    <Button
                                        onClick={() => router.push("/dashboard")}
                                        variant="outline"
                                        className="w-full"
                                    >
                                        Nanti Saja
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )
            }
        </div >
    );
}

