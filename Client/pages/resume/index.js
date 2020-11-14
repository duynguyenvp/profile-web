import React from "react";
import ReactDOM from "react-dom";
import StyleContext from "isomorphic-style-loader/StyleContext";
import Resume from "./Resume";
import RESOURCE_VERSION from "../../../version";

const insertCss = (...styles) => {
  const removeCss = styles.map(style => style._insertCss());
  return () => removeCss.forEach(dispose => dispose());
};

ReactDOM.hydrate(
  <StyleContext.Provider value={{ insertCss }}>
    <Resume />
  </StyleContext.Provider>,
  document.getElementById("app")
);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register(`/sw.js?v=${RESOURCE_VERSION}`)
      .then((registration) => {
        // eslint-disable-next-line
        console.log("SW registered: ", registration);
      })
      .catch((registrationError) => {
        // eslint-disable-next-line
        console.log("SW registration failed: ", registrationError);
      });
  });
}
