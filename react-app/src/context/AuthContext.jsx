import {
  createContext,
  useState,
} from "react";
import { toast } from "react-toastify";

export const AuthContext =
  createContext();

function AuthProvider({
  children,
}) {

  const [token,
    setToken] =
    useState(
      localStorage.getItem(
        "token"
      )
    );

  const [role,
    setRole] =
    useState(
      localStorage.getItem(
        "role"
      )
    );

  const login = (

    newToken,

    newRole,

    userId

  ) => {

    localStorage.setItem(
      "token",
      newToken
    );

    localStorage.setItem(
      "role",
      newRole
    );

    localStorage.setItem(

      "userId",

      userId

    );

    setToken(
      newToken
    );

    setRole(
      newRole
    );

  };

  const logout = () => {

    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "role"
    );
    localStorage.removeItem(

      "userId"

    );

    setToken(
      null
    );

    setRole(
      null
    );

    toast.info("Logged out successfully");
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        role,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default
  AuthProvider;