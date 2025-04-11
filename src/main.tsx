import {  useState } from "react";
import { createRoot } from "react-dom/client";

import App2 from "./App.tsx";
const Last = () => {

  return <App2 />;
};
createRoot(document.getElementById("root")!).render(
  <div  >
    <Last />
  </div>
);
