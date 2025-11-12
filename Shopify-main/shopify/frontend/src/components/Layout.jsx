import { BackpackIcon, ExitIcon, DashboardIcon } from "@radix-ui/react-icons"
import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export default function Layout({ children }) {
  const navigate = useNavigate()
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)

  const handleLogout = () => {
    setShowLogoutDialog(true)
  }

  const confirmLogout = () => {
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("userType")
    setShowLogoutDialog(false)
    navigate("/login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900">
      {/* Header */}
      <header className="border-b border-purple-100 dark:border-purple-900 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo/Brand */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center shadow-lg">
                <svg
                  className="w-5 h-5 text-white"
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
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Shopify Admin
              </h1>
            </div>

            {/* Navigation */}
            <nav className="flex items-center space-x-4">
              <Link
                to="/dashboard"
                className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors border border-transparent hover:border-purple-200 dark:hover:border-purple-800"
              >
                <DashboardIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                <span className="font-medium">Dashboard</span>
              </Link>
              <Link
                to="/admin"
                className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors border border-transparent hover:border-purple-200 dark:hover:border-purple-800"
              >
                <BackpackIcon className="h-5 w-5 text-pink-600 dark:text-pink-400" />
                <span className="font-medium">Products</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors border border-transparent hover:border-red-200 dark:hover:border-red-800"
              >
                <ExitIcon className="h-5 w-5 text-red-600 dark:text-red-400" />
                <span className="font-medium">Logout</span>
              </button>
              <ThemeToggle />
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Logout Confirmation Dialog */}
      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
            <DialogDescription>
              Are you sure you want to logout from the admin panel?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowLogoutDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmLogout}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
            >
              Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
