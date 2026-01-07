"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getCookie } from "cookies-next";
import { ArrowLeft, Video, PlayCircle, FileText, Calendar, Clock, ExternalLink, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface Session {
    id: number;
    title: string;
    description: string;
    date: string;
    time: string;
    status: "upcoming" | "completed" | "missed";
    zoomLink?: string;
    recordingLink?: string;
    pptLink?: string;
}

export default function LearningPage() {
    const router = useRouter();
    const params = useParams();
    const [isLoading, setIsLoading] = useState(true);

    // Mock Data
    const courseTitle = "Mastering React.js & Next.js"; // In real app, fetch from ID
    const sessions: Session[] = [
        {
            id: 1,
            title: "Introduction to React Ecosystem",
            description: "Understanding the Virtual DOM, JSX, and setting up the environment using Vite.",
            date: "Senin, 12 Feb 2024",
            time: "19:30 - 21:00 WIB",
            status: "completed",
            recordingLink: "https://youtube.com/watch?v=mock-recording-1",
            pptLink: "/downloads/session-1.pdf"
        },
        {
            id: 2,
            title: "React Hooks Deep Dive",
            description: "Mastering useState, useEffect, useMemo, and useCallback.",
            date: "Kamis, 15 Feb 2024",
            time: "19:30 - 21:00 WIB",
            status: "completed",
            recordingLink: "https://youtube.com/watch?v=mock-recording-2",
            pptLink: "/downloads/session-2.pdf"
        },
        {
            id: 3,
            title: "Next.js 14 App Router",
            description: "Server Components, Client Components, and the new routing system.",
            date: "Senin, 19 Feb 2024",
            time: "19:30 - 21:00 WIB",
            status: "upcoming",
            zoomLink: "https://zoom.us/j/mock-meeting-id",
            pptLink: "/downloads/session-3-preview.pdf"
        },
        {
            id: 4,
            title: "Data Fetching & Server Actions",
            description: "Fetching data on the server and handling mutations without API routes.",
            date: "Kamis, 22 Feb 2024",
            time: "19:30 - 21:00 WIB",
            status: "upcoming"
        }
    ];

    useEffect(() => {
        // Simulate auth check and loading
        const token = getCookie("token");
        if (!token) {
            router.push(`/login?redirect_to=/dashboard/learning/${params.id}`);
            return;
        }

        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 800);

        return () => clearTimeout(timer);
    }, [router, params.id]);

    if (isLoading) {
        return (
            <div className="flex h-full flex-col items-center justify-center gap-4 min-h-[50vh]">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                <p className="text-muted-foreground animate-pulse">Memuat materi kelas...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" onClick={() => router.push("/dashboard")}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">{courseTitle}</h1>
                    <p className="text-muted-foreground">Fullstack Development Bootcamp</p>
                </div>
            </div>

            <Separator />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Jadwal & Materi</h2>
                    <Badge variant="outline" className="px-3 py-1">
                        {sessions.length} Pertemuan
                    </Badge>
                </div>

                <div className="grid gap-4">
                    {sessions.map((session, index) => (
                        <Card key={session.id} className="overflow-hidden border-l-4 border-l-primary/50 hover:border-l-primary transition-all">
                            <CardContent className="p-6">
                                <div className="flex flex-col md:flex-row md:items-start gap-6">
                                    {/* Meeting Number */}
                                    <div className="flex-shrink-0">
                                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
                                            {index + 1}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 space-y-3">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                                            <h3 className="text-lg font-bold">{session.title}</h3>
                                            <Badge
                                                variant={session.status === 'upcoming' ? 'default' : 'secondary'}
                                                className={session.status === 'upcoming' ? 'bg-primary text-primary-foreground' : ''}
                                            >
                                                {session.status === 'upcoming' ? 'Akan Datang' : 'Selesai'}
                                            </Badge>
                                        </div>

                                        <p className="text-muted-foreground text-sm leading-relaxed">
                                            {session.description}
                                        </p>

                                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground pt-1">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4 text-primary" />
                                                <span>{session.date}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock className="h-4 w-4 text-primary" />
                                                <span>{session.time}</span>
                                            </div>
                                        </div>

                                        <Separator className="my-4" />

                                        {/* Action Buttons */}
                                        <div className="flex flex-wrap gap-3">
                                            {session.zoomLink ? (
                                                <Button
                                                    onClick={() => window.open(session.zoomLink, '_blank')}
                                                    size="sm"
                                                    className="gap-2 shadow-sm shadow-primary/20"
                                                >
                                                    <Video className="h-4 w-4" />
                                                    Join Zoom Meeting
                                                </Button>
                                            ) : session.status === 'upcoming' ? (
                                                <Button disabled variant="secondary" size="sm" className="gap-2 opacity-50">
                                                    <Video className="h-4 w-4" />
                                                    Link Belum Tersedia
                                                </Button>
                                            ) : null}

                                            {session.recordingLink && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => window.open(session.recordingLink, '_blank')}
                                                    className="gap-2 border-primary/20 hover:bg-primary/5"
                                                >
                                                    <PlayCircle className="h-4 w-4 text-primary" />
                                                    Tonton Rekaman
                                                </Button>
                                            )}

                                            {session.pptLink && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => window.open(session.pptLink, '_blank')}
                                                    className="gap-2 hover:bg-secondary"
                                                >
                                                    <FileText className="h-4 w-4" />
                                                    Download Materi (PDF)
                                                </Button>
                                            )}

                                            {!session.zoomLink && !session.recordingLink && !session.pptLink && session.status === 'completed' && (
                                                <p className="text-sm italic text-muted-foreground self-center">Materi belum diupload.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
