import React, { useState } from 'react'
export default function Login() {
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [pass, setPass] = useState('')
    const [error, setError] = useState<string | null>(null)

    function handleChecks() {
        if (email === '') {
            setError("Email field can't be empty")
            return
        }
        if (pass === '') {
            setError("Password field can't be empty")
            return
        }

        handleAuth()
    }

    function handleAuth() {
        setLoading(true)
       const url = `${import.meta.env.VITE_API_URL}/login`
        fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userid: email,
                password: pass
            }),
            cache: 'default',
            credentials: 'include',
            mode: 'cors'

        })
            .then(res => res.json())
            .then(result => {
                setLoading(false)
                if (result.error !== null) setError(result.error)
                if (result.result === true) {
                    // setCurrentUser(result.data)
                }
            })
    }

    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-50 px-4">
            <div className="w-full max-w-md bg-white border border-gray-300 shadow-lg rounded-xl p-8">
                {error && (
                    <div className="mb-4 text-red-600 bg-red-100 px-4 py-2 rounded-lg text-center text-sm font-semibold">
                        {error}
                    </div>
                )}
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Login</h2>

                <div className="space-y-4">
                    <div>
                        <label htmlFor="login-email" className="block text-gray-700 font-medium mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            id="login-email"
                            placeholder="Enter your email"
                            className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value.trim())}
                        />
                    </div>

                    <div>
                        <label htmlFor="login-pass" className="block text-gray-700 font-medium mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            id="login-pass"
                            placeholder="Enter your password"
                            className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={pass}
                            onChange={(e) => setPass(e.target.value.trim())}
                        />
                    </div>

                    <button
                        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300 text-lg"
                        onClick={handleChecks}
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </div>
            </div>
        </div>
    )
}
