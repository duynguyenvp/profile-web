import { useState, useLayoutEffect } from "react";

let state = {
  take: 10,
  page: 1,
  total: 0,
  data: []
};

let registeredObjects = [];
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

export const getAccounts = () => state;

export const setAccounts = data => {
  state = data;
  onChange();
};

export const addOrUpdateAccount = account => {
  let isExist = false;
  const { data, ...newState } = state;
  let newData = data.map(item => {
    if (item.id === account.id) {
      isExist = true;
      return account;
    }
    return item;
  });
  if (!isExist) {
    newData = [...newData, account];
  }
  state = { ...newState, data: newData };
  onChange();
};

export const removeAccount = id => {
  const { data, ...newState } = state;
  const newData = data.filter(f => f.id !== id);
  state = { ...newState, data: newData };
  onChange();
};

export const resetAccounts = () => {
  state = {
    take: 10,
    page: 1,
    total: 0,
    data: []
  };
  onChange();
};

export function useAccountStore() {
  const [value, setValue] = useState(getAccounts());
  useLayoutEffect(() => {
    let isMounted = true;
    const unsubcribes = subscribe(() => {
      if (!isMounted) return;
      setValue(getAccounts());
    });
    return () => {
      isMounted = false;
      unsubcribes();
    };
  }, []);

  return value;
}
