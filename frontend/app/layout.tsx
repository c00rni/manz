'use client'

import './globals.css'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import { useState, useEffect } from 'react'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    useEffect(() => {
        setIsLoggedIn(!!localStorage.getItem('token'))
    }, [])

    const handleLogout = () => {
        localStorage.removeItem('token')
        setIsLoggedIn(false)
    }

    return (
        <html lang="en">
            <body className={inter.className}>
                <nav className="bg-gray-800 text-white p-4">
                    <div className="container mx-auto flex justify-between items-center">
                        <Link href="/" className="text-xl font-bold">Meal Planner</Link>
                        <div className="space-x-4">
                            {isLoggedIn ? (
                                <>
                                    <Link href="/recipes">Recipes</Link>
                                    <Link href="/schedule">Schedule</Link>
                                    <Link href="/items">Items</Link>
                                    <button onClick={handleLogout}>Logout</button>
                                </>
                            ) : (
                                <>
                                    <Link href="/login">Login</Link>
                                    <Link href="/register">Register</Link>
                                </>
                            )}
                        </div>
                    </div>
                </nav>
                <main className="container mx-auto mt-8 px-4">
                    {children}
                </main>
            </body>
        </html>
    )
}
