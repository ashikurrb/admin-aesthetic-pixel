"use client";

import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import {
  BookOpen,
  CirclePlus,
  CirclePower,
  HomeIcon,
  Image,
  Settings,
  SquarePen,
  UserPlus,
  UserRound,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function AppSidebar() {
  const pathname = usePathname();

  const activeClass = "bg-red-600 text-white rounded-md p-2";
  const inactiveClass = "hover:bg-muted/50 rounded-md p-2";

  return (
    <Sidebar className="fixed left-0 top-25 w-64 h-[calc(100vh-90px)]">
      <SidebarContent className="px-8 mt-15 space-y-6">
        {/* Dashboard */}
        <div className="space-y-3">
          <Link href="/dashboard">
            <div
              className={`flex items-center gap-3 font-bold cursor-pointer ${
                pathname.startsWith("/dashboard") ? activeClass : inactiveClass
              }`}
            >
              <HomeIcon className="w-4 h-4" />
              Dashboard
            </div>
          </Link>
        </div>
        <div className="space-y-3">
          <Link href="/blog">
            <div
              className={`flex items-center gap-3 font-bold cursor-pointer ${
                pathname.startsWith("/blog") ? activeClass : inactiveClass
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Blog
            </div>
          </Link>

          <div className="ml-6 border-l border-muted-foreground/30 pl-4 space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-4 h-px bg-muted-foreground/30"></div>
              <span className="flex items-center gap-3 text-sm cursor-pointer">
                <CirclePlus className="w-4 h-4" />
                Create New Post
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-4 h-px bg-muted-foreground/30"></div>
              <span className="flex items-center gap-3 text-sm cursor-pointer">
                <SquarePen className="w-4 h-4" />
                Existing Posts
              </span>
            </div>
          </div>
        </div>

        {/* Category */}
        <div className="space-y-3 mt-4">
          <div
            className={`flex items-center gap-3 font-bold cursor-pointer ${
              pathname.startsWith("/category") ? activeClass : inactiveClass
            }`}
          >
            <Image className="w-4 h-4" />
            Category
          </div>

          {/* original submenu preserved */}
          <div className="ml-6 border-l border-muted-foreground/30 pl-4 space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-4 h-px bg-muted-foreground/30"></div>
              <span className="flex items-center gap-3 text-sm cursor-pointer">
                <CirclePlus className="w-4 h-4" />
                Add Category
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-px bg-muted-foreground/30"></div>
              <span className="flex items-center gap-3 text-sm cursor-pointer">
                <SquarePen className="w-4 h-4" />
                Preview
              </span>
            </div>
          </div>
        </div>

        {/* Users */}
        <div className="space-y-3 mt-4">
          <div
            className={`flex items-center gap-3 font-bold cursor-pointer ${
              pathname.startsWith("/users") ? activeClass : inactiveClass
            }`}
          >
            <Users className="w-4 h-4" />
            Users
          </div>

          {/* original submenu preserved */}
          <div className="ml-6 border-l border-muted-foreground/30 pl-4 space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-4 h-px bg-muted-foreground/30"></div>
              <span className="flex items-center gap-3 text-sm cursor-pointer">
                <Users className="w-4 h-4" />
                User List
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-4 h-px bg-muted-foreground/30"></div>
              <span className="flex items-center gap-3 text-sm cursor-pointer">
                <UserPlus className="w-4 h-4" />
                Add User
              </span>
            </div>
          </div>
        </div>

        {/* Settings */}
        <Link href="/settings">
          <div
            className={`flex items-center gap-3 font-bold mt-5 cursor-pointer ${
              pathname === "/settings" ? activeClass : inactiveClass
            }`}
          >
            <Settings className="w-4 h-4" />
            Settings
          </div>
        </Link>

        {/* User Profile */}
        <Link href="/profile">
          <div
            className={`flex items-center gap-3 font-bold mt-4 cursor-pointer ${
              pathname === "/profile" ? activeClass : inactiveClass
            }`}
          >
            <UserRound className="w-4 h-4" />
            User Profile
          </div>
        </Link>
      </SidebarContent>

      <SidebarFooter className="flex mb-10 ms-5">
        <div className="flex items-center gap-3 font-bold mt-4 cursor-pointer hover:bg-red-600 rounded-md max-w-full py-2 px-4 text-red-600 hover:text-white transition-colors">
          <CirclePower className="w-4 h-4" /> Logout
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
