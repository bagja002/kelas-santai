"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Trash2, CreditCard, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { getCookie } from "cookies-next";
import axios from "axios";

declare global {
    interface Window {
        snap: {
            pay: (token: string, options: any) => void;
        };
    }
}

// Mock Cart Item Type
interface CartItem {
    id: string | number;
    title: string;
    mentor: string;
    price: number;
    image?: string;
    picture?: string;
    mentor_name?: string;
}

interface PaymentHistory {
    id: string;
    date: string;
    items: string[];
    amount: number;
    status: "success" | "pending" | "failed";
}

export default function CartPage() {
    const router = useRouter();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [historyItems, setHistoryItems] = useState<PaymentHistory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [snapToken, setSnapToken] = useState<string | null>(null);

    // Load snapToken from localStorage
    useEffect(() => {
        const storedToken = localStorage.getItem("snap_token_cart");
        if (storedToken) {
            setSnapToken(storedToken);
        }
    }, []);

    // Mock Data Init
    useEffect(() => {
        const token = getCookie("token");
        if (!token) {
            router.push("/login?redirect_to=/cart");
            return;
        }

        const fetchDataPending = async () => {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";
            try {
                const response = await axios.get(`${apiUrl}/user-courses/pending`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const { success, message, data } = response.data;
                if (success) {
                    setCartItems(data || []);
                } else {
                    // If no data or error, assume empty or handle gracefully
                    console.log("Cart fetch info:", message);
                    setCartItems([]);
                }
            } catch (error) {
                console.error("Error fetching cart items:", error);
                // toast.error("Gagal mengambil data keranjang"); // Optional: suppress if it's just 404
                setCartItems([]);
            } finally {
                setIsLoading(false);
            }
        }

        fetchDataPending();
    }, []);

    const handleRemove = async (id: string | number) => {
        const token = getCookie("token");
        if (!token) {
            toast.error("Silakan masuk terlebih dahulu");
            return;
        }

        const toastId = toast.loading("Menghapus kelas...");
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";
            const response = await axios.delete(`${apiUrl}/user-courses/delete?course_id=${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            });

            if (response.data.success) {
                setCartItems((prev) => prev.filter((item) => item.id !== id));
                toast.success("Kelas berhasil dihapus", { id: toastId });
            } else {
                toast.error(response.data.message || "Gagal menghapus kelas", { id: toastId });
            }
        } catch (error) {
            console.error("Delete error:", error);
            toast.error("Gagal menghapus kelas", { id: toastId });
        }
    };


    const handleCheckout = async () => {

        const token = getCookie("token");
        if (!token) {
            toast.error("Silakan masuk terlebih dahulu", {
                description: "Anda harus memiliki akun untuk mendaftar kelas.",
                action: {
                    label: "Masuk",
                    onClick: () => router.push(`/login?redirect_to=${encodeURIComponent(`/cart`)}`),
                },
            });
            return;
        }

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"; // 

            // Ubah array of id menjadi array of object sesuai keinginan backend
            const formattedData = cartItems.map((item) => ({
                course_id: item.id
            }));

            console.log(formattedData);

            const response = await axios.post(`${apiUrl}/user-courses/payment`, formattedData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const { success, message, data } = response.data;
            // Handle both structure possibilities just in case, or stick to user's latest edit
            const direct_url = data?.direct_url || response.data.direct_url;

            if (success && direct_url) {
                // Extract token from URL: .../redirection/{token}
                const snapToken = direct_url.split("/").pop();

                if (snapToken) {
                    setSnapToken(snapToken);
                    localStorage.setItem("snap_token_cart", snapToken);
                    window.snap.pay(snapToken, {
                        onSuccess: function (result: any) {
                            console.log(result);
                            toast.success("Pembayaran berhasil!", {
                                description: "Terima kasih telah membeli kelas ini.",
                            });
                            // Refresh data or redirect
                            setCartItems([]);
                            setSnapToken(null);
                            localStorage.removeItem("snap_token_cart");
                            // Optionally redirect to my-courses
                            // router.push("/my-courses");
                        },
                        onPending: function (result: any) {
                            console.log(result);
                            toast.info("Pembayaran tertunda", {
                                description: "Silakan selesaikan pembayaran Anda.",
                            });
                        },
                        onError: function (result: any) {
                            console.log(result);
                            toast.error("Pembayaran gagal", {
                                description: "Terjadi kesalahan saat memproses pembayaran.",
                            });
                        },
                        onClose: function () {
                            toast.warning("Jendela pembayaran ditutup", {
                                description: "Anda belum menyelesaikan pembayaran.",
                            });
                        }
                    });
                } else {
                    // Fallback if token extract fails but we have url
                    window.location.href = direct_url;
                }
            } else {
                toast.error("Gagal memproses pembayaran", {
                    description: message || "Terjadi kesalahan saat checkout.",
                });
            }

        } catch (error) {
            console.error("Checkout error:", error);
            toast.error("Gagal melakukan checkout!", {
                description: "Silakan coba lagi atau hubungi admin.",
            });
        }
    };

    const handleContinuePayment = () => {
        if (snapToken) {
            window.snap.pay(snapToken, {
                onSuccess: function (result: any) {
                    console.log(result);
                    toast.success("Pembayaran berhasil!", {
                        description: "Terima kasih telah membeli kelas ini.",
                    });
                    setCartItems([]);
                    setSnapToken(null);
                    localStorage.removeItem("snap_token_cart");
                },
                onPending: function (result: any) {
                    console.log(result);
                    toast.info("Pembayaran tertunda", {
                        description: "Silakan selesaikan pembayaran Anda.",
                    });
                },
                onError: function (result: any) {
                    console.log(result);
                    toast.error("Pembayaran gagal", {
                        description: "Terjadi kesalahan saat memproses pembayaran.",
                    });
                },
                onClose: function () {
                    toast.warning("Jendela pembayaran ditutup", {
                        description: "Anda belum menyelesaikan pembayaran.",
                    });
                }
            });
        }
    };

    const handleCancelPayment = () => {
        setSnapToken(null);
        localStorage.removeItem("snap_token_cart");
        toast.info("Pembayaran dibatalkan", {
            description: "Anda dapat memproses ulang pembayaran kapan saja.",
        });
    };

    const totalPrice = cartItems.reduce((acc, item) => acc + item.price, 0);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pb-20 pt-8">
            <div className="container mx-auto px-4 max-w-5xl">
                <Button
                    variant="ghost"
                    className="mb-6 pl-0 hover:bg-transparent hover:text-primary"
                    onClick={() => router.back()}
                >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
                </Button>

                <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
                    <ShoppingCart className="h-8 w-8" />
                    Keranjang Saya
                </h1>

                {cartItems.length === 0 ? (
                    <div className="text-center py-20 bg-secondary/20 rounded-2xl border border-border border-dashed">
                        <div className="bg-background w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border shadow-sm">
                            <ShoppingCart className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h2 className="text-xl font-semibold mb-2">Keranjang Anda Kosong</h2>
                        <p className="text-muted-foreground mb-6">Jangan lupa isi dengan ilmu bermanfaat!</p>
                        <Button onClick={() => router.push("/courses")} size="lg">
                            Lihat Katalog Kelas
                        </Button>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-4">
                            {cartItems.map((item) => (
                                <Card key={item.id} className="overflow-hidden flex flex-col sm:flex-row p-4 gap-4 items-center">
                                    <div className="relative h-24 w-full sm:w-32 shrink-0 rounded-lg overflow-hidden bg-secondary">
                                        <img
                                            src={item.picture || item.image || "/images/placeholder.png"}
                                            alt={item.title}
                                            className="object-cover w-full h-full"
                                        />
                                    </div>
                                    <div className="flex-1 text-center sm:text-left w-full">
                                        <h3 className="font-bold text-lg">{item.title}</h3>
                                        <p className="text-sm text-muted-foreground mb-1">Mentor: {item.mentor_name || item.mentor || "Expert Mentor"}</p>
                                        <p className="text-primary font-semibold sm:hidden">
                                            {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(item.price)}
                                        </p>
                                    </div>
                                    <div className="hidden sm:block text-right font-bold text-lg min-w-[120px]">
                                        {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(item.price)}
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-muted-foreground hover:text-destructive shrink-0"
                                        onClick={() => handleRemove(item.id)}
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </Button>
                                </Card>
                            ))}
                        </div>

                        {/* Summary */}
                        <div className="lg:col-span-1">
                            <Card className="sticky top-24 shadow-lg border-primary/20">
                                <CardHeader>
                                    <CardTitle>Rincian Pembayaran</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Total Harga ({cartItems.length} kelas)</span>
                                        <span className="font-medium">
                                            {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(totalPrice)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Diskon</span>
                                        <span className="text-green-600 font-medium">- Rp 0</span>
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between text-lg font-bold">
                                        <span>Total Tagihan</span>
                                        <span className="text-primary">
                                            {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(totalPrice)}
                                        </span>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex-col gap-3">
                                    {snapToken ? (
                                        <div className="w-full space-y-2">
                                            <Button className="w-full h-12 text-lg font-bold shadow-md shadow-primary/25" onClick={handleContinuePayment}>
                                                <CreditCard className="mr-2 h-4 w-4" />
                                                Lanjutkan Pembayaran
                                            </Button>
                                            <Button variant="outline" className="w-full border-red-200 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={handleCancelPayment}>
                                                Batalkan Pembayaran
                                            </Button>
                                        </div>
                                    ) : (
                                        <Button className="w-full h-12 text-lg font-bold shadow-md shadow-primary/25" onClick={handleCheckout}>
                                            <CreditCard className="mr-2 h-4 w-4" />
                                            Beli Sekarang
                                        </Button>
                                    )}
                                    <p className="text-xs text-center text-muted-foreground">
                                        Dengan membeli, Anda menyetujui Syarat & Ketentuan kami.
                                    </p>
                                </CardFooter>
                            </Card>
                        </div>
                    </div>
                )}
            </div>

            {/* Payment History Section */}
            <div className="container mx-auto px-4 max-w-5xl mt-12 mb-20">
                <h2 className="text-2xl font-bold mb-6">Riwayat Pembayaran</h2>
                <Card>
                    <CardContent className="p-0">
                        {historyItems.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                <p>Belum ada riwayat pembayaran.</p>
                            </div>
                        ) : (
                            historyItems.map((item, index) => (
                                <div key={item.id}>
                                    <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-muted/30 transition-colors">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-lg">{item.id}</span>
                                                <span className={`text-xs px-2 py-0.5 rounded-full capitalize border ${item.status === 'success' ? 'bg-green-100 text-green-700 border-green-200' :
                                                    item.status === 'pending' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                                                        'bg-red-100 text-red-700 border-red-200'
                                                    }`}>
                                                    {item.status === 'success' ? 'Berhasil' :
                                                        item.status === 'pending' ? 'Menunggu' : 'Gagal'}
                                                </span>
                                            </div>
                                            <p className="text-sm text-muted-foreground">{item.date}</p>
                                            <div className="mt-1">
                                                {item.items.map((courseName, idx) => (
                                                    <div key={idx} className="text-sm font-medium">{courseName}</div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-muted-foreground mb-1">Total Pembayaran</p>
                                            <p className="text-lg font-bold text-primary">
                                                {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(item.amount)}
                                            </p>
                                            {item.status === 'pending' && (
                                                <Button size="sm" variant="outline" className="mt-2 h-8">
                                                    Bayar Sekarang
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                    {index < historyItems.length - 1 && <Separator />}
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>
            </div>
        </div >
    );
}
