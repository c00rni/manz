'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Recipe {
    id: number;
    title: string;
}

export default function ScheduleMeal() {
    const [recipes, setRecipes] = useState<Recipe[]>([])
    const [selectedRecipe, setSelectedRecipe] = useState('')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [error, setError] = useState('')
    const router = useRouter()

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const token = localStorage.getItem('token')
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/recipe/`, {
                    headers: {
                        'Authorization': `Token ${token}`,
                    },
                })

                if (response.ok) {
                    const data = await response.json()
                    setRecipes(data)
                } else {
                    setError('Failed to fetch recipes')
                }
            } catch {
                setError('An error occurred while fetching recipes')
            }
        }

        fetchRecipes()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        try {
            const token = localStorage.getItem('token')
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/schedule/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`,
                },
                body: JSON.stringify({
                    recipe_id: selectedRecipe,
                    start_date: startDate,
                    end_date: endDate,
                }),
            })

            if (response.ok) {
                router.push('/items')
            } else {
                setError('Failed to schedule meal')
            }
        } catch {
            setError('An error occurred while scheduling the meal')
        }
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-4">Schedule a Meal</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <select
                value={selectedRecipe}
                onChange={(e) => setSelectedRecipe(e.target.value)}
                required
                className="w-full p-2 mb-4 border rounded"
            >
                <option value="">Select a recipe</option>
                {recipes.map((recipe) => (
                    <option key={recipe.id} value={recipe.id}>
                        {recipe.title}
                    </option>
                ))}
            </select>
            <input
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className="w-full p-2 mb-4 border rounded"
            />
            <input
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
                className="w-full p-2 mb-4 border rounded"
            />
            <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
                Schedule Meal
            </button>
        </form>
    )
}


