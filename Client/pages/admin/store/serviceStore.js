import { useState, useLayoutEffect } from "react";

let registeredObjects = [];
let services = [];
const subscribe = (f) => {
  registeredObjects.push(f);
  return () => {
    registeredObjects = registeredObjects.filter(a => a !== f);
  };
};

const onChange = () => {
  registeredObjects.forEach((f) => {
    f();
  });
};

export const getServices = () => services;

export const setServices = (data) => {
  services = data;
  onChange();
};

export const addOrUpdateService = (service) => {
  let isExist = false;
  services = services.map((item) => {
    if (item.id === service.id) {
      isExist = true;
      return service;
    }
    return item;
  });
  if (!isExist) {
    services = [...services, service];
  }
  onChange();
};

export const removeService = (id) => {
  services = services.filter(f => f.id !== id);
  onChange();
};

export const resetServices = () => {
  services.length = 0;
  onChange();
};

export function useServiceStore() {
  const [value, setValue] = useState(getServices());
  useLayoutEffect(() => {
    let isMounted = true;
    const unsubcribes = subscribe(() => {
      if (!isMounted) return;
      setValue(getServices());
    });
    return () => {
      isMounted = false;
      unsubcribes();
    };
  }, []);

  return value;
}
