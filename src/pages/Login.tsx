import React, { useState, useRef } from 'react'
import { Link } from 'react-router-dom'

export default function Login() {
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [pass, setPass] = useState('')
    const ref = useRef({})
    //@ts-ignore
    // const { setCurrentUser } = useAuth()
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
        const url = `${process.env.REACT_APP_API_URL}/login`
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
        <div className="h-screen w-screen flex justify-center items-center bg-white">
            <div className="border border-red-500 px-12 py-10 text-center transform -translate-y-1/4 bg-white shadow-xl rounded-xl">
                <h1 className="text-3xl text-red-500 mb-4 underline">{error}</h1>
                <h2 className="text-3xl text-black font-semibold mb-6">Login</h2>

                <div className="space-y-4">
                    <div className="flex items-center justify-center space-x-4">
                        <label htmlFor="login-email" className="w-52 px-6 py-4 rounded-3xl text-black text-lg font-medium">
                            Email:
                        </label>
                        <input
                            type="email"
                            id="login-email"
                            placeholder="please enter your email"
                            className="w-80 border border-black rounded px-2 py-2 text-lg"
                            value={email}
                            onChange={(e) => setEmail(e.target.value.trim())}
                        />
                    </div>

                    <div className="flex items-center justify-center space-x-4">
                        <label htmlFor="login-pass" className="w-52 px-6 py-4 rounded-3xl text-black text-lg font-medium">
                            Password:
                        </label>
                        <input
                            type="password"
                            id="login-pass"
                            placeholder="please enter your password"
                            className="w-80 border border-black rounded px-2 py-2 text-lg"
                            value={pass}
                            onChange={(e) => setPass(e.target.value.trim())}
                        />
                    </div>

                    <button
                        className="text-white text-2xl bg-blue-600 px-10 py-2 rounded-lg hover:bg-blue-700 transition"
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
