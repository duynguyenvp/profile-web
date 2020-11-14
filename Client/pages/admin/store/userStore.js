import React, { useReducer, useContext, createContext } from "react";

const initialState = [];

function reducer(state, action) {
  switch (action.type) {
    case "fetch":
      return action.data;
    case "getall":
      return state;
    case "getById":
      return state.filter(f => f.id === action.id);
    case "insertOrUpdate": {
      const temp = state.find(f => f.id === action.user.id);
      if (temp && Object.keys(temp).length) {
        return state.map(f => (f.id === action.user.id ? action.user : f));
      }
      return [...state, action.user];
    }
    case "delete":
      return state.filter(f => f.id !== action.id);
    default:
      return state;
  }
}

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const contextValue = useReducer(reducer, initialState);
  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

const useUser = () => useContext(UserContext);

export default useUser;
