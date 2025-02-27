import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.tsx";
const Last = () => {
  const [page, setPage] = useState("sahel");

  return <App page={page} setPage={setPage} />;
};
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Last />
  </StrictMode>
);
