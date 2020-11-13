import React from "react";
import ReactDOM from "react-dom";
import StyleContext from "isomorphic-style-loader/StyleContext";
import App from "../../App";
import Resume from "./partials/Resume";
import RESOURCE_VERSION from "../../../version";
import { setPostState } from "../../services/postService";

setPostState(window.__INITIAL__DATA__);

const insertCss = (...styles) => {
  const removeCss = styles.map(style => style._insertCss());
  return () => removeCss.forEach(dispose => dispose());
};

ReactDOM.hydrate(
  <StyleContext.Provider value={{ insertCss }}>
    <App>
      <Resume />
    </App>
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
