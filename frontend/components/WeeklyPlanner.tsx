import { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import MealList from './MealList';
import MealSelectionDialog from './MealSelectionDialog';
import { useToast } from "@/hooks/use-toast";
import { GetMeals } from "@/lib/utils";

type Meal = {
    recipe_title: string;
    guests: number;
};

type MealPlan = {
    [key: string]: Meal[];
};

export default function WeeklyPlanner() {
    const [currentWeekStart, setCurrentWeekStart] = useState(() => {
        const today = new Date();
        const day = today.getDay();
        const diff = today.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(today.setDate(diff));
    });

    const [meals, setMeals] = useState<MealPlan>({});
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [editingMeal, setEditingMeal] = useState<Meal | null>(null);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const { toast } = useToast();

    const getWeekDates = useCallback((startDate: Date) => {
        const dates = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            dates.push(date);
        }
        return dates;
    }, []);

    const currentWeekDates = useMemo(() => getWeekDates(currentWeekStart), [currentWeekStart, getWeekDates]);

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
    };

    const formatDateKey = (date: Date) => {
        return date.toISOString().split('T')[0];
    };

    const fetchMeals = async () => {
        const startDate = currentWeekStart;
        const endDate = new Date(currentWeekStart);
        endDate.setDate(startDate.getDate() + 6); // End date is 6 days after start date

        try {
            const response = await GetMeals(startDate, endDate);
            if (response.ok) {
                const data = await response.json();
                // Transform data into a MealPlan structure
                const loadedMeals: MealPlan = {};
                data.forEach((meal: any) => {
                    const dateKey = meal.start_date.split('T')[0];
                    if (!loadedMeals[dateKey]) {
                        loadedMeals[dateKey] = [];
                    }
                    loadedMeals[dateKey].push({
                        recipe_title: meal.recipe_title,
                        guests: meal.guests,
                    });
                });
                setMeals(loadedMeals);
            } else {
                console.error("Failed to fetch meals:", response.statusText);
            }
        } catch (error) {
            console.error("Error fetching meals:", error);
        }
    };

    useEffect(() => {
        fetchMeals();
    }, []);

    // Re-fetch meals when the week changes
    useEffect(() => {
        fetchMeals();
    }, [currentWeekStart]);

    const handleAddMeal = (date: Date) => {
        setSelectedDate(date);
        setEditingMeal(null);
        setEditingIndex(null);
        setIsDialogOpen(true);
    };

    const handleEditMeal = (date: Date, meal: Meal, index: number) => {
        setSelectedDate(date);
        setEditingMeal(meal);
        setEditingIndex(index);
        setIsDialogOpen(true);
    };

    const handleSelectMeal = (meal: string, guests: number) => {
        if (selectedDate) {
            const dateKey = formatDateKey(selectedDate);
            setMeals((prevMeals) => {
                const updatedMeals = { ...prevMeals };
                if (editingMeal && editingIndex !== null) {
                    updatedMeals[dateKey][editingIndex] = { recipe_title: meal, guests };
                } else {
                    updatedMeals[dateKey] = [...(updatedMeals[dateKey] || []), { recipe_title: meal, guests }];
                }
                return updatedMeals;
            });
        }
        setEditingMeal(null);
        setEditingIndex(null);
    };

    const handleDeleteMeal = (date: Date, index: number) => {
        const dateKey = formatDateKey(date);
        const deletedMeal = meals[dateKey][index];
        setMeals((prevMeals) => {
            const updatedMeals = { ...prevMeals };
            updatedMeals[dateKey] = updatedMeals[dateKey].filter((_, i) => i !== index);
            return updatedMeals;
        });

        toast({
            title: "Meal deleted",
            description: `${deletedMeal.recipe_title} has been removed.`,
            action: (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUndoDelete(date, index, deletedMeal)}
                >
                    Undo
                </Button>
            ),
        });
    };

    const handleUndoDelete = (date: Date, index: number, meal: Meal) => {
        const dateKey = formatDateKey(date);
        setMeals((prevMeals) => {
            const updatedMeals = { ...prevMeals };
            updatedMeals[dateKey] = [
                ...(updatedMeals[dateKey] || []).slice(0, index),
                meal,
                ...(updatedMeals[dateKey] || []).slice(index),
            ];
            return updatedMeals;
        });
    };

    const nextWeek = () => {
        setCurrentWeekStart((prevStart) => {
            const nextWeekStart = new Date(prevStart);
            nextWeekStart.setDate(prevStart.getDate() + 7);
            return nextWeekStart;
        });
    };

    const prevWeek = () => {
        setCurrentWeekStart((prevStart) => {
            const prevWeekStart = new Date(prevStart);
            prevWeekStart.setDate(prevStart.getDate() - 7);
            return prevWeekStart;
        });
    };

    const closeDialogue = () => {
        setIsDialogOpen(false)
        fetchMeals();
    }

    return (
        <Card className="h-full flex flex-col">
            <CardHeader>
                <CardTitle>Weekly Meal Planner</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <Button variant="outline" size="sm" onClick={prevWeek}>
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        Previous Week
                    </Button>
                    <span className="font-semibold">
                        {formatDate(currentWeekDates[0])} - {formatDate(currentWeekDates[6])}
                    </span>
                    <Button variant="outline" size="sm" onClick={nextWeek}>
                        Next Week
                        <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                </div>
                <div className="flex-1 overflow-y-auto pr-2">
                    {currentWeekDates.map((date) => {
                        const dateKey = formatDateKey(date);
                        return (
                            <div key={dateKey} className="mb-6">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-lg font-semibold">{formatDate(date)}</h3>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleAddMeal(date)}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        <PlusCircle className="h-5 w-5" />
                                    </Button>
                                </div>
                                <MealList
                                    meals={meals[dateKey] || []}
                                    onEditMeal={(meal, index) => handleEditMeal(date, meal, index)}
                                    onDeleteMeal={(index) => handleDeleteMeal(date, index)}
                                />
                            </div>
                        );
                    })}
                </div>
            </CardContent>
            <MealSelectionDialog
                isOpen={isDialogOpen}
                onClose={() => closeDialogue()}
                onSelectMeal={handleSelectMeal}
                date={selectedDate}
                editingMeal={editingMeal}
            />
        </Card>
    );
}
