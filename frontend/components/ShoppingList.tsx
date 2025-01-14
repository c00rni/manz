import { useState, useEffect } from 'react';
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Minus } from 'lucide-react'

export interface Item {
    recipe_title: string
    item_name: string
    quantity: number
    quantity_type: string
}

interface ShoppingItem extends Item {
    checked: boolean;
}

interface ShoppingListProps {
    items: Item[];
}

export function ShoppingList({ items }: ShoppingListProps) {

    const [shoppingItems, setShoppingItems] = useState<ShoppingItem[]>([]);

    useEffect(() => {
        setShoppingItems(
            items.map(item => ({ ...item, checked: false }))
                .sort((a, b) => a.item_name.localeCompare(b.item_name))
        );
    }, [items]);

    const toggleItem = (index: number) => {
        setShoppingItems(prevItems => {
            const newItems = [...prevItems];
            newItems[index] = { ...newItems[index], checked: !newItems[index].checked }; // Ensure immutability
            return newItems.sort((a, b) => {
                if (a.checked === b.checked) {
                    return a.item_name.localeCompare(b.item_name);
                }
                return a.checked ? 1 : -1; // Checked items move to the end
            });
        });
    };

    const adjustQuantity = (index: number, amount: number) => {
        setShoppingItems(prevItems => {
            const newItems = [...prevItems];
            newItems[index] = { ...newItems[index], quantity: Math.max(0, newItems[index].quantity + amount) }; // Ensure immutability
            return newItems;
        });
    };

    if (shoppingItems.length === 0) {
        return <p>No items to display.</p>;
    }

    return (
        <div className="space-y-6">
            <div className="text-sm text-muted-foreground">
                {shoppingItems.filter(item => item.checked).length} of {shoppingItems.length} items checked
            </div>
            {shoppingItems.map((item, index) => (
                <div
                    key={`${item.item_name}-${index}`}
                    className={`flex items-center space-x-2 ${item.checked ? 'text-gray-400' : ''}`}
                >
                    <Checkbox
                        id={`item-${index}`}
                        checked={item.checked}
                        onCheckedChange={() => toggleItem(index)}
                    />
                    <label
                        htmlFor={`item-${index}`}
                        className={`flex-grow ${item.checked ? 'line-through' : ''}`}
                    >
                        {item.item_name}
                    </label>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => adjustQuantity(index, -1)}
                        >
                            <Minus className="h-4 w-4" />
                        </Button>
                        <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => {
                                const newQuantity = parseInt(e.target.value) || 0;
                                setShoppingItems(prevItems => {
                                    const newItems = [...prevItems];
                                    newItems[index] = { ...newItems[index], quantity: newQuantity };
                                    return newItems;
                                });
                            }}
                            className="w-16 text-center"
                        />
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => adjustQuantity(index, 1)}
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                        <span className="text-sm text-muted-foreground w-20">
                            {item.quantity_type}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}
