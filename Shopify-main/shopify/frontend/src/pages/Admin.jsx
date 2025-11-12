import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Layout from "@/components/Layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { productApi, categoryApi, paymentApi } from "@/services/api"

export default function Admin() {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [payments, setPayments] = useState([])
  const [activeTab, setActiveTab] = useState("products")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showDialog, setShowDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [deletingProductId, setDeletingProductId] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    totalItemsInStock: "",
    categoryId: "",
    imageUrl: ""
  })

  useEffect(() => {
    // Check if admin is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn")
    const userType = localStorage.getItem("userType")
    
    if (!isLoggedIn || userType !== "admin") {
      navigate("/login")
      return
    }

    fetchProducts()
    fetchCategories()
    fetchPayments()
  }, [navigate])

  const fetchPayments = async () => {
    try {
      console.log("📋 Fetching payments...")
      const response = await paymentApi.getAll()
      console.log("✅ Payments fetched:", response.data)
      console.log("Total payments:", response.data.length)
      setPayments(response.data)
    } catch (err) {
      console.error("❌ Error fetching payments:", err)
      console.error("Error details:", err.response?.data)
    }
  }

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await productApi.getAll()
      setProducts(response.data)
      setError(null)
    } catch (err) {
      setError("Failed to fetch products. Please ensure the backend is running.")
      console.error("Error fetching products:", err)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await categoryApi.getAll()
      setCategories(response.data)
    } catch (err) {
      console.error("Error fetching categories:", err)
    }
  }

  const handleAdd = () => {
    setEditingProduct(null)
    setFormData({
      name: "",
      price: "",
      totalItemsInStock: "",
      categoryId: categories[0]?.id || "",
      imageUrl: ""
    })
    setShowDialog(true)
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      price: product.price.toString(),
      totalItemsInStock: product.totalItemsInStock.toString(),
      categoryId: product.category?.id || categories[0]?.id || "",
      imageUrl: product.imageUrl || ""
    })
    setShowDialog(true)
  }

  const handleDelete = (productId) => {
    setDeletingProductId(productId)
    setShowDeleteDialog(true)
  }

  const confirmDelete = async () => {
    try {
      await productApi.delete(deletingProductId)
      await fetchProducts()
      setShowDeleteDialog(false)
      setDeletingProductId(null)
    } catch (err) {
      alert("Failed to delete product. Please try again.")
      console.error("Error deleting product:", err)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const productData = {
      name: formData.name,
      price: parseFloat(formData.price),
      totalItemsInStock: parseInt(formData.totalItemsInStock),
      categoryId: parseInt(formData.categoryId),
      imageUrl: formData.imageUrl
    }

    try {
      if (editingProduct) {
        await productApi.update(editingProduct.id, productData)
      } else {
        await productApi.create(productData)
      }
      await fetchProducts()
      setShowDialog(false)
      setFormData({ name: "", price: "", totalItemsInStock: "", categoryId: "", imageUrl: "" })
    } catch (err) {
      alert("Failed to save product. Please try again.")
      console.error("Error saving product:", err)
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading products...</p>
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
        {/* Tab Navigation */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab("products")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "products"
                  ? "border-purple-600 text-purple-600 dark:text-purple-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                Products
                <span className="ml-2 px-2 py-0.5 text-xs font-semibold rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                  {products.length}
                </span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("payments")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "payments"
                  ? "border-purple-600 text-purple-600 dark:text-purple-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Payments
                <span className="ml-2 px-2 py-0.5 text-xs font-semibold rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                  {payments.length}
                </span>
              </div>
            </button>
          </nav>
        </div>

        {/* Products Tab */}
        {activeTab === "products" && (
          <>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Product Management
                </h2>
                <p className="text-muted-foreground">
                  Add, edit, or delete products from your inventory
                </p>
              </div>
              <Button
                onClick={handleAdd}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add Product
              </Button>
            </div>

        {/* Products Table */}
        <Card className="border-purple-100 dark:border-purple-900 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
            <CardTitle className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              All Products
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {products.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-purple-50/50 dark:bg-purple-900/10">
                      <TableHead className="font-semibold">ID</TableHead>
                      <TableHead className="font-semibold">Image</TableHead>
                      <TableHead className="font-semibold">Product Name</TableHead>
                      <TableHead className="font-semibold">Category</TableHead>
                      <TableHead className="font-semibold">Price (INR)</TableHead>
                      <TableHead className="font-semibold">Stock</TableHead>
                      <TableHead className="font-semibold text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id} className="hover:bg-purple-50/50 dark:hover:bg-purple-900/10">
                        <TableCell className="font-medium">{product.id}</TableCell>
                        <TableCell>
                          <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                            {product.imageUrl ? (
                              <img 
                                src={product.imageUrl} 
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                            {product.category?.name || "N/A"}
                          </span>
                        </TableCell>
                        <TableCell className="font-semibold text-purple-600 dark:text-purple-400">
                          ₹{product.price.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            product.totalItemsInStock > 10 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                              : product.totalItemsInStock > 0
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                              : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                          }`}>
                            {product.totalItemsInStock}
                          </span>
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(product)}
                            className="border-purple-300 hover:bg-purple-50 dark:border-purple-700 dark:hover:bg-purple-900/20"
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(product.id)}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No products found. Click "Add Product" to create one.
              </p>
            )}
          </CardContent>
        </Card>
          </>
        )}

        {/* Payments Tab */}
        {activeTab === "payments" && (
          <>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Payment History
                </h2>
                <p className="text-muted-foreground">
                  View all payment transactions and their status
                </p>
              </div>
            </div>

            {/* Payments Table */}
            <Card className="border-purple-100 dark:border-purple-900 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
                <CardTitle className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  All Payments
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {payments.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-purple-50/50 dark:bg-purple-900/10">
                          <TableHead className="font-semibold">Payment ID</TableHead>
                          <TableHead className="font-semibold">Date & Time</TableHead>
                          <TableHead className="font-semibold">Payment Mode</TableHead>
                          <TableHead className="font-semibold">Transaction ID</TableHead>
                          <TableHead className="font-semibold">Amount</TableHead>
                          <TableHead className="font-semibold">Status</TableHead>
                          <TableHead className="font-semibold">Remarks</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {payments.sort((a, b) => new Date(b.paymentDate) - new Date(a.paymentDate)).map((payment) => (
                          <TableRow key={payment.id} className="hover:bg-purple-50/50 dark:hover:bg-purple-900/10">
                            <TableCell className="font-medium">#{payment.id}</TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <span className="font-medium">
                                  {new Date(payment.paymentDate).toLocaleDateString('en-IN', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric'
                                  })}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(payment.paymentDate).toLocaleTimeString('en-IN', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                {payment.paymentMode?.mode || "N/A"}
                              </span>
                            </TableCell>
                            <TableCell className="font-mono text-sm">
                              {payment.transactionId || "—"}
                            </TableCell>
                            <TableCell className="font-semibold text-purple-600 dark:text-purple-400">
                              ₹{payment.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </TableCell>
                            <TableCell>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                payment.status === 'COMPLETED' 
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                  : payment.status === 'PENDING'
                                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                                  : payment.status === 'FAILED'
                                  ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                                  : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
                              }`}>
                                {payment.status}
                              </span>
                            </TableCell>
                            <TableCell className="max-w-xs truncate text-sm text-muted-foreground">
                              {payment.remarks || "—"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <p className="mt-4 text-muted-foreground">
                      No payments found yet. Payments will appear here after customers make purchases.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Add/Edit Product Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? "Edit Product" : "Add New Product"}
            </DialogTitle>
            <DialogDescription>
              {editingProduct 
                ? "Update the product details below" 
                : "Fill in the details to add a new product"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                />
                {formData.imageUrl && (
                  <div className="mt-2 w-32 h-32 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                    <img 
                      src={formData.imageUrl} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none'
                      }}
                    />
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price (INR ₹)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                  className="border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Stock Quantity</Label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  value={formData.totalItemsInStock}
                  onChange={(e) => setFormData({ ...formData, totalItemsInStock: e.target.value })}
                  required
                  className="border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-purple-200 rounded-md bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowDialog(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              >
                {editingProduct ? "Update" : "Add"} Product
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  )
}
