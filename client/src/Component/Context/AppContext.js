// AppContext.js
import React, { createContext, useState } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [sideBarOpen, setSideBarOpen] = useState(true);
  const [someOtherState, setSomeOtherState] = useState(false); // Add future states here

  const toggleSidebar = () => {
    setSideBarOpen((prevState) => !prevState);
  };

  const toggleSomeOtherState = () => {
    setSomeOtherState((prevState) => !prevState);
  };

  return (
    <AppContext.Provider
      value={{
        sideBarOpen,
        setSideBarOpen,
        toggleSidebar,
        someOtherState,
        toggleSomeOtherState,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
