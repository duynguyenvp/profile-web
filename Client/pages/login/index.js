import React from "react";
import ReactDOM from "react-dom";
import StyleContext from "isomorphic-style-loader/StyleContext";
import Login from "./form-login";

const insertCss = (...styles) => {
  const removeCss = styles.map(style => style._insertCss());
  return () => removeCss.forEach(dispose => dispose());
};

ReactDOM.hydrate(
  <StyleContext.Provider value={{ insertCss }}>
    <Login />
  </StyleContext.Provider>,
  document.getElementById("app")
);
