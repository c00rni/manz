"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { PlusCircle, X } from 'lucide-react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Recipe, RecipeItem, Ingredient } from "@/lib/types"
interface CreateRecipeDialogProps {
    isOpen: boolean
    onClose: () => void
    onCreateRecipe: (recipe: Recipe) => void
}

const unitOptions = ["unit", "grams", "cup", "teaspoon", "tablespoon"]

export default function CreateRecipeDialog({ isOpen, onClose, onCreateRecipe }: CreateRecipeDialogProps) {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [ingredients, setIngredients] = useState<RecipeItem[]>([
        {
            item: {
                name: '',
                quantity_type: 'unit'
            },
            quantity: 0
        }
    ])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onCreateRecipe({
            title,
            description,
            recipe_items: ingredients
        })
        resetForm()
    }

    const resetForm = () => {
        setTitle('')
        setDescription('')
        setIngredients([
            {
                item: {
                    name: '',
                    quantity_type: 'unit'
                },
                quantity: 0
            }
        ])
    }

    const addIngredient = () => {
        setIngredients([...ingredients, {
            item: {
                name: '',
                quantity_type: 'unit'
            },
            quantity: 0
        }])
    }

    const removeIngredient = (index: number) => {
        setIngredients(ingredients.filter((_, i) => i !== index))
    }

    const updateIngredient = (index: number, field: keyof Ingredient | "quantity", value: string | number) => {
        const newIngredients = [...ingredients]
        if (field === "quantity") {
            newIngredients[index].quantity = Number(value)
        } else {
            newIngredients[index].item = {
                ...newIngredients[index].item,
                [field]: value
            }
        }
        setIngredients(newIngredients)
    }

    return (
        <Dialog open={isOpen} onOpenChange={() => { onClose(); resetForm(); }}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create New Recipe</DialogTitle>
                    <DialogDescription>
                        Fill in the details to create a new recipe
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Recipe Name</Label>
                            <Input
                                id="name"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>Ingredients</Label>
                            {ingredients.map((ingredient, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <Input
                                        value={ingredient.item.name}
                                        onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                                        placeholder="Ingredient name"
                                        className="flex-grow"
                                    />
                                    <Input
                                        type="number"
                                        value={ingredient.quantity}
                                        onChange={(e) => updateIngredient(index, 'quantity', e.target.value)}
                                        placeholder="Qty"
                                        className="w-20"
                                    />
                                    <Select
                                        value={ingredient.item.quantity_type}
                                        onValueChange={(value) => updateIngredient(index, 'quantity_type', value)}
                                    >
                                        <SelectTrigger className="w-[110px]">
                                            <SelectValue placeholder="Unit" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {unitOptions.map((unit) => (
                                                <SelectItem key={unit} value={unit}>
                                                    {unit}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeIngredient(index)}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                            <Button type="button" variant="outline" onClick={addIngredient}>
                                <PlusCircle className="h-4 w-4 mr-2" />
                                Add Ingredient
                            </Button>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit">Create Recipe</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

