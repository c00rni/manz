"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { PlusCircle } from 'lucide-react'
import RecipeCard from './RecipeCard'
import CreateRecipeDialog from './CreateRecipeDialog'
import { Recipe } from "@/lib/types"
import { CreateRecipe, GetRecipes } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"


export default function RecipeList() {
    const [searchTerm, setSearchTerm] = useState('')
    const [recipes, setRecipes] = useState<Recipe[]>([])
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const { toast } = useToast()

    useEffect(() => {
        (async () => {
            const response = await GetRecipes()
            const recipes = await response.json()
            setRecipes(recipes)
        })()
    }, [])

    const filteredRecipes = recipes.filter(recipe =>
        recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.description.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleCreateRecipe = async (newRecipe: Recipe) => {
        const recipeWithId = {
            ...newRecipe,
            id: recipes.length + 1
        }
        try {
            const response = await CreateRecipe(newRecipe)
            if (response.status == 201) {
                setRecipes([...recipes, recipeWithId])
                setIsDialogOpen(false)
                toast({
                    title: "Recipe created.",
                    description: "A new recipe have been added to your list.",
                });
            } else {
                toast({
                    title: "Something went wrong",
                    description: "Failed to create a new recipe. Plea try later.",
                });
            }

        } catch (error) {
            toast({
                title: "Error",
                description: "An unexpected error occurred. Please try again later.",
            })
        }
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
                            <RecipeCard
                                key={recipe.id}
                                recipe={recipe}
                            />
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


