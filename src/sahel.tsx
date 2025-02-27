import Countdown from "react-countdown";

export default function LoadingScreen() {
  return (
    <div
      className="loading-container"
      dir="rtl"
      style={{
        backgroundRepeat: "no-repeat",
        background: "url(./sad.jpg)",
        backgroundSize: "contain",
        height: "100vh",
        width: "auto",
      }}
    >
      <div className="content">
        <div
          style={{
            background: "transparent ",
            position: "absolute",
            bottom: 150,
            left: "40% ",
            right: "40%",
            color: "white",
          }}
        >
          <Countdown date={Date.now() + 10 * 10000} />
        </div>
      </div>
      <div style={{}}>
        <p
          style={{
            backgroundColor: "rgba(38, 50, 56, 0.35)",
            padding: 5,
            position: "absolute",
            top: "50%",
            color: "white",
            textShdow: "2px 2px #ff0000;",
          }}
        >
          يرجى الدخول على تطبيق هويتي والموافقه على المصادقة
        </p>
      </div>

      <style>{`
          .loading-containerw {
            min-height: 100vh;
            background-color: transparent;
            background-size: 30px 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            color: white;
            text-align: center;
          }
  
          .content {
            max-width: 400px;
            margin: 0 auto;
          }
  
          h1 {
            font-size: 1.5rem;
            margin-bottom: 2rem;
            font-weight: bold;
          }
  
          .icon-container {
            margin: 2rem auto;
            width: 80px;
            height: 80px;
            position: relative;
          }
  
          .document-icon {
            width: 100%;
            height: 100%;
            background: transparent;
            border-radius: 50%;
            padding: 15px;
            animation: pulse 2s infinite;
          }
  
          .icon {
            width: 100%;
            height: 100%;
            color: transparent;
          }
  
          .status {
            font-size: 1.2rem;
            margin-bottom: 1rem;
            color: rgba(255, 255, 255, 0.9);
          }
  
          .message {
            font-size: 1rem;
            color: rgba(255, 255, 255, 0.7);
          }
  
          @keyframes pulse {
            0% {
              transform: scale(1);
              opacity: 1;
            }
            50% {
              transform: scale(1.1);
              opacity: 0.8;
            }
            100% {
              transform: scale(1);
              opacity: 1;
            }
          }
        `}</style>
    </div>
  );
}
