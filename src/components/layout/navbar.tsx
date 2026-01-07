"use client";

import Link from "next/link";
import { Coffee, Menu, User, BookOpen, Map, Zap, Users, Newspaper, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect } from "react";
import { getCookie, deleteCookie } from "cookies-next";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useRouter } from "next/navigation";
import { LogOut, User as UserIcon } from "lucide-react";

interface UserData {
    id: string;
    name: string;
    email: string;
    no_telp: string;
}

interface DecodedToken {
    user_id: string;
    role: string;
    exp: number;
}

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState<UserData | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            const token = getCookie("token");
            if (token) {
                try {
                    const decoded = jwtDecode<DecodedToken>(token as string);
                    const currentTime = Date.now() / 1000;

                    if (decoded.exp < currentTime) {
                        handleLogout();
                        return;
                    }

                    setIsLoggedIn(true);

                    // Fetch user details
                    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";
                    try {
                        const response = await axios.get(`${apiUrl}/users/${decoded.user_id}`, {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        });
                        if (response.data.success) {
                            setUser(response.data.data);
                        }

                        console.log("User data:", response.data.data);
                    } catch (error) {
                        console.error("Failed to fetch user:", error);
                    }

                } catch (error) {
                    console.error("Invalid token:", error);
                    handleLogout();
                } finally {
                    setIsLoading(false);
                }
            } else {
                setIsLoggedIn(false);
                setUser(null);
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    const handleLogout = () => {
        deleteCookie("token");
        setIsLoggedIn(false);
        setUser(null);
        router.refresh();
        window.location.reload(); // Force full reload to update all state
    };

    const NavLinks = [
        { name: "Kelas", href: "#courses" },
        { name: "Mentor", href: "#mentors" },
        { name: "Tentang Kami", href: "#about" },
    ];

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white p-1">
                        <img src="/images/logo-ks.png" alt="Logo" className="h-full w-full object-contain" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-foreground">
                        Kelas Santai
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex md:items-center md:gap-8">
                    <Link href="/courses" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                        Katalog Kelas
                    </Link>
                    <Link href="/curriculum" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                        Kurikulum
                    </Link>
                    <Link href="/flash-sale" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                        Flash Sale
                    </Link>
                    <Link href="/mentors" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                        Mentor
                    </Link>
                    <Link href="/blog" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                        Artikel
                    </Link>
                </div>

                {/* Auth Buttons (Desktop) */}
                <div className="hidden md:flex items-center gap-4">
                    {isLoading ? (
                        <div className="flex items-center gap-2">
                            <div className="h-10 w-10 animate-pulse rounded-full bg-muted/60" />
                            <div className="h-4 w-24 animate-pulse rounded bg-muted/60" />
                        </div>
                    ) : isLoggedIn && user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                                    <Avatar className="h-10 w-10 border border-primary/20">
                                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt={user.name} />
                                        <AvatarFallback className="bg-primary/10 text-primary">{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">{user.name}</p>
                                        <p className="text-xs leading-none text-muted-foreground">
                                            {user.email}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="cursor-pointer">
                                    <UserIcon className="mr-2 h-4 w-4" />
                                    <span>Profil Saya</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer" onClick={() => router.push('/cart')}>
                                    <ShoppingCart className="mr-2 h-4 w-4" />
                                    <span>Keranjang Saya</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer" onClick={() => router.push('/dashboard')}>
                                    <BookOpen className="mr-2 h-4 w-4" />
                                    <span>Dashboard</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600" onClick={handleLogout}>
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Keluar</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <>
                            <Link href="/login">
                                <Button variant="outline" className="text-primary hover:text-primary-foreground hover:bg-primary border-primary">
                                    Masuk
                                </Button>
                            </Link>
                            <Link href="/register">
                                <Button className="bg-primary hover:bg-primary/90 text-white font-semibold shadow-lg shadow-primary/20">
                                    Daftar Sekarang
                                </Button>
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Menu */}
                <div className="md:hidden">
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu className="h-6 w-6" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="bg-background">
                            <SheetHeader>
                                <SheetTitle className="flex items-center gap-2">
                                    <img src="/images/logo-ks.png" alt="Logo" className="h-6 w-6 object-contain" />
                                    Kelas Santai
                                </SheetTitle>
                            </SheetHeader>
                            <div className="mt-8 flex flex-col gap-6">
                                <Link href="/courses" onClick={() => setIsOpen(false)} className="flex items-center gap-3 text-lg font-medium text-foreground hover:text-primary transition-colors p-2 rounded-lg hover:bg-muted">
                                    <BookOpen className="h-5 w-5 text-primary" />
                                    Katalog Kelas
                                </Link>
                                <div className="h-px bg-border/50 w-full" />
                                <Link href="/curriculum" onClick={() => setIsOpen(false)} className="flex items-center gap-3 text-lg font-medium text-foreground hover:text-primary transition-colors p-2 rounded-lg hover:bg-muted">
                                    <Map className="h-5 w-5 text-primary" />
                                    Kurikulum
                                </Link>
                                <div className="h-px bg-border/50 w-full" />
                                <Link href="/flash-sale" onClick={() => setIsOpen(false)} className="flex items-center gap-3 text-lg font-medium text-foreground hover:text-primary transition-colors p-2 rounded-lg hover:bg-muted">
                                    <Zap className="h-5 w-5 text-primary" />
                                    Flash Sale
                                </Link>
                                <div className="h-px bg-border/50 w-full" />
                                <Link href="/mentors" onClick={() => setIsOpen(false)} className="flex items-center gap-3 text-lg font-medium text-foreground hover:text-primary transition-colors p-2 rounded-lg hover:bg-muted">
                                    <Users className="h-5 w-5 text-primary" />
                                    Mentor
                                </Link>
                                <div className="h-px bg-border/50 w-full" />
                                <Link href="/blog" onClick={() => setIsOpen(false)} className="flex items-center gap-3 text-lg font-medium text-foreground hover:text-primary transition-colors p-2 rounded-lg hover:bg-muted">
                                    <Newspaper className="h-5 w-5 text-primary" />
                                    Artikel
                                </Link>

                                <div className="mt-8 flex flex-col gap-3 px-4">
                                    {isLoggedIn && user ? (
                                        <>
                                            <div className="flex items-center gap-4 mb-4 p-4 rounded-lg bg-muted/50">
                                                <Avatar className="h-10 w-10">
                                                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} />
                                                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{user.name}</span>
                                                    <span className="text-xs text-muted-foreground">{user.email}</span>
                                                </div>
                                            </div>
                                            <Button variant="destructive" className="w-full justify-start" onClick={handleLogout}>
                                                <LogOut className="mr-2 h-4 w-4" />
                                                Keluar
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Link href="/login" onClick={() => setIsOpen(false)}>
                                                <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-white h-12 text-base">
                                                    Masuk
                                                </Button>
                                            </Link>
                                            <Link href="/register" onClick={() => setIsOpen(false)}>
                                                <Button className="w-full bg-primary hover:bg-primary/90 text-white h-12 text-base shadow-lg shadow-primary/20">
                                                    Daftar Sekarang
                                                </Button>
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </nav>
    );
}
