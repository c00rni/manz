import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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

interface RecipeCardProps {
    recipe: Recipe
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{recipe.name}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="mb-2">{recipe.description}</p>
                <div className="mb-2">
                    <h4 className="font-semibold">Ingredients:</h4>
                    <ul className="list-disc list-inside">
                        {recipe.ingredients.map((ingredient, index) => (
                            <li key={index}>
                                {ingredient.name} - {ingredient.quantity} {ingredient.unit}
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h4 className="font-semibold">Steps:</h4>
                    <ol className="list-decimal list-inside">
                        {recipe.steps.map((step, index) => (
                            <li key={index}>{step}</li>
                        ))}
                    </ol>
                </div>
            </CardContent>
        </Card>
    )
}


