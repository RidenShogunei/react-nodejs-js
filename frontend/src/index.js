import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./App"; // 你的App组件路径
document.title = "五系统"; 
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);