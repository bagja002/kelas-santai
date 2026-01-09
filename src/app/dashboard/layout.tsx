"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCookie } from "cookies-next";
import { Loader2 } from "lucide-react";

import { UserSidebar } from "@/components/user-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import axios from "axios";
import { toast } from "sonner";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [dataUser, setDataUser] = useState({
        name: "",
        email: "",
        avatar: "",
    });

    useEffect(() => {
        const token = getCookie("token");
        if (!token) {
            router.push("/login?redirect_to=/dashboard");
        } else {
            setIsAuthorized(true);
            const fetchUserData = async () => {
                const token = getCookie("token");
                if (!token) {
                    setIsFetching(false);
                    return;
                }

                try {
                    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";
                    // Menggunakan users/getById seperti yang diminta user
                    // Jika butuh ID spesifik, biasanya ID ada di payload token, 
                    // namun jika API didesain untuk mengambil data user aktif via token:
                    const response = await axios.get(`${apiUrl}/users/getById`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });

                    if (response.data.success) {
                        const userData = response.data.data;
                        setDataUser({

                            name: userData.name || "",
                            email: userData.email || "",
                            avatar: userData.avatar || "",

                        });
                    }
                } catch (error) {
                    console.error("Failed to fetch user data:", error);
                    toast.error("Gagal mengambil data profil");
                } finally {
                    setIsFetching(false);
                }
            };

            fetchUserData();
        }
    }, [router]);



    if (!isAuthorized) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }



    return (
        <div className="[--header-height:calc(--spacing(14))]">
            <SidebarProvider className="flex flex-col">
                <SiteHeader />
                <div className="flex flex-1">
                    <UserSidebar dataUser={dataUser} />
                    <SidebarInset>
                        <div className="flex flex-1 flex-col gap-4 p-4 md:p-8">
                            {children}
                        </div>
                    </SidebarInset>
                </div>
            </SidebarProvider>
        </div>
    );
}
