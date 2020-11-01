import React, { useEffect, useState } from "react";

let Subcribes = [];
let post = {};
const subscribePost = (f) => {
  Subcribes.push(f);
  return () => unsubscribePost(Subcribes.filter((a) => a != f));
};

const unsubscribePost = (subscribes) => (Subcribes = subscribes);

const onChange = () => {
  Subcribes.forEach((f) => {
    f();
  });
};

const getPostState = () => post;

const setPostState = (data) => {
  post = { ...post, ...data };
  onChange();
};

export function usePostService() {
  const [post, setPost] = useState(getPostState);
  useEffect(() => {
    const unsubcribes = subscribePost(() => {
      setPost(getPostState);
    });
    return () => {
      unsubcribes();
    };
  });

  return post;
}

export { getPostState, setPostState, subscribePost, unsubscribePost };
