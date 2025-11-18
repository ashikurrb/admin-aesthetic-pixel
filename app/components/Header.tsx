"use client";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeftRight, Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export default function MainNav() {
  return (
    <header>
      {" "}
      <div className="container mx-auto flex h-25 items-center justify-between px-4">
        <Link href="/" className="shrink-0">
          <Image
            src="/logo.png"
            alt="Aesthetic Pixel Logo"
            width={100}
            height={40}
            className="block dark:hidden"
          />
          <Image
            src="/logoDark.png"
            alt="Aesthetic Pixel Logo Dark"
            width={100}
            height={40}
            className="hidden dark:block"
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex flex-1 justify-center items-center space-x-6 relative">
          <span className="space-y-2 my-5">
            <h1 className="font-bold text-2xl">Welcome Back</h1>
            <p className="text-md">
              Here&apos;s what&apos;s happening with your photography portfolio
              today.
            </p>
          </span>
        </nav>

        {/* Desktop Book a Slot Button */}
        <span className="hidden md:inline-flex text-foreground me-3">
          <Link href="/studio-rent" target="_blank" rel="noopener noreferrer">
            <Button
              variant="secondary"
              className="cursor-pointer text-black dark:text-white font-bold text-lg"
            >
              Rent Studio
            </Button>
          </Link>
        </span>

        {/* Mobile Menu */}
          <h1 className="sm:hidden block font-bold text-2xl text-center">Aesthetic Pixel Studio</h1>
        <div className="flex items-center gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <button className="p-2 rounded hover:bg-muted text-foreground">
                <Menu size={24} />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-background">
              <SheetHeader>
                <SheetTitle>Admin Dashboard</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col space-y-2">
                {/* Quote */}
                <SheetClose asChild>
                  <Link
                    href="/studio-rent"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full mt-5 px-8 block"
                  >
                    <Button variant="secondary" className="w-full font-bold">
                      <ArrowLeftRight className="w-5 h-5" />
                      Rent Studio
                    </Button>
                  </Link>
                </SheetClose>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
