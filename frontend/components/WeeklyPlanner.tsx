"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import MealList from './MealList'
import MealSelectionDialog from './MealSelectionDialog'

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

type Meal = {
    name: string;
    guests: number;
}

type MealPlan = {
    [key: string]: Meal[];
}

const initialMeals: MealPlan = {
    Monday: [{ name: 'Spaghetti Bolognese', guests: 4 }, { name: 'Grilled Chicken Salad', guests: 2 }],
    Wednesday: [{ name: 'Vegetable Stir Fry', guests: 3 }, { name: 'Beef Tacos', guests: 5 }]
}

export default function WeeklyPlanner() {
    const [currentWeek, setCurrentWeek] = useState(0)
    const [meals, setMeals] = useState<MealPlan>(initialMeals)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [selectedDate, setSelectedDate] = useState('')
    const [editingMeal, setEditingMeal] = useState<Meal | null>(null)
    const [editingIndex, setEditingIndex] = useState<number | null>(null)

    const handleAddMeal = (day: string) => {
        setSelectedDate(day)
        setEditingMeal(null)
        setEditingIndex(null)
        setIsDialogOpen(true)
    }

    const handleEditMeal = (day: string, meal: Meal, index: number) => {
        setSelectedDate(day)
        setEditingMeal(meal)
        setEditingIndex(index)
        setIsDialogOpen(true)
    }

    const handleSelectMeal = (meal: string, guests: number) => {
        setMeals(prevMeals => {
            const updatedMeals = { ...prevMeals }
            if (editingMeal && editingIndex !== null) {
                updatedMeals[selectedDate][editingIndex] = { name: meal, guests }
            } else {
                updatedMeals[selectedDate] = [...(updatedMeals[selectedDate] || []), { name: meal, guests }]
            }
            return updatedMeals
        })
        setEditingMeal(null)
        setEditingIndex(null)
    }

    const nextWeek = () => setCurrentWeek(prev => prev + 1)
    const prevWeek = () => setCurrentWeek(prev => Math.max(0, prev - 1))

    return (
        <Card className="h-full flex flex-col">
            <CardHeader>
                <CardTitle>Weekly Meal Planner</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <Button variant="outline" size="sm" onClick={prevWeek} disabled={currentWeek === 0}>
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        Previous Week
                    </Button>
                    <span className="font-semibold">Week {currentWeek + 1}</span>
                    <Button variant="outline" size="sm" onClick={nextWeek}>
                        Next Week
                        <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                </div>
                <div className="flex-1 overflow-y-auto pr-2">
                    {daysOfWeek.map(day => (
                        <div key={day} className="mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-lg font-semibold">{day}</h3>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleAddMeal(day)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <PlusCircle className="h-5 w-5" />
                                </Button>
                            </div>
                            <MealList
                                meals={meals[day] || []}
                                onEditMeal={(meal: Meal, index: number) => handleEditMeal(day, meal, index)}
                            />
                        </div>
                    ))}
                </div>
            </CardContent>
            <MealSelectionDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onSelectMeal={handleSelectMeal}
                date={selectedDate}
                editingMeal={editingMeal}
            />
        </Card>
    )
}


