import { useEffect, useState } from "react";
import { randomId } from "../utils/string-utils";

let alertSubcribes = [];
let alerts = [];

const unsubscribe = subcribes => {
  alertSubcribes = subcribes;
};

const subscribe = f => {
  alertSubcribes.push(f);
  return () => {
    unsubscribe(alertSubcribes.filter(a => a !== f));
  };
};

const onChange = () => {
  alertSubcribes.forEach(f => {
    f();
  });
};

const getAlerts = () => alerts;

// { message: '', duration: 5000, type: '<error>|<warning>|<success>' }
const addAlert = item => {
  const { message, type, duration } = item;
  const alert = {
    id: randomId(),
    message,
    type,
    duration
  };
  alerts = [...alerts, alert];
  onChange();
};

const removeAlert = id => {
  alerts = alerts.filter(f => f.id !== id);
  onChange();
};

export function useAlertService() {
  const [data, setData] = useState(getAlerts);
  useEffect(() => {
    const unsubcribes = subscribe(() => {
      setData(getAlerts);
    });
    return () => {
      unsubcribes();
    };
  });
  return data;
}

export { getAlerts, addAlert, removeAlert, subscribe, unsubscribe };
