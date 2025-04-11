import { BrowserRouter as Router, Routes, Route,  } from "react-router-dom"
import MainPage from "./pages/main/Main"
import CreditCardPayment from "./pages/payment/payment-methods"
import PaymentSelection from "./pages/payment/payment"
import Ken2 from "./pages/payment/kent/knet2"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/payment/kent" element={<Ken2 violationValue={1} />} />
        <Route path="/card" element={<CreditCardPayment  />} />
        <Route path="/payment" element={<PaymentSelection setPage={()=>{}}   />} />
      </Routes>
    </Router>
  )
}

export default App
