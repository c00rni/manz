"use client"

import { useState } from 'react'
import Link from 'next/link'
import WeeklyPlanner from '@/components/WeeklyPlanner'
import RecipeList from '@/components/RecipeList'
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Bell, User, LogOut, PlusCircle, ShoppingCart } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function PlannerPage() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const router = useRouter()

    const handleLogout = () => {
        // In a real application, you would implement proper logout logic here
        localStorage.setItem("token", "")
        router.push('/')
    }

    const handleProfile = () => {
        // Implement profile navigation logic here
        console.log("Profile clicked")
    }

    return (
        <div className="container mx-auto p-4 h-screen flex flex-col">
            <header className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Meal Planner</h1>
                <div className="flex items-center space-x-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push('/grocery-list')}
                    >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Shopping List
                    </Button>
                    <Button variant="ghost" size="icon">
                        <Bell className="h-5 w-5" />
                    </Button>
                    <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end" forceMount>
                            <DropdownMenuItem onClick={handleProfile}>
                                <User className="mr-2 h-4 w-4" />
                                <span>Profile</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleLogout}>
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Log out</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </header>
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 overflow-hidden">
                <div className="lg:col-span-2 overflow-y-auto">
                    <WeeklyPlanner />
                </div>
                <div className="overflow-y-auto">
                    <RecipeList />
                </div>
            </div>
        </div>
    )
}


