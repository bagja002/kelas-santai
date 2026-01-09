"use client"

import * as React from "react"
import {
    BookOpen,
    LayoutDashboard,
    Settings,
    CreditCard,
    User,
    Search,
    Command
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"

// This would ideally come from a context or API
const data = {
    user: {
        name: "Pengguna",
        email: "user@kelassantai.com",
        avatar: "/avatars/user.jpg",
    },
    navMain: [
        {
            title: "Kelas Saya",
            url: "/dashboard",
            icon: BookOpen,
            isActive: true,
        },
        {
            title: "Ambil Kelas",
            url: "/",
            icon: Search,
        },
        {
            title: "Riwayat Transaksi",
            url: "/dashboard/transactions",
            icon: CreditCard,
        },
        {
            title: "Pengaturan",
            url: "/dashboard/settings",
            icon: Settings,
        },
    ],
}

interface UserSidebarProps extends React.ComponentProps<typeof Sidebar> {
    dataUser: {
        name: string;
        email: string;
        avatar: string;
    } | null;
}

export function UserSidebar({ dataUser, ...props }: UserSidebarProps) {
    // Fallback if dataUser is not provided
    const user = dataUser || data.user;
    return (
        <Sidebar
            className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
            {...props}
        >
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <a href="/dashboard">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-white p-1">
                                    <img src="/images/logo-ks.png" alt="KS" className="h-full w-full object-contain" />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-medium">Kelas Santai</span>
                                    <span className="truncate text-xs">Student Dashboard</span>
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={user} />
            </SidebarFooter>
        </Sidebar>
    )
}
