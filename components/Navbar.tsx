"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs"
import toast from "react-hot-toast"

export const Navbar = () => {
    const { setTheme } = useTheme()

    const toggleTheme = () => {
      if (document.documentElement.classList.contains("dark")) {
        setTheme("light")
      } else {
        setTheme("dark")
      }
    }
    return (
        <nav className='flex justify-between items-center px-4 h-16 bg-primary/30 text-foreground'>
            <span className="font-bold text-xl">No-Pass</span>
            <ul className='flex gap-5 items-center justify-start'>
                <li>Home</li>
                <li>About</li>
                <li>Services</li>
            </ul>
            <div className="flex gap-2 justify-center items-center" >
                {/* <DropdownMenu>
                    <DropdownMenuTrigger asChild> */}
                        <Button variant="outline" size="icon" onClick={toggleTheme}>
                            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                            <span className="sr-only">Toggle theme</span>
                        </Button>
                    {/* </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setTheme("light")}>
                            Light
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("dark")}>
                            Dark
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("system")}>
                            System
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu> */}
                <SignedOut>
                    <SignInButton />
                    <SignUpButton />
                </SignedOut>
                <SignedIn>
                    <UserButton />
                </SignedIn>
            </div>
        </nav>
    )
}
