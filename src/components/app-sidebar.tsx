"use client"

import * as React from "react"
import {
  BookOpen,
  LayoutDashboard,
  Settings,
  Users,
  ShieldCheck,
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

const data = {
  user: {
    name: "Admin Kelas Santai",
    email: "admin@kelassantai.com",
    avatar: "/avatars/admin.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Kelola Kelas",
      url: "/admin/courses",
      icon: BookOpen,
      items: [
        {
          title: "Daftar Kelas",
          url: "/admin/courses",
        },
        {
          title: "Tambah Kelas",
          url: "/admin/courses/create",
        },
      ],
    },
    {
      title: "Mentors",
      url: "/admin/mentors",
      icon: Users,
    },
    {
      title: "Pengguna",
      url: "/admin/users",
      icon: Users,
    },
    {
      title: "Pengaturan",
      url: "/admin/settings",
      icon: Settings,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/admin/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-white p-1">
                  <img src="/images/logo-ks.png" alt="KS" className="h-full w-full object-contain" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Kelas Santai</span>
                  <span className="truncate text-xs">Admin Panel</span>
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
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}

