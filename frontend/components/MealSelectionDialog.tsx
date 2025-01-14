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
import { Recipe } from "@/lib/types"
import { GetRecipes, CreateMeal } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

interface MealSelectionDialogProps {
    isOpen: boolean
    onClose: () => void
    onSelectMeal: (meal: string, guests: number) => void
    date: Date | null
    editingMeal: { name: string; guests: number } | null
}

export default function MealSelectionDialog({ isOpen, onClose, onSelectMeal, date, editingMeal }: MealSelectionDialogProps) {
    const [searchTerm, setSearchTerm] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [recipes, setRecipes] = useState<Recipe[]>([])
    const [guests, setGuests] = useState(1)
    const { toast } = useToast()
    const recipesPerPage = 10

    const fetchRecipes = async (query: string = "") => {
        try {
            const response = await GetRecipes(query)
            const recipes = await response.json()

            if (response.status !== 200) {
                toast({
                    title: "Error",
                    description: "An unexpected error occurred. Please try again later.",
                })
                return
            }

            setRecipes(recipes)
        } catch {
            toast({
                title: "Error",
                description: "An unexpected error occurred. Please try again later.",
            })
        }
    }

    useEffect(() => {
        fetchRecipes()
    }, [])

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

    const filteredRecipes = recipes.filter(recipe =>
        recipe.title.toLowerCase().includes(searchTerm?.toLowerCase() || '')
    )

    const indexOfLastRecipe = currentPage * recipesPerPage
    const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage
    const currentRecipes = filteredRecipes.slice(indexOfFirstRecipe, indexOfLastRecipe)

    const totalPages = Math.ceil(filteredRecipes.length / recipesPerPage)

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    const handleSelectMeal = async (recipe: Recipe) => {
        if (date) {
            const response = await CreateMeal(recipe.id, date)
            if (!response.ok) {
                const errorData = await response.json();
                toast({
                    variant: "destructive",
                    title: "Failed to create a Meal",
                    description: errorData.message || "An error occurred during the meal creation process, please try later.",
                });
            }
        }
        onClose()
    }

    const searchForRecipe = async (userInput: string) => {
        setCurrentPage(1)
        try {
            const response = await GetRecipes(userInput);

            if (response.ok) {
                const data = await response.json();
                setRecipes(data);
            } else {
                console.error("Failed to fetch recipes:", response.statusText);
            }
        } catch (error) {
            console.error("An error occurred while searching for recipes:", error);
        }
    }

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{editingMeal ? 'Edit' : 'Select'} a Meal for {date ? formatDate(date) : ''}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="guests" className="text-right">
                            Guests
                        </Label>
                        <Select value={(guests || "").toString()} onValueChange={(value) => setGuests(parseInt(value))}>
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
                                searchForRecipe(e.target.value)
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
                                {recipe.title}
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


