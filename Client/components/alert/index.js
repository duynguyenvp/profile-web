import "./style.scss";

import React, { Fragment } from "react";
import ReactDOM from "react-dom";

import {
  removeAlert,
  useAlertService
} from "../../services/alertService";

import Alert from "./Alert";

const AlertContainer = () => {
  const alerts = useAlertService();
  const listAlert = alerts.map((item) => (
    <Fragment key={item.id}>
      <Alert
        type={item.type}
        duration={item.duration}
        message={item.message}
        callback={() => {
          removeAlert(item.id);
        }}
        close={() => {
          removeAlert(item.id);
        }}
      />
    </Fragment>
  ));
  return <>{listAlert}</>;
};

export default () => {
  let alertContainer = document.getElementById("alert-container");
  if (!alertContainer) {
    alertContainer = document.createElement("div");
    const app = document.getElementById("app");
    alertContainer.setAttribute("id", "alert-container");
    alertContainer.setAttribute("class", "alert-container");
    app.appendChild(alertContainer);
  }
  ReactDOM.render(<AlertContainer />, alertContainer);
};
