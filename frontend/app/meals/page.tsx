'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Recipe {
    id: string;
    name: string;
}

interface Meal {
    id: string;
    recipe: Recipe;
    startDate: string;
    endDate: string;
    people: number;
}

export default function Meals() {
    const [meals, setMeals] = useState<Meal[]>([])

    useEffect(() => {
        const fetchMeals = async () => {
            const token = localStorage.getItem('token')
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/manz/schedule/`, {
                headers: {
                    'Authorization': `Token ${token}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                setMeals(data);
            }
        };

        fetchMeals();
    }, []);

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">My Meals</h1>
            <Link href="/meals/new" className="bg-blue-500 text-white px-4 py-2 rounded mb-4 inline-block">
                Schedule New Meal
            </Link>
            <ul className="space-y-2">
                {meals.map((meal) => (
                    <li key={meal.id} className="border p-4 rounded">
                        <p>Recipe: {meal.recipe.name}</p>
                        <p>Start Date: {new Date(meal.startDate).toLocaleDateString()}</p>
                        <p>End Date: {new Date(meal.endDate).toLocaleDateString()}</p>
                        <p>People: {meal.people}</p>
                    </li>
                ))}
            </ul>
        </div>
    )
}
