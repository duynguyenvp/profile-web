import { createContext } from "react";
import { randomId } from "../utils/string-utils";

let Subcribes = [];
let popups = [];
const subscribe = (f) => {
  Subcribes.push(f);
  return Subcribes.filter(a => a !== f);
};

const unsubscribe = (subcribes) => {
  Subcribes = subcribes;
};

const onChange = () => {
  Subcribes.forEach((f) => {
    f();
  });
};

const getPopups = () => popups;

// {title: '', duration: -1, children: Component }
const addPopup = (item) => {
  const popup = { id: randomId() };
  popups.push({ ...popup, ...item });
  onChange();
  return popup.id;
};

const removePopup = (id) => {
  popups = popups.filter(f => f.id !== id);
  onChange();
};

export const PopupContext = createContext({
  popupId: "",
  onClose: () => {}
});

export {
  getPopups, addPopup, removePopup, subscribe, unsubscribe
};
