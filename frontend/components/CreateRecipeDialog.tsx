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

interface Ingredient {
    name: string;
    quantity: string;
    unit: string;
}

interface CreateRecipeDialogProps {
    isOpen: boolean
    onClose: () => void
    onCreateRecipe: (recipe: { name: string; description: string; ingredients: Ingredient[]; steps: string[] }) => void
}

const unitOptions = ["unit", "grams", "cup", "teaspoon", "tablespoon"]

export default function CreateRecipeDialog({ isOpen, onClose, onCreateRecipe }: CreateRecipeDialogProps) {
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [ingredients, setIngredients] = useState<Ingredient[]>([{ name: '', quantity: '', unit: 'unit' }])
    const [steps, setSteps] = useState<string[]>([''])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onCreateRecipe({
            name,
            description,
            ingredients: ingredients.filter(ing => ing.name && ing.quantity),
            steps: steps.filter(Boolean)
        })
        resetForm()
    }

    const resetForm = () => {
        setName('')
        setDescription('')
        setIngredients([{ name: '', quantity: '', unit: 'unit' }])
        setSteps([''])
    }

    const addIngredient = () => {
        setIngredients([...ingredients, { name: '', quantity: '', unit: 'unit' }])
    }

    const removeIngredient = (index: number) => {
        setIngredients(ingredients.filter((_, i) => i !== index))
    }

    const updateIngredient = (index: number, field: keyof Ingredient, value: string) => {
        const newIngredients = [...ingredients]
        newIngredients[index] = { ...newIngredients[index], [field]: value }
        setIngredients(newIngredients)
    }

    const addStep = () => {
        setSteps([...steps, ''])
    }

    const removeStep = (index: number) => {
        setSteps(steps.filter((_, i) => i !== index))
    }

    const updateStep = (index: number, value: string) => {
        const newSteps = [...steps]
        newSteps[index] = value
        setSteps(newSteps)
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
                                value={name}
                                onChange={(e) => setName(e.target.value)}
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
                                        value={ingredient.name}
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
                                        value={ingredient.unit}
                                        onValueChange={(value) => updateIngredient(index, 'unit', value)}
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
                        <div className="grid gap-2">
                            <Label>Steps</Label>
                            {steps.map((step, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <Textarea
                                        value={step}
                                        onChange={(e) => updateStep(index, e.target.value)}
                                        placeholder={`Step ${index + 1}`}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeStep(index)}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                            <Button type="button" variant="outline" onClick={addStep}>
                                <PlusCircle className="h-4 w-4 mr-2" />
                                Add Step
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

