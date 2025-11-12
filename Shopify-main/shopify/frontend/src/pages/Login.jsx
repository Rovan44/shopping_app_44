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

const ShoppingAnimation = () => {
  return (
    <svg
      viewBox="0 0 500 500"
      className="w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#667eea", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#764ba2", stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: "#f093fb", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#f5576c", stopOpacity: 1 }} />
        </linearGradient>
      </defs>

      {/* Floating circles background */}
      <circle cx="100" cy="100" r="60" fill="url(#gradient1)" opacity="0.1">
        <animate
          attributeName="cy"
          values="100;80;100"
          dur="3s"
          repeatCount="indefinite"
        />
      </circle>
      <circle cx="400" cy="400" r="80" fill="url(#gradient2)" opacity="0.1">
        <animate
          attributeName="cy"
          values="400;420;400"
          dur="4s"
          repeatCount="indefinite"
        />
      </circle>

      {/* Shopping cart */}
      <g id="cart" transform="translate(150, 200)">
        <path
          d="M0,0 L20,0 L30,60 L120,60 L130,20 L40,20"
          fill="none"
          stroke="url(#gradient1)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="45" cy="75" r="8" fill="url(#gradient1)">
          <animate
            attributeName="r"
            values="8;10;8"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="105" cy="75" r="8" fill="url(#gradient1)">
          <animate
            attributeName="r"
            values="8;10;8"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>

        {/* Items in cart */}
        <rect
          x="50"
          y="30"
          width="25"
          height="25"
          fill="url(#gradient2)"
          opacity="0.8"
          rx="3"
        >
          <animate
            attributeName="y"
            values="30;25;30"
            dur="2s"
            repeatCount="indefinite"
          />
        </rect>
        <rect
          x="80"
          y="35"
          width="20"
          height="20"
          fill="url(#gradient1)"
          opacity="0.8"
          rx="3"
        >
          <animate
            attributeName="y"
            values="35;30;35"
            dur="2.5s"
            repeatCount="indefinite"
          />
        </rect>
      </g>

      {/* Shopping bags */}
      <g id="bags" transform="translate(300, 180)">
        <path
          d="M20,40 L20,120 L80,120 L80,40 M30,40 L30,25 Q30,15 40,15 L60,15 Q70,15 70,25 L70,40"
          fill="none"
          stroke="url(#gradient2)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0,0; 0,-5; 0,0"
            dur="2s"
            repeatCount="indefinite"
          />
        </path>
        <rect x="30" y="60" width="40" height="3" fill="url(#gradient2)" opacity="0.5" />
        <rect x="30" y="70" width="30" height="3" fill="url(#gradient2)" opacity="0.5" />
      </g>

      {/* Credit card */}
      <g id="card" transform="translate(220, 320)">
        <rect
          x="0"
          y="0"
          width="100"
          height="60"
          rx="8"
          fill="url(#gradient1)"
          opacity="0.9"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            values="0,50,30; 5,50,30; 0,50,30"
            dur="3s"
            repeatCount="indefinite"
          />
        </rect>
        <rect x="10" y="15" width="80" height="8" fill="white" opacity="0.3" />
        <rect x="10" y="35" width="30" height="6" fill="white" opacity="0.5" rx="2" />
        <rect x="45" y="35" width="30" height="6" fill="white" opacity="0.5" rx="2" />
      </g>

      {/* Stars/Sparkles */}
      <g id="sparkles">
        <circle cx="120" cy="150" r="3" fill="#fbbf24">
          <animate
            attributeName="opacity"
            values="0;1;0"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="350" cy="280" r="3" fill="#fbbf24">
          <animate
            attributeName="opacity"
            values="0;1;0"
            dur="2.5s"
            repeatCount="indefinite"
            begin="0.5s"
          />
        </circle>
        <circle cx="180" cy="350" r="3" fill="#fbbf24">
          <animate
            attributeName="opacity"
            values="0;1;0"
            dur="3s"
            repeatCount="indefinite"
            begin="1s"
          />
        </circle>
      </g>
    </svg>
  )
}

export default function Login() {
  const navigate = useNavigate()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleLogin = (e) => {
    e.preventDefault()
    setError("")

    // Check if admin credentials
    if (username === "admin@123" && password === "12345") {
      localStorage.setItem("userType", "admin")
      localStorage.setItem("isLoggedIn", "true")
      navigate("/dashboard")
    } else if (username && password) {
      // Any other valid credentials go to shop
      localStorage.setItem("userType", "user")
      localStorage.setItem("isLoggedIn", "true")
      navigate("/shop")
    } else {
      setError("Please enter both username and password")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Illustration */}
        <div className="hidden lg:flex items-center justify-center p-8">
          <div className="w-full max-w-lg">
            <ShoppingAnimation />
            <div className="text-center mt-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                Your Shopping Experience
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Manage your products, track sales, and grow your business
              </p>
            </div>
          </div>
        </div>

        {/* Right side - Login form */}
        <div className="flex items-center justify-center">
          <Card className="w-full max-w-md shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader className="space-y-1 pb-6">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform">
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
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                </div>
              </div>
              <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Welcome Back
              </CardTitle>
              <CardDescription className="text-center text-base">
                Sign in to start shopping
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
                    Username
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="h-11 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-sm font-medium">
                      Password
                    </Label>
                    <a
                      href="#"
                      className="text-sm text-purple-600 hover:text-purple-700 dark:text-purple-400"
                    >
                      Forgot password?
                    </a>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-11 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="remember"
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <label
                    htmlFor="remember"
                    className="text-sm text-gray-700 dark:text-gray-300"
                  >
                    Remember me
                  </label>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button
                  type="submit"
                  className="w-full h-11 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium shadow-lg hover:shadow-xl transition-all"
                >
                  Sign In
                </Button>
                <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                  Enter admin credentials to access dashboard, or any other credentials to shop
                </p>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  )
}
