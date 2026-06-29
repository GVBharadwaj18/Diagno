import { useState } from "react";
import { UserContext } from "./UserContext.js";

// Provider component — this file exports ONLY React components, satisfying Vite Fast Refresh
export function UserContextProvider({ children }) {
  const [userInfo, setUserInfo] = useState(null);
  return (
    <UserContext.Provider value={{ userInfo, setUserInfo }}>
      {children}
    </UserContext.Provider>
  );
}
