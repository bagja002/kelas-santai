"use client";

import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, MoreHorizontal, Mail, Phone, Calendar } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock Data
const MOCK_USERS = [
    {
        id: "USR-001",
        name: "Budi Santoso",
        email: "budi.santoso@example.com",
        role: "user",
        status: "active",
        joined_at: "2023-12-01",
        courses_count: 2
    },
    {
        id: "USR-002",
        name: "Siti Rahmawati",
        email: "siti.rahma@example.com",
        role: "user",
        status: "active",
        joined_at: "2024-01-15",
        courses_count: 5
    },
    {
        id: "USR-003",
        name: "Admin Utama",
        email: "admin@kelassantai.com",
        role: "admin",
        status: "active",
        joined_at: "2023-11-01",
        courses_count: 0
    },
    {
        id: "USR-004",
        name: "Ahmad Rizky",
        email: "ahmad.rizky@example.com",
        role: "user",
        status: "inactive",
        joined_at: "2024-02-10",
        courses_count: 1
    },
    {
        id: "USR-005",
        name: "Dewi Putri",
        email: "dewi.putri@example.com",
        role: "user",
        status: "active",
        joined_at: "2024-03-05",
        courses_count: 3
    }
];

export default function AdminUsersPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [users, setUsers] = useState(MOCK_USERS);

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Pengguna</h1>
                    <p className="text-muted-foreground">Kelola data pengguna terdaftar.</p>
                </div>
                <Button>Tambah Pengguna</Button>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Cari nama atau email..."
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
                            <TableHead className="w-[80px]">Avatar</TableHead>
                            <TableHead>Nama Pengguna</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Bergabung</TableHead>
                            <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredUsers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                    Tidak ada pengguna ditemukan.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredUsers.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <Avatar className="h-9 w-9">
                                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} />
                                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                    </TableCell>
                                    <TableCell className="font-medium">{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className="capitalize">
                                            {user.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <span className={`h-2 w-2 rounded-full ${user.status === 'active' ? 'bg-green-500' : 'bg-gray-300'}`} />
                                            <span className="capitalize text-sm">{user.status}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Calendar className="h-3 w-3" />
                                            <span className="text-sm">{user.joined_at}</span>
                                        </div>
                                    </TableCell>
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
                                                <DropdownMenuItem>Lihat Detail</DropdownMenuItem>
                                                <DropdownMenuItem>Edit Pengguna</DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-red-600">Hapus Pengguna</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
