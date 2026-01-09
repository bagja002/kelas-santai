"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getCookie } from "cookies-next";
import axios from "axios";
import { Loader2, BookOpen, AlertCircle, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Define type for User Course
interface UserCourse {
    id: number | string;
    course_id: number | string;
    status: string; // e.g., "active", "completed", "pending_payment"
    progress?: number;
    course: {
        id: number | string;
        title: string;
        image?: string;
        picture?: string;
        level: string;
        mentor?: string;
        mentor_name?: string;
        total_modules?: number;
    };
}

export default function DashboardPage() {
    const router = useRouter();
    const [courses, setCourses] = useState<UserCourse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCourses = async () => {
            const token = getCookie("token");
            if (!token) return;

            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";
                // Assuming this endpoint returns active/purchased courses
                const response = await axios.get(`${apiUrl}/user-courses/my-courses`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (response.data.success) {
                    // Set courses to the data array, or empty array if null/undefined
                    setCourses(response.data.data || []);
                }
            } catch (err) {
                console.error("Fetch courses error:", err);
                // Fallback to mock data on error

            } finally {
                setIsLoading(false);
            }
        };

        fetchCourses();
    }, []);

    // Filter only courses that have a valid course object attached to them
    const validCourses = courses.filter(item => item && item.course);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
                <div className="bg-red-50 p-4 rounded-full mb-4">
                    <AlertCircle className="h-8 w-8 text-red-500" />
                </div>
                <h1 className="text-2xl font-bold mb-2">Terjadi Kesalahan</h1>
                <p className="text-muted-foreground mb-6">{error}</p>
                <Button onClick={() => window.location.reload()}>Coba Lagi</Button>
            </div>
        );
    }

    return (
        <div className="flex flex-1 flex-col gap-4">
            {validCourses.length > 0 && (
                <header className="mb-6">
                    <h1 className="text-3xl font-bold mb-2">Kelas Saya</h1>
                    <p className="text-muted-foreground">Lanjutkan pembelajaran Anda dan capai target baru.</p>
                </header>
            )}

            {validCourses.length === 0 ? (
                <div className="text-center py-20 bg-secondary/20 rounded-2xl border border-border border-dashed">
                    <div className="bg-background w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border shadow-sm">
                        <BookOpen className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h2 className="text-xl font-semibold mb-2">Belum ada kelas yang diikuti</h2>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                        Anda belum mendaftar di kelas manapun. Mulai perjalanan belajar Anda sekarang!
                    </p>
                    <Button onClick={() => router.push("/courses")} size="lg">
                        Cari Kelas
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {validCourses.map((item) => (
                        <Card key={item.id} className="overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-300">
                            <div className="relative h-48 w-full group">
                                <img
                                    src={item.course?.picture || item.course?.image || "/images/placeholder.png"}
                                    alt={item.course?.title || "Course detail"}
                                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute top-3 right-3">
                                    <Badge variant={item.status === 'active' ? 'default' : 'secondary'} className="capitalize shadow-sm">
                                        {item.status === 'active' ? 'Aktif' : (item.status || 'Status')}
                                    </Badge>
                                </div>
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                    <PlayCircle className="w-12 h-12 text-white drop-shadow-lg" />
                                </div>
                            </div>
                            <CardHeader className="pb-3">
                                <div className="text-xs font-medium text-primary mb-1">{item.course?.level}</div>
                                <CardTitle className="text-lg line-clamp-2 leading-tight">
                                    {item.course?.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pb-3 flex-1">
                                <p className="text-sm text-muted-foreground mb-4">
                                    Mentor: <span className="font-medium text-foreground">{item.course?.mentor_name || item.course?.mentor || "Mentor"}</span>
                                </p>

                                {/* Progress Bar Placeholder */}
                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs text-muted-foreground">
                                        <span>Progress</span>
                                        <span>{item.progress || 0}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary transition-all duration-500"
                                            style={{ width: `${item.progress || 0}%` }}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                            <Separator className="bg-border/50" />
                            <CardFooter className="pt-4 pb-4">
                                {/* <Button className="w-full" onClick={() => router.push(`/dashboard/learning/${item.course_id}`)}>
                                    Lanjut Belajar
                                </Button> */}
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
