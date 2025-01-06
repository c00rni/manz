'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface RecipeItem {
    item: {
        name: string;
        quantity_type: string;
    };
    quantity: number;
}

export default function NewRecipe() {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [items, setItems] = useState<RecipeItem[]>([])
    const [error, setError] = useState('')
    const router = useRouter()

    const addItem = () => {
        setItems([...items, { item: { name: '', quantity_type: 'cups' }, quantity: 0 }])
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            console.log(items)
            const token = localStorage.getItem('token')
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/recipe/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`,
                },
                body: JSON.stringify({
                    title,
                    description,
                    recipe_items: items,
                }),
            })

            if (response.ok) {
                router.push('/recipes')
            } else {
                setError('Failed to create recipe')
            }
        } catch {
            setError('An error occurred while creating the recipe')
        }
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-4">Create New Recipe</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Recipe Title"
                required
                className="w-full p-2 mb-4 border rounded"
            />
            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
                className="w-full p-2 mb-4 border rounded"
            />
            <h2 className="text-xl font-bold mb-2">Ingredients</h2>
            {items.map((item, index) => (
                <div key={index} className="mb-4">
                    <input
                        type="text"
                        value={item.item.name}
                        onChange={(e) => {
                            const newItems = [...items]
                            newItems[index].item.name = e.target.value
                            setItems(newItems)
                        }}
                        placeholder="Item Name"
                        required
                        className="w-full p-2 mb-2 border rounded"
                    />
                    <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => {
                            const newItems = [...items]
                            newItems[index].quantity = parseFloat(e.target.value)
                            setItems(newItems)
                        }}
                        placeholder="Quantity"
                        required
                        className="w-full p-2 mb-2 border rounded"
                    />
                    <select
                        value={item.item.quantity_type}
                        onChange={(e) => {
                            const newItems = [...items]
                            newItems[index].item.quantity_type = e.target.value
                            setItems(newItems)
                        }}
                        className="w-full p-2 mb-2 border rounded"
                    >
                        <option value="cups">Cups</option>
                        <option value="grams">Grams</option>
                        <option value="units">Units</option>
                    </select>
                </div>
            ))}
            <button type="button" onClick={addItem} className="w-full p-2 mb-4 bg-gray-200 rounded">
                Add Item
            </button>
            <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
                Create Recipe
            </button>
        </form>
    )
}


