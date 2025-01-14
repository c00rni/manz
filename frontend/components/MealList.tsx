import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Meal {
    recipe_title: string;
    guests: number;
}

interface MealListProps {
    meals: Meal[]
    onEditMeal: (meal: Meal) => void
}

export default function MealList({ meals, onEditMeal }: MealListProps) {
    if (meals.length === 0) {
        return <p className="text-gray-500 italic">No meals planned</p>
    }

    return (
        <div className="flex overflow-x-auto space-x-2 pb-2">
            {meals.map((meal, index) => (
                <Button
                    key={index}
                    variant="ghost"
                    className="p-0 h-auto"
                    onClick={() => onEditMeal(meal)}
                >
                    <Card className="flex-shrink-0">
                        <CardContent className="p-3">
                            <p className="text-sm font-medium">{meal.recipe_title}</p>
                            <p className="text-xs text-gray-500">Guests: {meal.guests}</p>
                        </CardContent>
                    </Card>
                </Button>
            ))}
        </div>
    )
}


