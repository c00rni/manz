"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
} from "@/components/ui/pagination"

interface MealSelectionDialogProps {
    isOpen: boolean
    onClose: () => void
    onSelectMeal: (meal: string, guests: number) => void
    date: string
    editingMeal: { name: string; guests: number } | null
}

// Mock data for recipes
const mockRecipes = [
    "Spaghetti Carbonara", "Chicken Stir Fry", "Vegetable Curry", "Beef Tacos",
    "Grilled Salmon", "Mushroom Risotto", "Caesar Salad", "Margherita Pizza",
    "Beef Burger", "Vegetable Lasagna", "Chicken Parmesan", "Shrimp Scampi",
    "Beef Stroganoff", "Vegetable Soup", "Chicken Alfredo", "Tuna Salad",
    "Beef Stew", "Eggplant Parmesan", "Chicken Fajitas", "Tomato Basil Pasta"
]

export default function MealSelectionDialog({ isOpen, onClose, onSelectMeal, date, editingMeal }: MealSelectionDialogProps) {
    const [searchTerm, setSearchTerm] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [guests, setGuests] = useState(1)
    const recipesPerPage = 10

    useEffect(() => {
        if (editingMeal) {
            setSearchTerm(editingMeal.name)
            setGuests(editingMeal.guests)
        } else {
            setSearchTerm('')
            setGuests(1)
        }
        setCurrentPage(1)
    }, [editingMeal, isOpen])

    const filteredRecipes = mockRecipes.filter(recipe =>
        recipe.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const indexOfLastRecipe = currentPage * recipesPerPage
    const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage
    const currentRecipes = filteredRecipes.slice(indexOfFirstRecipe, indexOfLastRecipe)

    const totalPages = Math.ceil(filteredRecipes.length / recipesPerPage)

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    const handleSelectMeal = (meal: string) => {
        onSelectMeal(meal, guests)
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{editingMeal ? 'Edit' : 'Select'} a Meal for {date}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="guests" className="text-right">
                            Guests
                        </Label>
                        <Select value={guests.toString()} onValueChange={(value) => setGuests(parseInt(value))}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select number of guests" />
                            </SelectTrigger>
                            <SelectContent>
                                {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                                    <SelectItem key={num} value={num.toString()}>
                                        {num}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="search">Search Recipes</Label>
                        <Input
                            id="search"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value)
                                setCurrentPage(1)
                            }}
                            placeholder="Type to search..."
                        />
                    </div>
                    <div className="grid gap-2">
                        {currentRecipes.map((recipe, index) => (
                            <Button
                                key={index}
                                variant="outline"
                                onClick={() => handleSelectMeal(recipe)}
                            >
                                {recipe}
                            </Button>
                        ))}
                    </div>
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                                />
                            </PaginationItem>
                            {[...Array(totalPages)].map((_, i) => (
                                <PaginationItem key={i}>
                                    <PaginationLink
                                        onClick={() => handlePageChange(i + 1)}
                                        isActive={currentPage === i + 1}
                                    >
                                        {i + 1}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}
                            <PaginationItem>
                                <PaginationNext
                                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            </DialogContent>
        </Dialog>
    )
}


