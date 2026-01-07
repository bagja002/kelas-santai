"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    Plus,
    MoreHorizontal,
    Search,
    Pencil,
    Trash2,
    Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import axios from "axios";
import { getCookie } from "cookies-next";
import { Course } from "@/lib/constants";

export default function AdminCoursesPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [courses, setCourses] = useState<Course[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchCourses = async () => {
        try {
            setIsLoading(true);
            const token = getCookie("admin_token");
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

            const response = await axios.get(`${apiUrl}/courses`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setCourses(response.data.data || []);
        } catch (error) {
            console.error("Fetch courses error:", error);
            toast.error("Gagal memuat daftar kelas");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Apakah Anda yakin ingin menghapus kelas ini?")) return;

        try {
            const token = getCookie("admin_token");
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

            await axios.delete(`${apiUrl}/courses/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            toast.success("Kelas berhasil dihapus");
            fetchCourses();
        } catch (error) {
            console.error("Delete course error:", error);
            toast.error("Gagal menghapus kelas");
        }
    };

    const filteredCourses = courses.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (course.mentor_name || course.mentor || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Kelola Kelas</h2>
                    <p className="text-muted-foreground">Daftar semua kelas yang tersedia di platform.</p>
                </div>
                <Button asChild>
                    <Link href="/admin/courses/create">
                        <Plus className="mr-2 h-4 w-4" /> Tambah Kelas
                    </Link>
                </Button>
            </div>

            <div className="flex items-center py-4">
                <div className="relative max-w-sm w-full">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Cari kelas atau mentor..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Judul Kelas</TableHead>
                            <TableHead>Mentor</TableHead>
                            <TableHead>Harga</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Siswa</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    Memuat data kelas...
                                </TableCell>
                            </TableRow>
                        ) : filteredCourses.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    Tidak ada kelas yang ditemukan.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredCourses.map((course) => (
                                <TableRow key={course.id}>
                                    <TableCell className="font-medium">
                                        {course.title}
                                    </TableCell>
                                    <TableCell>{course.mentor_name || course.mentor}</TableCell>
                                    <TableCell>
                                        {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(course.price)}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={
                                            course.status === 'published' ? 'default' :
                                                course.status === 'draft' ? 'secondary' : 'destructive'
                                        } className="capitalize">
                                            {course.status === 'published' ? 'Aktif' :
                                                course.status === 'closed' ? 'Closed' : 'Draft'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {/* Mock students count as it's not in API yet, or random */}
                                        {Math.floor(Math.random() * 100)}
                                    </TableCell>
                                    <TableCell>
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
                                                    <Link href={`/admin/courses/${course.id}`}>
                                                        <Eye className="mr-2 h-4 w-4" /> Detail
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/admin/courses/${course.id}/edit`}>
                                                        <Pencil className="mr-2 h-4 w-4" /> Edit
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={() => handleDelete(course.id)}>
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
            </div>
            <div className="text-xs text-muted-foreground mt-4">
                Menampilkan {filteredCourses.length} dari {courses.length} kelas.
            </div>
        </div>
    );
}
