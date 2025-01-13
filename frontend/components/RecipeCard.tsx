import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2 } from 'lucide-react'
import { Recipe, RecipeItem } from "@/lib/types"

interface RecipeCardProps {
    recipe: Recipe
    onDelete: () => void
}

export default function RecipeCard({ recipe, onDelete }: RecipeCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
                <CardTitle>{recipe.title}</CardTitle>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onDelete}
                    className="h-6 w-6 text-destructive hover:text-destructive-foreground hover:bg-destructive"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </CardHeader>
            <CardContent>
                <p className="mb-2">{recipe.description}</p>
                <div className="mb-2">
                    <h4 className="font-semibold">Ingredients:</h4>
                    <ul className="list-disc list-inside">
                        {recipe.recipe_items.map((ingredient: RecipeItem, index: number) => (
                            <li key={index}>
                                {ingredient.item.name} - {ingredient.quantity} {ingredient.item.quantity_type}
                            </li>
                        ))}
                    </ul>
                </div>
            </CardContent>
        </Card>
    )
}


