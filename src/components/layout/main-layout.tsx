"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

interface MainLayoutProps {
    children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
    const pathname = usePathname();
    const isDashboardOrAdmin = pathname?.startsWith("/admin") || pathname?.startsWith("/dashboard");

    return (
        <>
            {!isDashboardOrAdmin && <Navbar />}
            <main className="flex-1">
                {children}
            </main>
            {!isDashboardOrAdmin && <Footer />}
        </>
    );
}
