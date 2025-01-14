"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from 'lucide-react'
import Link from "next/link"
import { ShoppingList } from "@/components/ShoppingList"
import { Item } from "@/lib/types"
import { GetItems } from "@/lib/utils"
import { useState, useEffect } from 'react'

export default function ShoppingListPage() {
    // This is a placeholder implementation. In a real application, you would fetch this data from an API or calculate it based on the meals and their recipes.
    const [shoppingItems, setShoppingItems] = useState<Item[]>([])

    const fetchItems = async () => {
        try {
            // Calculate the end of the current week (Sunday at 23:59:59)
            const now = new Date();
            const dayOfWeek = now.getDay(); // 0 (Sunday) to 6 (Saturday)
            const daysUntilSunday = 7 - dayOfWeek; // Days remaining in the week
            const endDate = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate() + daysUntilSunday,
                23, // Hours
                59, // Minutes
                59, // Seconds
                999 // Milliseconds
            );

            const response = await GetItems(endDate);
            const items = await response.json()
            setShoppingItems(items)

            if (!response.ok) {
                console.error("Failed to fetch items:", response.statusText);
            }

        } catch (error) {
            console.error("Error fetching items:", error);
        }
    };

    useEffect(() => {
        fetchItems()
    }, [])

    return (
        <div className="container mx-auto p-4">
            <Card className="w-full max-w-2xl mx-auto">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-2xl font-bold">Shopping List</CardTitle>
                    <Link href="/planner">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Planner
                        </Button>
                    </Link>
                </CardHeader>
                <CardContent>
                    <ShoppingList items={shoppingItems} />
                </CardContent>
            </Card>
        </div>
    )
}
