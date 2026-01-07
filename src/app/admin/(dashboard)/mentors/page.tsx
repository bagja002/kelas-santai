"use client";

import Link from "next/link";
import { Plus, Search, Pencil, Trash2, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import axios from "axios";
import { getCookie } from "cookies-next";
import { Mentor } from "@/lib/constants";

export default function MentorsPage() {
    const [mentors, setMentors] = useState<Mentor[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchMentors = async () => {
        try {
            setIsLoading(true);
            const token = getCookie("admin_token");
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

            const response = await axios.get(`${apiUrl}/mentors`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Assuming API returns { data: Mentor[] } or similar
            // Adjust based on actual API response structure
            setMentors(response.data.data || []);
        } catch (error) {
            console.error("Fetch mentors error:", error);
            toast.error("Gagal memuat data mentor");
            setMentors([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMentors();
    }, []);

    const filteredMentors = mentors.filter((mentor) =>
        mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mentor.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDelete = async (id: string) => {
        if (!confirm("Apakah Anda yakin ingin menghapus mentor ini?")) return;

        try {
            const token = getCookie("admin_token");
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

            await axios.delete(`${apiUrl}/mentors/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            toast.success("Mentor berhasil dihapus");
            fetchMentors(); // Refresh list
        } catch (error: any) {
            console.error("Delete mentor error:", error);
            const msg = error.response?.data?.message || "Gagal menghapus mentor";
            toast.error(msg);
        }
    };

    return (
        <div className="space-y-6 w-full">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Mentors</h2>
                    <p className="text-muted-foreground">Kelola daftar mentor dan pengajar.</p>
                </div>
                <Button asChild>
                    <Link href="/admin/mentors/create">
                        <Plus className="mr-2 h-4 w-4" /> Tambah Mentor
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-base font-normal">Daftar Mentor</CardTitle>
                    <div className="flex items-center space-x-2">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Cari mentor..."
                                className="pl-8 w-[200px] lg:w-[300px]"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[80px]">Avatar</TableHead>
                                <TableHead>Nama Lengkap</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead className="w-[100px] text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center">
                                        Memuat data...
                                    </TableCell>
                                </TableRow>
                            ) : filteredMentors.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center">
                                        Tidak ada mentor ditemukan.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredMentors.map((mentor) => (
                                    <TableRow key={mentor.id}>
                                        <TableCell>
                                            <Avatar>
                                                <AvatarImage src={mentor.avatar} alt={mentor.name} />
                                                <AvatarFallback>{mentor.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {mentor.gelar_depan} {mentor.name} {mentor.gelar_belakang}
                                        </TableCell>
                                        <TableCell>{mentor.email}</TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <span className="sr-only">Open menu</span>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/admin/mentors/${mentor.id}/edit`}>
                                                            <Pencil className="mr-2 h-4 w-4" /> Edit
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(mentor.id)}>
                                                        <Trash2 className="mr-2 h-4 w-4" /> Hapus
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
