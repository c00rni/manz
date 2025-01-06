'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Register() {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password1, setPassword1] = useState('')
    const [password2, setPassword2] = useState('')
    const [error, setError] = useState('')
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        try {
            console.log(`${process.env.NEXT_PUBLIC_API_URL}/api/register/`)
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/register/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password1, password2 }),
            })

            if (response.ok) {
                router.push('/login')
            } else {
                const data = await response.json()
                setError(data.message || 'Registration failed')
            }
        } catch {
            setError('An error occurred during registration')
        }
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-4">Register</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                required
                className="w-full p-2 mb-4 border rounded"
            />
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                className="w-full p-2 mb-4 border rounded"
            />
            <input
                type="password"
                value={password1}
                onChange={(e) => setPassword1(e.target.value)}
                placeholder="Password"
                required
                className="w-full p-2 mb-4 border rounded"
            />
            <input
                type="password"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                placeholder="Confirm Password"
                required
                className="w-full p-2 mb-4 border rounded"
            />
            <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
                Register
            </button>
        </form>
    )
}

