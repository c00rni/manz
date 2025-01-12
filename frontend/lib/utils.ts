import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

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
    console.log("API URL:", `${apiUrl}/api/register/`);

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
    console.log("API URL:", `${apiUrl}/api/register/`);

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

