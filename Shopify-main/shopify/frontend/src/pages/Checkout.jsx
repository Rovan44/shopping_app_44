import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { paymentModeApi, paymentApi, productApi } from "@/services/api"

export default function Checkout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { cart, totalAmount } = location.state || { cart: [], totalAmount: 0 }

  const [paymentModes, setPaymentModes] = useState([])
  const [selectedPaymentMode, setSelectedPaymentMode] = useState(null)
  const [transactionId, setTransactionId] = useState("")
  const [remarks, setRemarks] = useState("")
  const [loading, setLoading] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [paymentResponse, setPaymentResponse] = useState(null)
  const [error, setError] = useState(null)
  const [deliveryAddress, setDeliveryAddress] = useState("")
  const [showPaymentAnimation, setShowPaymentAnimation] = useState(false)

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn")
    const userType = localStorage.getItem("userType")
    
    if (!isLoggedIn || userType !== "user") {
      navigate("/login")
      return
    }

    // Check if cart data is available
    if (!cart || cart.length === 0) {
      navigate("/shop")
      return
    }

    fetchPaymentModes()
  }, [navigate, cart])

  const fetchPaymentModes = async () => {
    try {
      const response = await paymentModeApi.getActive()
      setPaymentModes(response.data)
      if (response.data.length > 0) {
        setSelectedPaymentMode(response.data[0].id)
      }
    } catch (err) {
      setError("Failed to load payment modes. Please ensure the backend is running.")
      console.error("Error fetching payment modes:", err)
    }
  }

  const generateTransactionId = () => {
    const timestamp = Date.now()
    const random = Math.floor(Math.random() * 10000)
    return `TXN${timestamp}${random}`
  }

  const handlePaymentModeChange = (modeId) => {
    setSelectedPaymentMode(modeId)
    // Auto-generate transaction ID if needed for certain payment modes
    const selectedMode = paymentModes.find(m => m.id === modeId)
    if (selectedMode && selectedMode.mode !== "Cash On Delivery") {
      setTransactionId(generateTransactionId())
    } else {
      setTransactionId("")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!selectedPaymentMode) {
      alert("Please select a payment mode")
      return
    }

    const selectedMode = paymentModes.find(m => m.id === selectedPaymentMode)
    
    // Validate address for COD
    if (selectedMode?.mode === "Cash On Delivery" && !deliveryAddress.trim()) {
      alert("Please enter your delivery address for Cash On Delivery")
      return
    }
    
    // Validate transaction ID for non-COD payments
    if (selectedMode?.mode !== "Cash On Delivery" && !transactionId.trim()) {
      alert("Transaction ID is required for this payment mode")
      return
    }

    setLoading(true)
    setError(null)

    // For COD, show payment processing animation
    if (selectedMode?.mode === "Cash On Delivery") {
      setShowPaymentAnimation(true)
      
      // Simulate processing time
      setTimeout(async () => {
        try {
          console.log("💳 Creating COD payment...")
          const paymentRequest = {
            paymentModeId: selectedPaymentMode,
            amount: totalAmount,
            transactionId: null,
            remarks: deliveryAddress.trim(),
          }

          console.log("Payment request:", paymentRequest)
          const response = await paymentApi.create(paymentRequest)
          console.log("✅ Payment created:", response.data)
          setPaymentResponse(response.data)
          
          // Reduce stock for purchased items
          console.log("📦 Now reducing stock...")
          await reduceStockForItems()
          
          setShowPaymentAnimation(false)
          setShowSuccessDialog(true)
        } catch (err) {
          setShowPaymentAnimation(false)
          setError(err.response?.data?.message || "Payment failed. Please try again.")
          console.error("❌ Error creating payment:", err)
          console.error("Error details:", err.response?.data)
        } finally {
          setLoading(false)
        }
      }, 2000)
    } else {
      // For other payment modes (UPI, Card, Net Banking, Wallet)
      processOnlinePayment(selectedMode)
    }
  }

  const processOnlinePayment = (selectedMode) => {
    console.log(`💳 Processing ${selectedMode.mode} payment...`)
    console.log(`💰 Amount: ₹${totalAmount.toFixed(2)}`)
    
    // Show payment processing animation
    setShowPaymentAnimation(true)
    
    // Simulate payment gateway processing (2 seconds)
    setTimeout(async () => {
      try {
        // Generate a transaction ID
        const paymentMethods = {
          "UPI": "upi",
          "Debit/Credit Card": "card",
          "Net Banking": "netbanking",
          "Wallet": "wallet"
        }
        const method = paymentMethods[selectedMode.mode] || "online"
        const transactionId = `TXN_${Date.now()}_${method.toUpperCase()}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`
        
        console.log(`✅ Payment Successful!`)
        console.log(`📝 Transaction ID: ${transactionId}`)
        
        const paymentRequest = {
          paymentModeId: selectedPaymentMode,
          amount: totalAmount,
          transactionId: transactionId,
          remarks: remarks.trim() || `Payment via ${selectedMode.mode} - ${transactionId}`,
        }

        console.log("Payment request:", paymentRequest)
        const response = await paymentApi.create(paymentRequest)
        console.log("✅ Payment created:", response.data)
        setPaymentResponse(response.data)
        
        // Reduce stock for purchased items
        console.log("📦 Now reducing stock...")
        await reduceStockForItems()
        
        setShowPaymentAnimation(false)
        setShowSuccessDialog(true)
        
        console.log("💾 Payment record saved to database:", response.data)
      } catch (err) {
        setShowPaymentAnimation(false)
        setError(err.response?.data?.message || "Payment failed. Please try again.")
        console.error("❌ Error creating payment:", err)
      } finally {
        setLoading(false)
      }
    }, 2000)
  }

  // Function to reduce stock for all purchased items
  const reduceStockForItems = async () => {
    console.log("🔧 Starting stock reduction...")
    console.log("Cart items:", cart)
    
    try {
      for (const item of cart) {
        console.log(`Reducing stock for Product ID: ${item.id}, Quantity: ${item.quantity}`)
        const response = await productApi.reduceStock(item.id, item.quantity)
        console.log(`✅ Stock reduced successfully for ${item.name}:`, response.data)
      }
      console.log("✅ All stock reductions completed!")
    } catch (err) {
      console.error("❌ Error reducing stock:", err)
      console.error("Error details:", err.response?.data)
      alert("Warning: Payment succeeded but stock update failed. Please contact support.")
    }
  }

  const handleSuccessClose = () => {
    setShowSuccessDialog(false)
    navigate("/shop", { state: { clearCart: true } })
  }

  const getPaymentModeIcon = (mode) => {
    switch (mode) {
      case "Cash On Delivery":
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        )
      case "UPI":
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        )
      case "Debit/Credit Card":
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        )
      case "Net Banking":
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        )
      case "Wallet":
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
          </svg>
        )
      default:
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
    }
  }

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
      case "PENDING":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
      case "FAILED":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
      case "REFUNDED":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
    }
  }

  if (error && paymentModes.length === 0) {
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
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Checkout
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Button 
                variant="outline" 
                onClick={() => navigate("/shop")}
                className="border-purple-300 hover:bg-purple-50 dark:border-purple-700 dark:hover:bg-purple-900/20"
              >
                Back to Shop
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <Card className="border-purple-100 dark:border-purple-900 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
                <CardTitle className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Payment Details
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Payment Mode Selection */}
                  <div>
                    <Label className="text-base font-semibold mb-4 block">Select Payment Method</Label>
                    <div className="space-y-3">
                      {paymentModes.map((mode) => (
                        <div
                          key={mode.id}
                          onClick={() => handlePaymentModeChange(mode.id)}
                          className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            selectedPaymentMode === mode.id
                              ? "border-purple-600 bg-purple-50 dark:bg-purple-900/20"
                              : "border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700"
                          }`}
                        >
                          <div className="flex items-center space-x-3 flex-1">
                            <div className={`${
                              selectedPaymentMode === mode.id
                                ? "text-purple-600 dark:text-purple-400"
                                : "text-gray-400 dark:text-gray-500"
                            }`}>
                              {getPaymentModeIcon(mode.mode)}
                            </div>
                            <span className={`font-medium ${
                              selectedPaymentMode === mode.id
                                ? "text-purple-600 dark:text-purple-400"
                                : "text-gray-700 dark:text-gray-300"
                            }`}>
                              {mode.mode}
                            </span>
                          </div>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            selectedPaymentMode === mode.id
                              ? "border-purple-600 bg-purple-600"
                              : "border-gray-300 dark:border-gray-600"
                          }`}>
                            {selectedPaymentMode === mode.id && (
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Dynamic Payment Fields Based on Selected Mode */}
                  {selectedPaymentMode && (() => {
                    const selectedMode = paymentModes.find(m => m.id === selectedPaymentMode)?.mode
                    
                    switch (selectedMode) {
                      case "Cash On Delivery":
                        return (
                          <div className="space-y-4">
                            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                              <p className="text-sm text-green-700 dark:text-green-400">
                                💵 Pay cash when your order is delivered to your doorstep.
                              </p>
                            </div>
                            <div>
                              <Label htmlFor="deliveryAddress">Delivery Address *</Label>
                              <textarea
                                id="deliveryAddress"
                                value={deliveryAddress}
                                onChange={(e) => setDeliveryAddress(e.target.value)}
                                placeholder="Enter your complete delivery address&#10;e.g., House No., Street, Landmark, City, State, PIN Code"
                                className="w-full px-3 py-2 border border-purple-200 rounded-md bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[100px]"
                                required
                              />
                            </div>
                          </div>
                        )
                      
                      case "UPI":
                        return (
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="upiId">UPI ID</Label>
                              <Input
                                id="upiId"
                                type="text"
                                placeholder="yourname@upi"
                                className="border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                              />
                              <p className="text-sm text-gray-500 mt-1">
                                Enter your UPI ID (e.g., 9876543210@paytm)
                              </p>
                            </div>
                            <div>
                              <Label htmlFor="transactionId">UPI Transaction ID</Label>
                              <Input
                                id="transactionId"
                                type="text"
                                value={transactionId}
                                onChange={(e) => setTransactionId(e.target.value)}
                                placeholder="Auto-generated"
                                className="border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                                required
                              />
                            </div>
                          </div>
                        )
                      
                      case "Debit/Credit Card":
                        return (
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="cardNumber">Card Number</Label>
                              <Input
                                id="cardNumber"
                                type="text"
                                placeholder="1234 5678 9012 3456"
                                maxLength="19"
                                className="border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="expiryDate">Expiry Date</Label>
                                <Input
                                  id="expiryDate"
                                  type="text"
                                  placeholder="MM/YY"
                                  maxLength="5"
                                  className="border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                                />
                              </div>
                              <div>
                                <Label htmlFor="cvv">CVV</Label>
                                <Input
                                  id="cvv"
                                  type="password"
                                  placeholder="123"
                                  maxLength="4"
                                  className="border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                                />
                              </div>
                            </div>
                            <div>
                              <Label htmlFor="cardHolder">Card Holder Name</Label>
                              <Input
                                id="cardHolder"
                                type="text"
                                placeholder="JOHN DOE"
                                className="border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                              />
                            </div>
                            <div>
                              <Label htmlFor="transactionId">Transaction ID</Label>
                              <Input
                                id="transactionId"
                                type="text"
                                value={transactionId}
                                onChange={(e) => setTransactionId(e.target.value)}
                                placeholder="Auto-generated after payment"
                                className="border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                                required
                              />
                            </div>
                          </div>
                        )
                      
                      case "Net Banking":
                        return (
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="bankName">Select Bank</Label>
                              <select
                                id="bankName"
                                className="w-full px-4 py-2 border border-purple-200 rounded-md bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                              >
                                <option value="">Choose your bank</option>
                                <option value="SBI">State Bank of India</option>
                                <option value="HDFC">HDFC Bank</option>
                                <option value="ICICI">ICICI Bank</option>
                                <option value="AXIS">Axis Bank</option>
                                <option value="PNB">Punjab National Bank</option>
                                <option value="BOB">Bank of Baroda</option>
                                <option value="KOTAK">Kotak Mahindra Bank</option>
                                <option value="YES">Yes Bank</option>
                                <option value="IDBI">IDBI Bank</option>
                              </select>
                            </div>
                            <div>
                              <Label htmlFor="accountNumber">Account Number (Last 4 digits)</Label>
                              <Input
                                id="accountNumber"
                                type="text"
                                placeholder="XXXX"
                                maxLength="4"
                                className="border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                              />
                            </div>
                            <div>
                              <Label htmlFor="transactionId">Transaction Reference</Label>
                              <Input
                                id="transactionId"
                                type="text"
                                value={transactionId}
                                onChange={(e) => setTransactionId(e.target.value)}
                                placeholder="Auto-generated"
                                className="border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                                required
                              />
                            </div>
                          </div>
                        )
                      
                      case "Wallet":
                        return (
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="walletType">Select Wallet</Label>
                              <select
                                id="walletType"
                                className="w-full px-4 py-2 border border-purple-200 rounded-md bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                              >
                                <option value="">Choose your wallet</option>
                                <option value="paytm">Paytm</option>
                                <option value="phonepe">PhonePe</option>
                                <option value="gpay">Google Pay</option>
                                <option value="amazonpay">Amazon Pay</option>
                                <option value="mobikwik">Mobikwik</option>
                                <option value="freecharge">FreeCharge</option>
                              </select>
                            </div>
                            <div>
                              <Label htmlFor="walletNumber">Wallet Phone Number</Label>
                              <Input
                                id="walletNumber"
                                type="tel"
                                placeholder="9876543210"
                                maxLength="10"
                                className="border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                              />
                            </div>
                            <div>
                              <Label htmlFor="transactionId">Wallet Transaction ID</Label>
                              <Input
                                id="transactionId"
                                type="text"
                                value={transactionId}
                                onChange={(e) => setTransactionId(e.target.value)}
                                placeholder="Auto-generated"
                                className="border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                                required
                              />
                            </div>
                          </div>
                        )
                      
                      default:
                        return null
                    }
                  })()}

                  {/* Remarks */}
                  <div>
                    <Label htmlFor="remarks">Remarks (Optional)</Label>
                    <Input
                      id="remarks"
                      type="text"
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      placeholder="Add any special instructions"
                      className="border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                    />
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
                      {error}
                    </div>
                  )}

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={loading || !selectedPaymentMode}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-6 text-lg font-semibold"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing Payment...
                      </span>
                    ) : (
                      `Pay ₹${totalAmount.toLocaleString('en-IN')}`
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="border-purple-100 dark:border-purple-900 shadow-xl sticky top-24">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
                <CardTitle className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-start space-x-3 pb-3 border-b border-gray-100 dark:border-gray-800">
                      <div className="w-12 h-12 rounded overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                        {item.imageUrl ? (
                          <img 
                            src={item.imageUrl} 
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{item.name}</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          ₹{item.price.toFixed(2)} × {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-purple-600">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                    <span className="font-medium">₹{totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600 dark:text-gray-400">Tax (0%)</span>
                    <span className="font-medium">₹0.00</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600 dark:text-gray-400">Delivery</span>
                    <span className="font-medium text-green-600">FREE</span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold">Total</span>
                      <span className="text-2xl font-bold text-purple-600">
                        ₹{totalAmount.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <DialogTitle className="text-center text-2xl">Payment Successful!</DialogTitle>
            <DialogDescription className="text-center">
              Your order has been placed successfully.
            </DialogDescription>
          </DialogHeader>
          {paymentResponse && (
            <div className="space-y-3 py-4">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Payment ID</span>
                  <span className="text-sm font-mono font-semibold">#{paymentResponse.id}</span>
                </div>
                {paymentResponse.transactionId && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Transaction ID</span>
                    <span className="text-sm font-mono">{paymentResponse.transactionId}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Amount</span>
                  <span className="text-sm font-bold text-purple-600">₹{paymentResponse.amount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Status</span>
                  <span className={`text-sm font-semibold px-2 py-1 rounded ${getStatusBadgeColor(paymentResponse.status)}`}>
                    {paymentResponse.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Date</span>
                  <span className="text-sm">{new Date(paymentResponse.paymentDate).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          )}
          <Button
            onClick={handleSuccessClose}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            Continue Shopping
          </Button>
        </DialogContent>
      </Dialog>

      {/* Payment Processing Animation */}
      {showPaymentAnimation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl max-w-md mx-4 text-center animate-in zoom-in duration-300">
            <div className="relative mx-auto mb-6 w-24 h-24">
              {/* Spinning Circle */}
              <div className="absolute inset-0 border-4 border-purple-200 dark:border-purple-900 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
              
              {/* Payment Icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-12 h-12 text-purple-600 dark:text-purple-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Processing Payment...
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {paymentModes.find(m => m.id === selectedPaymentMode)?.mode === "Cash On Delivery" 
                ? "Confirming your order" 
                : "Processing your payment securely"}
            </p>
            <div className="flex items-center justify-center gap-2">
              <span className="text-lg font-semibold text-purple-600 dark:text-purple-400">₹{totalAmount.toLocaleString('en-IN')}</span>
            </div>
            
            {/* Animated Dots */}
            <div className="flex justify-center items-center space-x-2 mt-6">
              <div className="w-3 h-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-3 h-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-3 h-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
