import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";

ReactDOM.render(<App />, document.getElementById("root"));
registerServiceWorker();

document.querySelector("body").addEventListener(
  "touchmove",
  function(e) {
    e.preventDefault();
  },
  { passive: false }
);
