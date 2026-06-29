import { createContext, useContext } from "react";

// Plain context object — no React component here (required for Vite Fast Refresh)
export const UserContext = createContext(null);

// Hook lives here (not a component, so no Fast Refresh issue)
// Vite resolves "UserContext" → UserContext.js, so consumers get this automatically
export function useUserContext() {
  return useContext(UserContext);
}
