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
    id?: number;
    title: string;
    description: string;
    recipe_items: RecipeItem[];
}

/*
self.recipe_data = {
    "title": f"{self.recipe_title}",
    "description": "A delicious chocolate cake recipe.",
    "recipe_items": [
        {
            "item": {
                "name": f"{self.first_item_name}",
                "image_url": "http://example.com/flour.jpg",
                "quantity_type": f"{self.first_item_quantity_type}",
            },
            "quantity": self.first_item_quantity,
        },
        { "item": { "name": "Sugar", "quantity_type": "cups" }, "quantity": 1 },
    ],
}
*/
