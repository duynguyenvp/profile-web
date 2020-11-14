import React, { useEffect, useState } from "react";
import "./style.scss";

import { getAlerts, removeAlert, subscribe } from "../../services/alertService";

import Alert from "./Alert";

const AlertContainer = () => {
  const [alerts, setAlerts] = useState(getAlerts);
  useEffect(() => {
    const unsubcribes = subscribe(() => {
      setAlerts(getAlerts);
    });
    return () => {
      unsubcribes();
    };
  });
  return (
    <section id="alert-container" className="alert-container">
      {alerts &&
        alerts.map(item => (
          <Alert
            key={item.id}
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
        ))}
    </section>
  );
};

export default AlertContainer;
