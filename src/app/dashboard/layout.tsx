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

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        const token = getCookie("token");
        if (!token) {
            router.push("/login?redirect_to=/dashboard");
        } else {
            setIsAuthorized(true);
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
                    <UserSidebar />
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
