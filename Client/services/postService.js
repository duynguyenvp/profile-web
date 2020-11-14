import { useEffect, useState } from "react";

let Subcribes = [];
let post = {};

const unsubscribePost = subcribes => {
  Subcribes = [].concat(subcribes);
};

const subscribePost = f => {
  Subcribes.push(f);
  return () => {
    unsubscribePost(Subcribes.filter(a => a !== f));
  };
};

const onChange = () => {
  Subcribes.forEach(f => {
    f();
  });
};

const getPostState = () => post;

const setPostState = data => {
  post = { ...post, ...data };
  onChange();
};

export function usePostService() {
  const [data, setData] = useState(getPostState);
  useEffect(() => {
    const unsubcribes = subscribePost(() => {
      setData(getPostState);
    });
    return () => {
      unsubcribes();
    };
  });

  return data;
}

export { getPostState, setPostState, subscribePost, unsubscribePost };
