import { useEffect, useState } from "react";

let Subcribes = [];
let comment = {
  postId: -1,
  like: 0,
  dislike: 0,
  isLikeReact: true,
  isDislikeReact: true,
  commentLikeDislikeStat: []
};

const unsubscribeComment = (subcribes) => {
  Subcribes = subcribes;
};

const subscribeComment = (f) => {
  Subcribes.push(f);
  return () => unsubscribeComment(Subcribes.filter(a => a !== f));
};

const onChange = () => {
  Subcribes.forEach((f) => {
    f();
  });
};

const getCommentState = () => comment;

const setCommentState = (data) => {
  comment = { ...comment, ...data };
  onChange();
};

const removeCommentState = () => {
  comment = {};
  onChange();
};

export function useCommentService() {
  const [data, setData] = useState(getCommentState);
  useEffect(() => {
    const unsubcribes = subscribeComment(() => {
      setData(getCommentState);
    });
    return () => {
      unsubcribes();
    };
  });

  return data;
}

export {
  getCommentState,
  setCommentState,
  subscribeComment,
  unsubscribeComment,
  removeCommentState
};
