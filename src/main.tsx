import {  useState } from "react";
import { createRoot } from "react-dom/client";

import App2 from "./app2.tsx";
const Last = () => {
  const [page, setPage] = useState("main");

  return <App2 page={page} setPage={setPage} />;
};
createRoot(document.getElementById("root")!).render(
  <div  >
    <Last />
  </div>
);
