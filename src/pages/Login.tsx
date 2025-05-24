import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock } from 'lucide-react'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const agentId = sessionStorage.getItem("agent_id")
    if (agentId) navigate("/")
  }, [])

  const handleLogin = async () => {
    setError(null)
    if (!username || !password) {
      setError("Username and password are required.")
      return
    }

    setLoading(true)
    try {
      const response = await fetch(
        "https://qhpv9mvz1h.execute-api.ap-south-1.amazonaws.com/prod/check-jarvis-login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ client: "recruito", userid: username, password }),
        }
      )
      const data = await response.json()
      if (!data.result) {
        setError("Invalid username or password.")
        setLoading(false)
        return
      }

      const agentRes = await fetch(
        "https://wpv7kxos9g.execute-api.ap-south-1.amazonaws.com/test/recruito-upload-apis/main_router",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            trigger_func: "get_agent_id",
            params: { user_name: username, password },
          }),
        }
      )
      const agentData = await agentRes.json()
      const agentId = agentData.agentid || ""

      if (!agentId) {
        setError("Agent ID not found.")
        setLoading(false)
        return
      }

      sessionStorage.setItem("agent_id", agentId)
      sessionStorage.setItem("username", username)
      sessionStorage.setItem("password", password)
      navigate("/")
    } catch (err) {
      console.error(err)
      setError("Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8">
        <h2 className="text-2xl font-bold text-center mb-2">Welcome back</h2>
        <p className="text-center text-gray-500 mb-6 text-sm">Enter your credentials to access your account</p>

        {error && <div className="text-red-600 bg-red-100 p-2 rounded mb-4 text-sm text-center">{error}</div>}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
          <div className="flex items-center border rounded-md px-3 py-2 bg-white">
            <Mail className="h-4 w-4 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full border-none outline-none text-sm"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <div className="flex items-center border rounded-md px-3 py-2 bg-white">
            <Lock className="h-4 w-4 text-gray-400 mr-2" />
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border-none outline-none text-sm"
            />
          </div>
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded-md text-sm font-semibold hover:bg-zinc-800 transition"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  )
}
