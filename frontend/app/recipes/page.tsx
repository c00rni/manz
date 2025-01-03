'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Recipe {
    id: number;
    title: string;
    description: string;
}

export default function Recipes() {
    const [recipes, setRecipes] = useState<Recipe[]>([])
    const [error, setError] = useState('')

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
            } catch (error) {
                setError('An error occurred while fetching recipes')
            }
        }

        fetchRecipes()
    }, [])

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">My Recipes</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <Link href="/recipes/new" className="bg-blue-500 text-white px-4 py-2 rounded mb-4 inline-block">
                Create New Recipe
            </Link>
            <ul className="space-y-2">
                {recipes.map((recipe) => (
                    <li key={recipe.id} className="border p-4 rounded">
                        <h2 className="text-xl font-semibold">{recipe.title}</h2>
                        <p>{recipe.description}</p>
                    </li>
                ))}
            </ul>
        </div>
    )
}


