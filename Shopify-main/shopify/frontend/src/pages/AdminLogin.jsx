import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const AdminAnimation = () => {
  return (
    <svg
      viewBox="0 0 500 500"
      className="w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="adminGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#3b82f6", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#1e40af", stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id="adminGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: "#06b6d4", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#0891b2", stopOpacity: 1 }} />
        </linearGradient>
      </defs>

      {/* Dashboard screen */}
      <g id="dashboard" transform="translate(150, 100)">
        <rect
          x="0"
          y="0"
          width="200"
          height="140"
          rx="10"
          fill="url(#adminGradient1)"
          opacity="0.9"
        />
        <rect x="10" y="10" width="180" height="30" rx="5" fill="white" opacity="0.2" />
        
        {/* Stats boxes */}
        <rect x="10" y="50" width="55" height="40" rx="5" fill="white" opacity="0.3">
          <animate
            attributeName="opacity"
            values="0.3;0.5;0.3"
            dur="2s"
            repeatCount="indefinite"
          />
        </rect>
        <rect x="72" y="50" width="55" height="40" rx="5" fill="white" opacity="0.3">
          <animate
            attributeName="opacity"
            values="0.3;0.5;0.3"
            dur="2s"
            repeatCount="indefinite"
            begin="0.3s"
          />
        </rect>
        <rect x="134" y="50" width="55" height="40" rx="5" fill="white" opacity="0.3">
          <animate
            attributeName="opacity"
            values="0.3;0.5;0.3"
            dur="2s"
            repeatCount="indefinite"
            begin="0.6s"
          />
        </rect>

        {/* Chart lines */}
        <path
          d="M20,110 L50,105 L80,115 L110,100 L140,110 L170,105"
          fill="none"
          stroke="white"
          strokeWidth="3"
          opacity="0.5"
          strokeLinecap="round"
        >
          <animate
            attributeName="d"
            values="M20,110 L50,105 L80,115 L110,100 L140,110 L170,105;M20,110 L50,100 L80,110 L110,105 L140,115 L170,100;M20,110 L50,105 L80,115 L110,100 L140,110 L170,105"
            dur="3s"
            repeatCount="indefinite"
          />
        </path>
      </g>

      {/* Settings gear */}
      <g id="gear" transform="translate(320, 200)">
        <circle cx="50" cy="50" r="30" fill="url(#adminGradient2)" opacity="0.8">
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 50 50"
            to="360 50 50"
            dur="8s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="50" cy="50" r="18" fill="white" opacity="0.3" />
      </g>

      {/* User icons */}
      <g id="users" transform="translate(180, 280)">
        <circle cx="30" cy="30" r="15" fill="url(#adminGradient1)" opacity="0.7">
          <animate
            attributeName="r"
            values="15;17;15"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="70" cy="30" r="15" fill="url(#adminGradient2)" opacity="0.7">
          <animate
            attributeName="r"
            values="15;17;15"
            dur="2s"
            repeatCount="indefinite"
            begin="0.5s"
          />
        </circle>
        <circle cx="110" cy="30" r="15" fill="url(#adminGradient1)" opacity="0.7">
          <animate
            attributeName="r"
            values="15;17;15"
            dur="2s"
            repeatCount="indefinite"
            begin="1s"
          />
        </circle>
      </g>

      {/* Lock icon */}
      <g id="lock" transform="translate(320, 320)">
        <rect x="20" y="35" width="40" height="45" rx="5" fill="url(#adminGradient2)" opacity="0.8" />
        <path
          d="M30,35 L30,25 Q30,15 40,15 Q50,15 50,25 L50,35"
          fill="none"
          stroke="url(#adminGradient2)"
          strokeWidth="5"
          opacity="0.8"
        />
        <circle cx="40" cy="57" r="5" fill="white" opacity="0.6" />
      </g>
    </svg>
  )
}

export default function AdminLogin() {
  const navigate = useNavigate()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleLogin = (e) => {
    e.preventDefault()
    setError("")

    // Simple validation - in production, this should be proper authentication
    if (username === "admin" && password === "admin123") {
      localStorage.setItem("userType", "admin")
      localStorage.setItem("isLoggedIn", "true")
      navigate("/dashboard")
    } else {
      setError("Invalid admin credentials. Use username: admin, password: admin123")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 dark:from-gray-900 dark:via-blue-900 dark:to-gray-900 p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Illustration */}
        <div className="hidden lg:flex items-center justify-center p-8">
          <div className="w-full max-w-lg">
            <AdminAnimation />
            <div className="text-center mt-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                Admin Dashboard
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Manage products, view analytics, and control your store
              </p>
            </div>
          </div>
        </div>

        {/* Right side - Login form */}
        <div className="flex items-center justify-center">
          <Card className="w-full max-w-md shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader className="space-y-1 pb-6">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                    />
                  </svg>
                </div>
              </div>
              <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Admin Portal
              </CardTitle>
              <CardDescription className="text-center text-base">
                Sign in to manage your store
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleLogin}>
              <CardContent className="space-y-4">
                {error && (
                  <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-sm font-medium">
                    Admin Username
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter admin username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Admin Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter admin password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div className="pt-2">
                  <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                    <p className="text-xs text-blue-600 dark:text-blue-400">
                      Demo credentials: admin / admin123
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button
                  type="submit"
                  className="w-full h-11 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium shadow-lg hover:shadow-xl transition-all"
                >
                  Sign In as Admin
                </Button>
                <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                  Are you a customer?{" "}
                  <a
                    href="/login"
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium"
                  >
                    User Login
                  </a>
                </p>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  )
}
