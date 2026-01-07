
"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MENTORS } from "@/lib/constants";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getCookie } from "cookies-next";
import axios from "axios";
import { toast } from "sonner";

type Mentor = {
    id: string;
    name: string;
    avatar: string;
    gelar_depan: string;
    gelar_belakang: string;
    deskripsi: string;
    status: string;
    created_at: string;
    updated_at: string;
};

export default function MentorsPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [mentors, setMentors] = useState<Mentor[]>([]);

    useEffect(() => {
        fetchMentors();
    }, []);

    const fetchMentors = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";
            // Attempt to fetch public mentors without admin token first
            // or just fetch general list. 
            const response = await axios.get(`${apiUrl}/mentors`);

            setMentors(response.data.data || []);
        } catch (error) {
            console.error("Fetch mentors error:", error);
            // Don't show toast on public page load fail to avoid annoyance, or use discreet one
            // toast.error("Gagal memuat data mentor"); 
        } finally {
            setIsLoading(false);
        }
    };

    const getFullName = (m: Mentor) => {
        return `${m.gelar_depan ? m.gelar_depan + ' ' : ''}${m.name}${m.gelar_belakang ? ', ' + m.gelar_belakang : ''}`.trim();
    };

    return (
        <div className="container mx-auto px-4 py-16">
            <div className="text-center mb-16">
                <h1 className="text-4xl font-bold mb-4">Mentor Kami</h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Belajar langsung dari para praktisi ahli yang berpengalaman di industri teknologi ternama.
                </p>
            </div>

            {isLoading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-[400px] w-full bg-secondary/20 animate-pulse rounded-lg" />
                    ))}
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {mentors.map((mentor) => (
                        <Card key={mentor.id} className="overflow-hidden hover:shadow-lg transition-all group">
                            <div className="relative h-64 w-full bg-secondary/20 overflow-hidden">
                                {/* <Image
                                    src={mentor.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(mentor.name)}&background=random`}
                                    alt={mentor.name}
                                    fill
                                    className="object-cover object-top group-hover:scale-105 transition-transform duration-300"
                                /> */}
                            </div>
                            <CardHeader className="text-center pb-2">
                                <CardTitle className="text-xl">{getFullName(mentor)}</CardTitle>
                                {/* Removed separate title line if titles are integrated into name, 
                                    or can separate them if preferred. Often cleaner combined. */}
                            </CardHeader>
                            <CardContent className="text-center text-muted-foreground pb-6 px-6">
                                <p className="text-sm line-clamp-3">
                                    {mentor.deskripsi || "Mentor berpengalaman di bidangnya."}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
