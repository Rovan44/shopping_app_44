import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Layout from "@/components/Layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CubeIcon, TokensIcon, ArchiveIcon } from "@radix-ui/react-icons"
import { dashboardApi, paymentApi } from "@/services/api"

export default function Dashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showAllPayments, setShowAllPayments] = useState(false)
  const [allPayments, setAllPayments] = useState([])
  const [loadingAllPayments, setLoadingAllPayments] = useState(false)

  useEffect(() => {
    // Check if admin is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn")
    const userType = localStorage.getItem("userType")
    
    if (!isLoggedIn || userType !== "admin") {
      navigate("/login")
      return
    }

    fetchDashboardStats()
  }, [navigate])

  const fetchDashboardStats = async () => {
    try {
      setLoading(true)
      const response = await dashboardApi.getStats()
      setStats(response.data)
      setError(null)
    } catch (err) {
      setError("Failed to fetch dashboard statistics. Please ensure the backend is running.")
      console.error("Error fetching dashboard stats:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleViewAllPayments = async () => {
    try {
      setLoadingAllPayments(true)
      const response = await paymentApi.getAllPayments()
      setAllPayments(response.data)
      setShowAllPayments(true)
    } catch (err) {
      console.error("Error fetching all payments:", err)
    } finally {
      setLoadingAllPayments(false)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'FAILED':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'REFUNDED':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-destructive">Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{error}</p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Dashboard
          </h2>
          <p className="text-muted-foreground">
            Overview of your store statistics
          </p>
        </div>

        {/* Statistics Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Total Products */}
          <Card className="border-purple-100 dark:border-purple-900 hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
              <CardTitle className="text-sm font-medium">
                Total Products
              </CardTitle>
              <CubeIcon className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats?.totalProducts || 0}</div>
              <p className="text-xs text-muted-foreground">
                Products in inventory
              </p>
            </CardContent>
          </Card>

          {/* Total Value */}
          <Card className="border-purple-100 dark:border-purple-900 hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
              <CardTitle className="text-sm font-medium">
                Total Value
              </CardTitle>
              <TokensIcon className="h-4 w-4 text-pink-600 dark:text-pink-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-pink-600 dark:text-pink-400">
                ₹{stats?.totalValue?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "0.00"}
              </div>
              <p className="text-xs text-muted-foreground">
                Total inventory value
              </p>
            </CardContent>
          </Card>

          {/* Total Items in Stock */}
          <Card className="border-purple-100 dark:border-purple-900 hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
              <CardTitle className="text-sm font-medium">
                Items in Stock
              </CardTitle>
              <ArchiveIcon className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats?.totalItemsInStock || 0}</div>
              <p className="text-xs text-muted-foreground">
                Total items available
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Categories Card */}
        <Card className="col-span-full border-purple-100 dark:border-purple-900 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
            <CardTitle className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Categories</CardTitle>
          </CardHeader>
          <CardContent>
            {stats?.categories && stats.categories.length > 0 ? (
              <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
                {stats.categories.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-purple-100 dark:border-purple-900 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 hover:shadow-md transition-all"
                  >
                    <span className="font-medium text-purple-900 dark:text-purple-100">{category.name}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No categories available</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Payment History */}
        <Card className="col-span-full border-purple-100 dark:border-purple-900 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
            <div className="flex items-center justify-between">
              <CardTitle className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Recent Payment History
              </CardTitle>
              {stats?.recentPayments && stats.recentPayments.length > 0 && (
                <Button
                  onClick={handleViewAllPayments}
                  variant="outline"
                  size="sm"
                  disabled={loadingAllPayments}
                  className="border-purple-200 hover:bg-purple-50 dark:border-purple-800 dark:hover:bg-purple-900/20"
                >
                  {loadingAllPayments ? "Loading..." : "View All"}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {stats?.recentPayments && stats.recentPayments.length > 0 ? (
              <div className="space-y-4">
                {stats.recentPayments.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-purple-100 dark:border-purple-900 bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-900/10 dark:to-pink-900/10 hover:shadow-md transition-all"
                  >
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-purple-900 dark:text-purple-100">
                          ₹{payment.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(payment.status)}`}>
                          {payment.status}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <span className="font-medium">{payment.paymentMode.mode}</span>
                        {payment.transactionId && (
                          <span className="ml-2">• TXN: {payment.transactionId}</span>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatDate(payment.paymentDate)}
                      </div>
                    </div>
                    {payment.remarks && (
                      <div className="text-sm text-muted-foreground max-w-xs truncate">
                        {payment.remarks}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No payment history available</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* All Payments Dialog */}
      <Dialog open={showAllPayments} onOpenChange={setShowAllPayments}>
        <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              All Payment History
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {allPayments.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow className="bg-purple-50 dark:bg-purple-900/20">
                    <TableHead className="font-semibold">ID</TableHead>
                    <TableHead className="font-semibold">Date & Time</TableHead>
                    <TableHead className="font-semibold">Payment Mode</TableHead>
                    <TableHead className="font-semibold">Transaction ID</TableHead>
                    <TableHead className="font-semibold">Amount</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Remarks</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allPayments.map((payment) => (
                    <TableRow key={payment.id} className="hover:bg-purple-50/50 dark:hover:bg-purple-900/10">
                      <TableCell className="font-medium">{payment.id}</TableCell>
                      <TableCell>{formatDate(payment.paymentDate)}</TableCell>
                      <TableCell>
                        <span className="font-medium">{payment.paymentMode.mode}</span>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-sm">{payment.transactionId || '-'}</span>
                      </TableCell>
                      <TableCell className="font-semibold text-purple-600 dark:text-purple-400">
                        ₹{payment.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(payment.status)}`}>
                          {payment.status}
                        </span>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{payment.remarks || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-center text-muted-foreground py-8">No payments found</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  )
}
