// Login.tsx
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

export default function Login() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const agentId = sessionStorage.getItem("agent_id")
    if (agentId) {
      navigate('/')
    }
  }, [])

  const handleChecks = async () => {
    setError(null)

    if (!email || !pass) {
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
          body: JSON.stringify({ client: "recruito", userid: email, password: pass }),
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
            params: { user_name: email, password: pass },
          }),
        }
      )

      const agentData = await agentRes.json()
      const agentId = agentData.agentid || ""

      if (!agentId) {
        setError("Agent ID not found. Please contact support.")
        setLoading(false)
        return
      }

      sessionStorage.setItem("agent_id", agentId)
      sessionStorage.setItem("username", email)
      sessionStorage.setItem("password", pass)

      navigate('/')
    } catch (err) {
      console.error("Login error:", err)
      setError("Something went wrong. Please try again later.")
    } finally {
      setLoading(false)
    }
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
          <input type="text" placeholder="Username" value={email} onChange={e => setEmail(e.target.value)} className="w-full border px-4 py-2 rounded-md" />
          <input type="password" placeholder="Password" value={pass} onChange={e => setPass(e.target.value)} className="w-full border px-4 py-2 rounded-md" />
          <button className="w-full bg-zinc-950 text-white py-2 rounded-md" onClick={handleChecks} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>
      </div>
    </div>
  )
}
