import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { productApi } from "@/services/api"

export default function Shop() {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [cart, setCart] = useState([])
  const [categories, setCategories] = useState([])
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn")
    const userType = localStorage.getItem("userType")
    
    if (!isLoggedIn || userType !== "user") {
      navigate("/login")
      return
    }

    // Clear cart if returning from successful checkout
    if (location.state?.clearCart) {
      setCart([])
      // Clear the state to prevent clearing cart on refresh
      window.history.replaceState({}, document.title)
    }

    fetchProducts()
  }, [navigate, location])

  useEffect(() => {
    filterProducts()
  }, [products, searchTerm, selectedCategory])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await productApi.getAll()
      setProducts(response.data)
      
      // Extract unique categories
      const uniqueCategories = [...new Set(response.data.map(p => p.category?.name).filter(Boolean))]
      setCategories(uniqueCategories)
      
      setError(null)
    } catch (err) {
      setError("Failed to fetch products. Please ensure the backend is running.")
      console.error("Error fetching products:", err)
    } finally {
      setLoading(false)
    }
  }

  const filterProducts = () => {
    let filtered = products

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(p => p.category?.name === selectedCategory)
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredProducts(filtered)
  }

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id)
    
    if (existingItem) {
      // Check if we can add more (don't exceed stock)
      if (existingItem.quantity < product.totalItemsInStock) {
        setCart(cart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ))
      } else {
        alert(`Only ${product.totalItemsInStock} items available in stock!`)
      }
    } else {
      // Check if product has stock before adding
      if (product.totalItemsInStock > 0) {
        setCart([...cart, { ...product, quantity: 1 }])
      } else {
        alert('This product is out of stock!')
      }
    }
  }

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId))
  }

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId)
    } else {
      setCart(cart.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      ))
    }
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const handleLogout = () => {
    setShowLogoutDialog(true)
  }

  const confirmLogout = () => {
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("userType")
    setShowLogoutDialog(false)
    navigate("/login")
  }

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("Your cart is empty!")
      return
    }
    
    // Navigate to checkout page with cart data
    navigate("/checkout", { 
      state: { 
        cart: cart,
        totalAmount: getTotalPrice()
      } 
    })
  }

  const handleProductClick = (product) => {
    setSelectedProduct(product)
  }

  const handleBuyNow = (product) => {
    // Navigate to checkout page with single product
    if (product.totalItemsInStock === 0) {
      alert("This product is out of stock!")
      return
    }
    
    navigate("/checkout", { 
      state: { 
        cart: [{ ...product, quantity: 1 }],
        totalAmount: product.price
      } 
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 flex items-center justify-center">
        <p className="text-lg text-muted-foreground">Loading products...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm sticky top-0 z-10 border-b border-purple-100 dark:border-purple-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
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
                Shopify Store
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <div className="relative">
                <Button
                  className="relative bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                  onClick={() => document.getElementById('cart-section')?.scrollIntoView({ behavior: 'smooth' })}
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
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  Cart ({cart.length})
                  {cart.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cart.length}
                    </span>
                  )}
                </Button>
              </div>
              <Button 
                variant="outline" 
                onClick={handleLogout}
                className="border-purple-300 hover:bg-purple-50 dark:border-purple-700 dark:hover:bg-purple-900/20"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border-purple-200 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-purple-200 rounded-md bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Products Grid */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Products</h2>
            {filteredProducts.length === 0 ? (
              <Card className="border-purple-100 dark:border-purple-900">
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">No products found</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid sm:grid-cols-2 gap-6">
                {filteredProducts.map((product) => (
                  <Card key={product.id} className="group overflow-hidden hover:shadow-2xl transition-all duration-300 border-purple-100 dark:border-purple-900 hover:border-purple-300 dark:hover:border-purple-700 hover:scale-105 cursor-pointer">
                    <div 
                      className="h-48 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 flex items-center justify-center overflow-hidden relative"
                      onClick={() => handleProductClick(product)}
                    >
                      {product.imageUrl ? (
                        <img 
                          src={product.imageUrl} 
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <svg
                          className="w-24 h-24 text-purple-400 group-hover:scale-110 transition-transform duration-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                          />
                        </svg>
                      )}
                      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="bg-white/90 dark:bg-gray-800/90 px-4 py-2 rounded-full text-sm font-semibold text-purple-600 dark:text-purple-400">
                          Click to zoom
                        </span>
                      </div>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-lg group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        {product.name}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {product.category?.name || "Uncategorized"}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-2xl font-bold text-purple-600 group-hover:scale-110 transition-transform">
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>
                        <span className={`text-sm font-medium px-2 py-1 rounded ${
                          product.totalItemsInStock > 10 
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                            : product.totalItemsInStock > 0 
                            ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                          Stock: {product.totalItemsInStock}
                        </span>
                      </div>
                    </CardContent>
                    <CardFooter className="flex gap-2">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation()
                          addToCart(product)
                        }}
                        disabled={product.totalItemsInStock === 0}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 hover:scale-105 transition-transform"
                      >
                        Add to Cart
                      </Button>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleBuyNow(product)
                        }}
                        disabled={product.totalItemsInStock === 0}
                        className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 hover:scale-105 transition-transform text-white"
                      >
                        Buy Now
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Cart */}
          <div className="lg:col-span-1">
            <div id="cart-section" className="sticky top-24">
              <Card className="border-purple-100 dark:border-purple-900 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
                  <CardTitle className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Shopping Cart</CardTitle>
                </CardHeader>
                <CardContent className="max-h-[500px] overflow-y-auto">
                  {cart.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      Your cart is empty
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {cart.map((item) => (
                        <div key={item.id} className="flex items-start space-x-3 border-b pb-3">
                          <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                            {item.imageUrl ? (
                              <img 
                                src={item.imageUrl} 
                                alt={item.name}
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
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm truncate">{item.name}</h4>
                            <p className="text-sm text-purple-600 font-semibold">
                              ₹{item.price.toFixed(2)}
                            </p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="h-6 w-6 p-0 border-purple-300"
                              >
                                -
                              </Button>
                              <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                disabled={item.quantity >= item.totalItemsInStock}
                                className="h-6 w-6 p-0 border-purple-300"
                              >
                                +
                              </Button>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            ×
                          </Button>
                        </div>
                      ))}
                      <div className="pt-4 border-t">
                        <div className="flex justify-between items-center mb-4">
                          <span className="font-bold text-lg">Total:</span>
                          <span className="font-bold text-2xl text-purple-600">
                            ₹{getTotalPrice().toFixed(2)}
                          </span>
                        </div>
                        <Button
                          onClick={handleCheckout}
                          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                        >
                          Checkout
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
            <DialogDescription>
              Are you sure you want to logout? Your cart will be cleared.
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
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Product Zoom Modal */}
      <Dialog open={selectedProduct !== null} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {selectedProduct?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="relative aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20">
              {selectedProduct?.imageUrl ? (
                <img
                  src={selectedProduct.imageUrl}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg className="w-32 h-32 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
              )}
            </div>
            <div className="flex flex-col justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Category: {selectedProduct?.category?.name || "Uncategorized"}
                </p>
                <p className="text-4xl font-bold text-purple-600 mb-4">
                  ₹{selectedProduct?.price.toLocaleString('en-IN')}
                </p>
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-4 ${
                  selectedProduct?.totalItemsInStock > 10 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                    : selectedProduct?.totalItemsInStock > 0 
                    ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                }`}>
                  {selectedProduct?.totalItemsInStock > 0 
                    ? `${selectedProduct?.totalItemsInStock} items in stock` 
                    : 'Out of stock'}
                </div>
              </div>
              <div className="space-y-2">
                <Button
                  onClick={() => {
                    addToCart(selectedProduct)
                    setSelectedProduct(null)
                  }}
                  disabled={selectedProduct?.totalItemsInStock === 0}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  Add to Cart
                </Button>
                <Button
                  onClick={() => {
                    handleBuyNow(selectedProduct)
                    setSelectedProduct(null)
                  }}
                  disabled={selectedProduct?.totalItemsInStock === 0}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                >
                  Buy Now
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>


    </div>
  )
}
