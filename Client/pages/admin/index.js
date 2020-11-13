import React from "react";
import { render } from "react-dom";
import Admin from "./Admin";
import RESOURCE_VERSION from "../../../version";

const rootElement = document.getElementById("app");
render(<Admin />, rootElement);
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register(`/sw.js?v=${RESOURCE_VERSION}`)
      .then(registration => {
        // eslint-disable-next-line
        console.log("SW registered: ", registration);
      })
      .catch(registrationError => {
        // eslint-disable-next-line
        console.log("SW registration failed: ", registrationError);
      });
  });
}
