import { useState, useLayoutEffect } from "react";

let registeredObjects = [];
let authentication = null;
const subscribe = f => {
  registeredObjects.push(f);
  return () => unsubscribe(registeredObjects.filter(a => a !== f));
};

const unsubscribe = subcribes => {
  registeredObjects = subcribes;
};

const onChange = () => {
  registeredObjects.forEach(f => {
    f();
  });
};

export const getAuthentication = () => authentication;

export const setAuthentication = data => {
  authentication = data;
  onChange();
};

export function useAuthenticationStore() {
  const [value, setValue] = useState(getAuthentication());
  useLayoutEffect(() => {
    let isMounted = true;
    const unsubcribes = subscribe(() => {
      if (!isMounted) return;
      setValue(getAuthentication());
    });
    return () => {
      isMounted = false;
      unsubcribes();
    };
  }, []);

  return value;
}
