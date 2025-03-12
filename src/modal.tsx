import { useState } from "react";

const DiscountPopup = () => {
  const [isVisible, setIsVisible] = useState(true);

  const closePopup = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div id="discountPopup" className="discount-overlay" style={{ display: "flex",justifyContent:"center" }}>
      <div className="discount-popup" >
      <div style={{display:'flex',justifyContent:'center'}}>
        <img
          src="./react.svg"
          className="discount-logo"
          alt="MOI Logo"
          width={150}
        />
        </div>
        <p className="discount-text">
          بمناسبة العيد الوطني لدولة الكويت، سيتم تقديم خصم 30٪ على جميع المخالفات المرورية.
        </p>
        <button onClick={closePopup} className="discount-close-btn">
          إغلاق
        </button>
      </div>
      <style>
        {`.discount-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.discount-popup {
  background: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  max-width: 400px;
  width: 90%;
}

.discount-logo {
  width: 150px;
  height: auto;
  margin-bottom: 10px;
}

.discount-text {
  font-size: 16px;
  margin-bottom: 15px;
}

.discount-close-btn {
  background:#000576 ;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.discount-close-btn:hover {
  background: #c9302c;
}
`}
      </style>
    </div>
  );
};

export default DiscountPopup;
