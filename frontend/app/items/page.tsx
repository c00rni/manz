'use client'

import { useState, useEffect } from 'react'

interface Item {
    item_name: string;
    quantity: number;
    quantity_type: string;
}

export default function Items() {
    const [items, setItems] = useState<Item[]>([])
    const [error, setError] = useState('')
    const [endDate, setEndDate] = useState('')

    const fetchItems = async () => {
        try {
            const token = localStorage.getItem('token')
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/item/?end_date=${endDate}`, {
                headers: {
                    'Authorization': `Token ${token}`,
                },
            })

            if (response.ok) {
                const data = await response.json()
                setItems(data)
            } else {
                setError('Failed to fetch items')
            }
        } catch {
            setError('An error occurred while fetching items')
        }
    }

    useEffect(() => {
        if (endDate) {
            fetchItems()
        }
    }, [endDate, fetchItems])

    return (
        <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-4">Shopping List</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full p-2 mb-4 border rounded"
            />
            <ul className="space-y-2">
                {items.map((item, index) => (
                    <li key={index} className="border p-4 rounded">
                        <p className="font-semibold">{item.item_name}</p>
                        <p>{item.quantity} {item.quantity_type}</p>
                    </li>
                ))}
            </ul>
        </div>
    )
}


