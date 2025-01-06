'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Item {
    recipe_title: string;
    item_name: string;
    quantity: number;
    quantity_type: string;
}

export default function ShoppingList() {
    const [items, setItems] = useState<Item[]>([])
    const [error, setError] = useState('')
    const router = useRouter()

    useEffect(() => {
        const fetchItems = async () => {
            const token = localStorage.getItem('token')
            if (!token) {
                router.push('/login')
                return
            }

            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/item/`, {
                    headers: {
                        'Authorization': `Token ${token}`,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setItems(data);
                } else {
                    setError('Failed to fetch shopping list')
                }
            } catch {
                setError('An error occurred while fetching the shopping list')
            }
        };

        fetchItems();
    }, [router]);

    if (error) {
        return <div className="text-red-500">{error}</div>
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Shopping List</h1>
            <ul className="space-y-2">
                {items.map((item, index) => (
                    <li key={index} className="border p-4 rounded">
                        <p>
                            <span className="font-semibold">{item.item_name}</span> - {item.quantity} {item.quantity_type}
                        </p>
                        <p className="text-sm text-gray-500">Recipe: {item.recipe_title}</p>
                    </li>
                ))}
            </ul>
        </div>
    )
}
