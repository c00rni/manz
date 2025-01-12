import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Recipe } from "@/lib/types";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}


export async function SignUp(
    username: string,
    email: string,
    password: string,
    passwordConfirmation: string
): Promise<Response> {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) {
        throw new Error("API URL is not defined in the environment variables.");
    }

    try {
        return fetch(
            `${apiUrl}/api/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: username,
                email: email,
                password1: password,
                password2: passwordConfirmation
            }),
        })
    } catch (error) {
        throw new Error("Failed to make the request. Please try again later.");
    }
}

export async function AuthentificationWithPassword(
    email: string,
    password: string
): Promise<Response> {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
        throw new Error("API URL is not defined in the environment variables.");
    }

    try {
        return fetch(
            `${apiUrl}/api/login/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
                password: password,
            }),
        })
    } catch (error) {
        throw new Error("Failed to make the request. Please try again later.");
    }
}


export async function CreateRecipe(
    recipe: Recipe
): Promise<Response> {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
        throw new Error("API URL is not defined in the environment variables.");
    }

    try {
        return fetch(
            `${apiUrl}/api/recipe/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `token ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(recipe),
        })
    } catch (error) {
        throw new Error("Failed to make the request. Please try again later.");
    }
}

export async function GetRecipes(): Promise<Response> {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
        throw new Error("API URL is not defined in the environment variables.");
    }

    try {
        return fetch(
            `${apiUrl}/api/recipe/`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `token ${localStorage.getItem("token")}`,
            },
        })
    } catch (error) {
        throw new Error("Failed to make the request. Please try again later.");
    }

}
