import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Recipe, RecipeItem } from "@/lib/types"

interface RecipeCardProps {
    recipe: Recipe
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{recipe.title}</CardTitle>
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


