import React from "react";
import ReactDOM from "react-dom";
import Signup from "./form-signup";
import "../../assets/root.scss";

ReactDOM.render(
  <Signup
    callback={() => {
      // eslint-disable-next-line
      console.log("this is loginIn form.");
    }}
  />,
  document.getElementById("app")
);
