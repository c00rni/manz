"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { PlusCircle } from 'lucide-react'
import RecipeCard from './RecipeCard'
import CreateRecipeDialog from './CreateRecipeDialog'

interface Ingredient {
    name: string;
    quantity: string;
    unit: string;
}

interface Recipe {
    id: number;
    name: string;
    description: string;
    ingredients: Ingredient[];
    steps: string[];
}

// Updated mock data for recipes
const initialRecipes: Recipe[] = [
    {
        id: 1,
        name: 'Spaghetti Carbonara',
        description: 'Classic Italian pasta dish',
        ingredients: [
            { name: 'Spaghetti', quantity: '400', unit: 'grams' },
            { name: 'Eggs', quantity: '4', unit: 'unit' },
            { name: 'Pancetta', quantity: '200', unit: 'grams' },
            { name: 'Parmesan cheese', quantity: '1', unit: 'cup' }
        ],
        steps: ['Cook pasta', 'Fry pancetta', 'Mix eggs and cheese', 'Combine all ingredients']
    },
    {
        id: 2,
        name: 'Chicken Stir Fry',
        description: 'Quick and easy stir-fried chicken',
        ingredients: [
            { name: 'Chicken breast', quantity: '500', unit: 'grams' },
            { name: 'Mixed vegetables', quantity: '2', unit: 'cup' },
            { name: 'Soy sauce', quantity: '2', unit: 'tablespoon' }
        ],
        steps: ['Cut chicken', 'Stir-fry vegetables', 'Add chicken and sauce']
    },
]

export default function RecipeList() {
    const [searchTerm, setSearchTerm] = useState('')
    const [recipes, setRecipes] = useState<Recipe[]>(initialRecipes)
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const filteredRecipes = recipes.filter(recipe =>
        recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.description.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleCreateRecipe = (newRecipe: Omit<Recipe, 'id'>) => {
        const recipeWithId = {
            ...newRecipe,
            id: recipes.length + 1
        }
        setRecipes([...recipes, recipeWithId])
        setIsDialogOpen(false)
    }

    return (
        <Card className="h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle>Recipe List</CardTitle>
                <Button size="sm" onClick={() => setIsDialogOpen(true)}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Create Recipe
                </Button>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden flex flex-col">
                <Input
                    type="text"
                    placeholder="Search recipes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="mb-4"
                />
                <div className="flex-1 overflow-y-auto pr-2">
                    <div className="grid gap-4">
                        {filteredRecipes.map(recipe => (
                            <RecipeCard key={recipe.id} recipe={recipe} />
                        ))}
                    </div>
                    {filteredRecipes.length === 0 && (
                        <p className="text-center text-gray-500 mt-4">No recipes found.</p>
                    )}
                </div>
            </CardContent>
            <CreateRecipeDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onCreateRecipe={handleCreateRecipe}
            />
        </Card>
    )
}


