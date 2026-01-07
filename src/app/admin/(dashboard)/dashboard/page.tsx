"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Users,
    BookOpen,
    CreditCard,
    ArrowUpRight,
    DollarSign,
    Activity
} from "lucide-react";

export default function AdminDashboardPage() {
    // Mock Data
    const stats = [
        {
            title: "Total Pendapatan",
            value: "Rp 45.200.000",
            change: "+12.5% dari bulan lalu",
            icon: DollarSign,
        },
        {
            title: "Total Pengguna",
            value: "2,350",
            change: "+180 pengguna baru",
            icon: Users,
        },
        {
            title: "Total Kelas",
            value: "14",
            change: "+2 kelas baru",
            icon: BookOpen,
        },
        {
            title: "Transaksi Aktif",
            value: "128",
            change: "+12 dari minggu lalu",
            icon: CreditCard,
        },
    ];

    const recentActivities = [
        {
            user: "Budi Santoso",
            action: "Membeli kelas",
            target: "Frontend Master",
            time: "2 menit yang lalu",
            amount: "Rp 499.000"
        },
        {
            user: "Siti Aminah",
            action: "Mendaftar akun baru",
            target: "-",
            time: "15 menit yang lalu",
            amount: "-"
        },
        {
            user: "Andi Pratama",
            action: "Menyelesaikan kelas",
            target: "Golang Backend",
            time: "1 jam yang lalu",
            amount: "-"
        },
        {
            user: "Dewi Lestari",
            action: "Membeli kelas",
            target: "UI/UX Design",
            time: "3 jam yang lalu",
            amount: "Rp 349.000"
        }
    ];

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                <p className="text-muted-foreground">Selamat datang kembali di panel admin Kelas Santai.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <Card key={stat.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {stat.title}
                            </CardTitle>
                            <stat.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground">
                                {stat.change}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Recent Activity */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Aktivitas Terbaru</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-8">
                            {recentActivities.map((activity, index) => (
                                <div key={index} className="flex items-center">
                                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                                        <Activity className="h-4 w-4 text-primary" />
                                    </div>
                                    <div className="ml-4 space-y-1">
                                        <p className="text-sm font-medium leading-none">{activity.user}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {activity.action} <span className="font-medium text-foreground">{activity.target}</span>
                                        </p>
                                    </div>
                                    <div className="ml-auto font-medium text-sm text-right">
                                        {activity.amount !== "-" ? (
                                            <span className="text-green-600 block">+{activity.amount}</span>
                                        ) : null}
                                        <span className="text-xs text-muted-foreground font-normal">{activity.time}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions (Placeholder) */}
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Aksi Cepat</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors flex items-center justify-between">
                            <span className="font-medium">Tambah Kelas Baru</span>
                            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors flex items-center justify-between">
                            <span className="font-medium">Validasi Pembayaran Manual</span>
                            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors flex items-center justify-between">
                            <span className="font-medium">Buat Pengumuman</span>
                            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
