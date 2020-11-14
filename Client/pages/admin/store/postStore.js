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

export const getPosts = () => state;

export const setPosts = data => {
  state = data;
  onChange();
};

export const addOrUpdatePost = post => {
  let isExist = false;
  const { data, ...newState } = state;
  let newData = data.map(item => {
    if (item.id === post.id) {
      isExist = true;
      return post;
    }
    return item;
  });
  if (!isExist) {
    newData = [...newData, post];
  }
  state = { ...newState, data: newData };
  onChange();
};

export const removePost = id => {
  const { data, ...newState } = state;
  const newData = data.filter(f => f.id !== id);
  state = { ...newState, data: newData };
  onChange();
};

export const resetPosts = () => {
  state = {
    take: 10,
    page: 1,
    total: 0,
    data: []
  };
  onChange();
};

export function usePostStore() {
  const [value, setValue] = useState(getPosts());
  useLayoutEffect(() => {
    let isMounted = true;
    const unsubcribes = subscribe(() => {
      if (!isMounted) return;
      setValue(getPosts());
    });
    return () => {
      isMounted = false;
      unsubcribes();
    };
  }, []);

  return value;
}
