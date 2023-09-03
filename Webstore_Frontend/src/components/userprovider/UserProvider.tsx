import { createContext, useContext, useState } from "react";
import Cookies from "universal-cookie";
const UserContext = createContext({} as any);

const UserProvider = ({ children }: any) => {
  const cookies = new Cookies();
  const [jwt, setJwt] = useState(
    cookies.get("jwt_authorization", { path: "/" } as any)
  );

  const value = { jwt, setJwt };
  cookies.set("jwt_authorization", value.jwt, { path: "/" } as any);
  localStorage.setItem("jwt_authorization", value.jwt);
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
}

export { useUser, UserProvider };
