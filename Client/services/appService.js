import { useEffect, useState } from "react";

let registeredObjects = [];
let data = {
  isShirk: false,
  active: "home",
  route: "",
  isDisplayPlane: false
};

const unsubscribe = subcribes => {
  registeredObjects = subcribes;
};

const subscribes = f => {
  registeredObjects.push(f);
  return () => {
    unsubscribe(registeredObjects.filter(a => a !== f));
  };
};

const onChange = () => {
  registeredObjects.forEach(f => {
    f();
  });
};

export const getAppData = () => data;
export const setAppData = nextData => {
  data = { ...nextData };
  onChange();
};

export function useAppStore() {
  const [value, setValue] = useState(getAppData);
  useEffect(() => {
    const unsubcribes = subscribes(() => {
      const nextData = getAppData();
      if (JSON.stringify(value) !== JSON.stringify(nextData)) {
        setValue(nextData);
      }
    });
    return () => {
      unsubcribes();
    };
  }, []);

  return value;
}
