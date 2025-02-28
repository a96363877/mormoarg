
import { useState } from "react"

export default function KuwaitIDVerificationNative() {
  const [activeTab, setActiveTab] = useState("verification")

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-100 p-4" dir="rtl">
      <div className="w-full max-w-md rounded-md bg-white shadow-md">
        {/* Header */}
        <div className="relative border-b border-gray-200 p-4 text-center">
          <div className="absolute right-4 top-4">
            <img
              src="/placeholder.svg?height=60&width=60"
              width={60}
              height={60}
              alt="Kuwait Ministry of Interior emblem"
              className="h-12 w-12"
            />
          </div>

          <div className="space-y-1 text-right">
            <h1 className="text-xl font-bold text-blue-900">دولة الكويت</h1>
            <h2 className="text-lg font-semibold text-blue-900">وزارة الداخلية</h2>
            <div className="mt-2 text-blue-900">الإدارة العامة للمرور</div>
          </div>

          <div className="my-4 flex justify-center">
            <div className="h-1 w-16 bg-gray-300"></div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-4 text-right">
          <h2 className="mb-4 text-xl font-bold text-blue-900">التحقق من البطاقة المدنية</h2>
          <p className="text-sm text-gray-700">سيتم إستخدام تطبيق هويتي للتحقق من المعلومات</p>

          <p className="my-4 text-sm text-gray-700">يرجى زيارة تطبيق هويتي لقبول عملية المصادقة</p>

          {/* ID Card Preview */}
          <div className="mx-auto my-6 max-w-xs rounded-lg bg-blue-900 p-3 text-white">
            <div className="flex items-start justify-between">
              <div className="flex space-x-2">
                <div className="h-6 w-6 rounded-full bg-white"></div>
                <div className="h-6 w-6 rounded-full bg-white"></div>
                <div className="h-6 w-6 rounded-full bg-white"></div>
              </div>
              <div className="text-sm">دولة الكويت</div>
            </div>

            <div className="mt-2 flex items-center justify-between">
              <div className="text-xs">000000000000</div>
              <div className="text-sm">الرقم المدني</div>
            </div>

            <div className="mt-4 flex">
              <div className="flex-1">
                <div className="text-sm">اسم حامل البطاقة المدنية</div>
                <div className="text-sm">CIVIL ID CARD HOLDER'S NAME</div>
              </div>
              <div className="h-16 w-16 rounded bg-gray-300">
                <div className="flex h-full items-center justify-center">
                  <div className="h-10 w-8 rounded-t-full bg-gray-500"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Verification Tabs */}
          <div className="mt-6">
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab("verification")}
                className={`flex-1 py-2 text-sm font-medium ${
                  activeTab === "verification"
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                طلبات المصادقة
              </button>
              <button
                onClick={() => setActiveTab("signature")}
                className={`flex-1 py-2 text-sm font-medium ${
                  activeTab === "signature"
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                طلبات التوقيع
              </button>
            </div>
            <div className="mt-4">
              {activeTab === "verification" && (
                <div>
                  <p className="text-right text-sm text-blue-900">
                    يرجى قبول طلب المصادقة على صحة بيانات العميل، رقم الجوال والرقم الآلي للعنوان المدني بعد قبول
                    المصادقة
                  </p>
                  <p className="mt-2 text-right text-sm text-blue-900">قم بالضغط على أيقونة المتابعة</p>
                </div>
              )}
              {activeTab === "signature" && <p className="text-right text-sm text-gray-700">طلبات التوقيع الرقمي</p>}
            </div>
          </div>

          {/* Timer */}
          <div className="mt-6 flex justify-center">
            <div className="h-12 w-12 rounded-full border-2 border-gray-300 p-2">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                <path d="M12 7V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          {/* Continue Button */}
          <div className="mt-6">
            <button className="w-full rounded-md bg-purple-700 py-4 text-lg font-medium text-white hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
              متابعة
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

