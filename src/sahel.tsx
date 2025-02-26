export default function LoadingScreen() {
    return (
      <div className="loading-container" dir="rtl" style={{background:'url(./sasd.png)'}}>
        <div className="content">
          <h1>قبول طلب المصادقة في هويتي</h1>
  
          <div className="icon-container">
            <div className="document-icon">
              <svg viewBox="0 0 24 24" fill="none" className="icon" stroke="currentColor" strokeWidth="2">
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
  
          <p className="status">سهل بانتظار قبول المصادقة</p>
          <p className="message">بعد القبول، يرجى الانتظار حتى يتم تحميل البيانات</p>
        </div>
  
        <style>{`
          .loading-container {
            min-height: 100vh;
            background-color: #0a2559;
            background-image: radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
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
            background: rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            padding: 15px;
            animation: pulse 2s infinite;
          }
  
          .icon {
            width: 100%;
            height: 100%;
            color: white;
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
    )
  }
  
  