export interface Ingredient {
    name: string;
    image_url?: string;
    quantity_type: string;
}

export interface RecipeItem {
    item: Ingredient;
    quantity: number
}

export interface Recipe {
    id: number;
    title: string;
    description: string;
    recipe_items: RecipeItem[];
}
