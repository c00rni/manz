'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Recipe {
    id: string; // Adjust type to match your API data
    name: string;
}


export default function NewMeal() {
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [people, setPeople] = useState(1)
    const [recipeId, setRecipeId] = useState('')
    const [recipes, setRecipes] = useState<Recipe[]>([])
    const router = useRouter()

    useEffect(() => {
        const fetchRecipes = async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/recipes`)
            if (res.ok) {
                const data = await res.json()
                setRecipes(data)
            }
        }
        fetchRecipes()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/schedule/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ recipeId, startDate, endDate, people }),
            });
            if (response.ok) {
                router.push('/meals')
            } else {
                // Handle errors
            }
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-4">Schedule New Meal</h1>
            <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className="w-full p-2 mb-4 border rounded"
            />
            <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
                className="w-full p-2 mb-4 border rounded"
            />
            <input
                type="number"
                value={people}
                onChange={(e) => setPeople(parseInt(e.target.value))}
                min="1"
                required
                className="w-full p-2 mb-4 border rounded"
            />
            <select
                value={recipeId}
                onChange={(e) => setRecipeId(e.target.value)}
                required
                className="w-full p-2 mb-4 border rounded"
            >
                <option value="">Select a recipe</option>
                {recipes.map((recipe) => (
                    <option key={recipe.id} value={recipe.id}>
                        {recipe.name}
                    </option>
                ))}
            </select>
            <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
                Schedule Meal
            </button>
        </form>
    )
}

