import { useState, useLayoutEffect } from "react";

let registeredObjects = [];
let feedbacks = [];
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

export const getFeedbacks = () => feedbacks;

export const setFeedbacks = data => {
  feedbacks = data;
  onChange();
};

export const addOrUpdateFeedback = feedback => {
  let isExist = false;
  feedbacks = feedbacks.map(item => {
    if (item.id === feedback.id) {
      isExist = true;
      return feedback;
    }
    return item;
  });
  if (!isExist) {
    feedbacks = [...feedbacks, feedback];
  }
  onChange();
};

export const removeFeedback = id => {
  feedbacks = feedbacks.filter(f => f.id !== id);
  onChange();
};

export const resetFeedbacks = () => {
  feedbacks.length = 0;
  onChange();
};

export function useFeedbackStore() {
  const [value, setValue] = useState(getFeedbacks());
  useLayoutEffect(() => {
    let isMounted = true;
    const unsubcribes = subscribe(() => {
      if (!isMounted) return;
      setValue(getFeedbacks());
    });
    return () => {
      isMounted = false;
      unsubcribes();
    };
  }, []);

  return value;
}
