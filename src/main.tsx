import {  useState } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.tsx";
const Last = () => {
  const [page, setPage] = useState("main");

  return <App page={page} setPage={setPage} />;
};
createRoot(document.getElementById("root")!).render(
  <div  >
    <Last />
  </div>
);
