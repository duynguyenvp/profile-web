import { useEffect, useState } from "react";

let Subcribes = [];
let user = {};

const unsubscribe = subcribes => {
  Subcribes = [].concat(subcribes);
};

const subscribe = f => {
  Subcribes.push(f);
  return () => {
    unsubscribe((Subcribes && Subcribes.filter(a => a !== f)) || []);
  };
};

const onChange = () => {
  Subcribes.forEach(f => {
    f();
  });
};

const getState = () => user;

const setState = data => {
  user = { ...user, ...data };
  onChange();
};

const resetState = () => {
  user = {};
  onChange();
};

const checkAdminRole = () => {
  if (!user || !user.userRoles) return false;
  const isAdmin = user.userRoles.find(
    f => f.roleName === "admin" || f.roleName === "superadmin"
  );
  if (isAdmin) {
    return true;
  }
  return false;
};

export function useUserService() {
  const [data, setData] = useState(getState);
  useEffect(() => {
    const unsubcribes = subscribe(() => {
      setData(getState);
    });
    return () => {
      unsubcribes();
    };
  });

  return data;
}

export {
  getState,
  setState,
  subscribe,
  unsubscribe,
  resetState,
  checkAdminRole
};
