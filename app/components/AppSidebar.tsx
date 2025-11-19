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
  Image,
  Settings,
  SquarePen,
  UserPlus,
  UserRound,
  Users,
} from "lucide-react";
import Link from "next/link";

export function AppSidebar() {
  return (
    <Sidebar className="p-5 h-screen pt-28">
      <SidebarHeader>
        <Link href="/dashboard" className="flex items-center gap-2 mb-5 mt-5 cursor-pointer">
          <Button variant="destructive" className="cursor-pointer w-full">
            Dashboard
          </Button>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {/* Blog */}
        <div className="space-y-3">
          <div className="flex items-center gap-3 font-bold">
            <BookOpen className="w-4 h-4" />
            Blog
          </div>
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
        <div className="space-y-3">
          <div className="flex items-center gap-3 font-bold">
            <Image className="w-4 h-4" />
            Category
          </div>
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
        <div className="space-y-3">
          <div className="flex items-center gap-3 font-bold">
            <Users className="w-4 h-4" />
            Users
          </div>
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
        <div className="flex items-center gap-3 font-bold mt-5 cursor-pointer">
          <Settings className="w-4 h-4" />
          Settings
        </div>
        <div className="flex items-center gap-3 font-bold mt-4 cursor-pointer">
          <UserRound className="w-4 h-4" />
          User Profile
        </div>
      </SidebarContent>
      <SidebarFooter className="flex">
        <div className="flex items-center gap-3 font-bold mt-4 cursor-pointer">
          <CirclePower className="w-4 h-4" /> Logout
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
