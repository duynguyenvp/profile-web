import { useEffect, useState } from "react";

let registeredObjects = [];
let data = {
  isShirk: false,
  active: "home",
  route: "",
  isDisplayPlane: false,
};
const subscribes = (f) => {
  registeredObjects.push(f);
  return () => unsubscribe(registeredObjects.filter((a) => a !== f));
};
const unsubscribe = (subcribes) => (registeredObjects = subcribes);
const onChange = () => {
  registeredObjects.forEach((f) => {
    f();
  });
};

export const getAppData = () => data;
export const setAppData = (nextData) => {
  data = { ...nextData };
  onChange();
};

export function useAppStore() {
  const [appData, setAppData] = useState(getAppData);
  useEffect(() => {
    const unsubcribes = subscribes(() => {
      const nextData = getAppData();
      if (JSON.stringify(appData) != JSON.stringify(nextData))
        setAppData(nextData);
    });
    return () => {
      unsubcribes();
    };
  }, []);

  return appData;
}
