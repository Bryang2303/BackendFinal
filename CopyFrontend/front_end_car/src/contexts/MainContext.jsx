import { createContext, useState, useEffect } from "react";

export const MainContext = createContext()

export default function MainContextProvider(props) {

  const [currentUser, setCurrentUser] = useState("");


  return (
    <MainContext.Provider
    
     value={{
        currentUser: currentUser,
        setCurrentUser: setCurrentUser,
      }}
    >
      {props.children}
    </MainContext.Provider>
  );
}