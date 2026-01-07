"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, User, BookOpen } from "lucide-react";
import { Course } from "@/lib/constants";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";

export function CourseList() {
    const router = useRouter();
    const [courses, setCourses] = useState<Course[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            setIsLoading(true);
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

            // Public endpoint, no token needed usually for listing
            const response = await axios.get(`${apiUrl}/courses`);

            if (response.data.success) {
                // Filter only published courses if needed, or backend handles it.
                // For now assuming we show what backend gives, or filter client side:
                // const activeCourses = response.data.data.filter((c: Course) => c.status === 'published');
                setCourses(response.data.data || []);
            }
        } catch (error) {
            console.error("Fetch courses error:", error);
            // toast.error("Gagal memuat daftar kelas"); // Optional: suppress error on public page or show friendly message
        } finally {
            setIsLoading(false);
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    };

    return (
        <section id="courses" className="py-20 bg-secondary/30">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col items-center justify-center text-center space-y-4 mb-16">
                    <Badge variant="outline" className="border-primary text-primary px-4 py-1 text-sm">
                        Katalog Kelas
                    </Badge>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
                        Pilih Jalur Belajarmu
                    </h2>
                    <p className="max-w-[700px] text-muted-foreground text-lg">
                        Temukan kelas yang sesuai dengan minat dan tujuan karirmu. Materi disusun oleh praktisi ahli.
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {isLoading ? (
                        // Skeleton Loading State
                        [1, 2, 3].map((i) => (
                            <Card key={i} className="h-[400px] animate-pulse bg-muted">
                                <CardHeader className="h-48 bg-muted-foreground/10" />
                                <CardContent className="space-y-4 p-6">
                                    <div className="h-4 w-2/3 bg-muted-foreground/20 rounded" />
                                    <div className="h-4 w-full bg-muted-foreground/20 rounded" />
                                </CardContent>
                            </Card>
                        ))
                    ) : courses.length > 0 ? (
                        courses.filter(c => c.status === 'published').map((course) => (
                            <Card key={course.id} className="group flex flex-col h-full overflow-hidden border-border/50 bg-card hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1">
                                <div className="relative aspect-video w-full overflow-hidden shrink-0 bg-secondary">
                                    <img
                                        src={course.picture}
                                        alt={course.title}
                                        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute top-2 right-2 bg-background/90 backdrop-blur-sm shadow-sm rounded-md px-2 py-1 flex items-center gap-1 text-xs font-semibold text-yellow-600">
                                        <Star className="h-3 w-3 fill-yellow-500" />
                                        {course.rating}
                                    </div>
                                </div>
                                <CardHeader className="space-y-1 p-6 pb-2">
                                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mb-3">
                                        <span className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded font-medium">
                                            <span className="h-1.5 w-1.5 rounded-full bg-green-600 animate-pulse"></span>
                                            Open Batch
                                        </span>
                                        <span className="bg-secondary px-2 py-1 rounded text-secondary-foreground font-medium">
                                            {course.level}
                                        </span>
                                    </div>
                                    <CardTitle className="text-xl font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2">
                                        {course.title}
                                    </CardTitle>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
                                        <User className="h-4 w-4" />
                                        <span>By <span className="text-foreground font-medium">{course.mentor_name || course.mentor || "Expert Mentor"}</span></span>
                                    </div>
                                </CardHeader>
                                <CardContent className="px-6 py-2 flex-grow">
                                    <p className="text-sm text-muted-foreground line-clamp-3">
                                        {course.description}
                                    </p>
                                </CardContent>
                                <CardFooter className="p-6 pt-4 mt-auto">
                                    <div className="flex flex-col w-full gap-4">
                                        <div className="w-full h-px bg-border/50" />
                                        <div className="flex items-center justify-between">
                                            <div className="flex flex-col">
                                                <span className="text-xs text-muted-foreground">Harga</span>
                                                <span className="text-lg font-bold text-primary">
                                                    {formatPrice(course.price)}
                                                </span>
                                            </div>
                                            <Button
                                                onClick={() => router.push(`/courses/${course.id}`)}
                                                size="sm"
                                                className="bg-primary hover:bg-primary/90 text-white px-6"
                                            >
                                                Lihat Detail
                                            </Button>
                                        </div>
                                    </div>
                                </CardFooter>
                            </Card>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-10 text-muted-foreground">
                            Belum ada kelas yang tersedia saat ini.
                        </div>
                    )}
                </div>

                <div className="mt-12 text-center">
                    <Button variant="outline" size="lg" className="border-dashed text-muted-foreground hover:bg-secondary">
                        Lihat Semua Kelas
                    </Button>
                </div>
            </div >
        </section >
    );
}
