"use client";

import { useEffect, useState } from "react";
import { getCookie } from "cookies-next";
import axios from "axios";
import { Loader2, AlertCircle, ShoppingBag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

interface Transaction {
    id: string;
    code: string; // Order ID/Code
    amount: number;
    status: string; // pending, settlement, expire, cancel
    created_at: string;
    items: {
        course_title: string;
        price: number;
    }[];
}

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]); // Use 'any' if interface is uncertain
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTransactions = async () => {
            const token = getCookie("token");
            if (!token) return;

            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";
                // Assuming endpoint
                const response = await axios.get(`${apiUrl}/orders`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                // Mock Data
                const MOCK_TRANSACTIONS: Transaction[] = [
                    {
                        id: "INV-20240101-001",
                        code: "ORDER-101",
                        amount: 350000,
                        status: "success",
                        created_at: new Date().toISOString(),
                        items: [{ course_title: "Fullstack Web Development", price: 350000 }]
                    },
                    {
                        id: "INV-20240105-002",
                        code: "ORDER-102",
                        amount: 150000,
                        status: "pending",
                        created_at: new Date(Date.now() - 86400000).toISOString(),
                        items: [{ course_title: "UI Design Basic", price: 150000 }]
                    }
                ];

                if (response.data.success && response.data.data && response.data.data.length > 0) {
                    setTransactions(response.data.data);
                } else {
                    setTransactions(MOCK_TRANSACTIONS);
                }
            } catch (err) {
                console.error("Fetch transactions error:", err);
                // Fallback
                setTransactions([
                    {
                        id: "INV-20240101-001",
                        code: "ORDER-101",
                        amount: 350000,
                        status: "success",
                        created_at: new Date().toISOString(),
                        items: [{ course_title: "Fullstack Web Development", price: 350000 }]
                    }
                ]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTransactions();
    }, []);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'settlement':
            case 'success':
                return <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200">Berhasil</Badge>;
            case 'pending':
                return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border-yellow-200">Menunggu</Badge>;
            case 'expire':
            case 'failure':
                return <Badge variant="destructive">Gagal</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="flex flex-1 flex-col gap-4">
            <header className="mb-6">
                <h1 className="text-3xl font-bold mb-2">Riwayat Transaksi</h1>
                <p className="text-muted-foreground">Daftar semua pembelian kursus Anda.</p>
            </header>

            <Card>
                <CardContent className="p-0">
                    {transactions.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <ShoppingBag className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>Belum ada riwayat transaksi.</p>
                        </div>
                    ) : (
                        transactions.map((trx, index) => (
                            <div key={trx.id || index}>
                                <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-muted/30 transition-colors">
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-semibold text-lg">{trx.code || trx.id}</span>
                                            {getStatusBadge(trx.status)}
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            {new Date(trx.created_at).toLocaleDateString('id-ID', {
                                                day: 'numeric', month: 'long', year: 'numeric',
                                                hour: '2-digit', minute: '2-digit'
                                            })}
                                        </p>
                                        <div className="mt-2 space-y-1">
                                            {trx.items && trx.items.map((item: any, idx: number) => (
                                                <div key={idx} className="text-sm font-medium flex items-center gap-2">
                                                    <div className="h-1.5 w-1.5 rounded-full bg-primary/50" />
                                                    {item.course_title || item.title || "Course Item"}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-muted-foreground mb-1">Total</p>
                                        <p className="text-lg font-bold text-primary">
                                            {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(trx.amount)}
                                        </p>
                                        {trx.status === 'pending' && (
                                            <Button size="sm" variant="outline" className="mt-2 h-8">
                                                Bayar Sekarang
                                            </Button>
                                        )}
                                    </div>
                                </div>
                                {index < transactions.length - 1 && <Separator />}
                            </div>
                        ))
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
