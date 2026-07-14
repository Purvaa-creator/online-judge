import { createContext, useContext, useEffect, useReducer } from "react";
import { logout as authLogout } from "../services/authService.js";

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

function authReducer(state, action) {
  switch (action.type) {
    case "LOGIN":
      return {
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
      };
    case "LOGOUT":
      return initialState;
    default:
      return state;
  }
}

export const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      dispatch({
        type: "LOGIN",
        payload: {
          user: null,
          token,
        },
      });
    }
  }, []);

  const login = (user, token) => {
    localStorage.setItem("token", token);
    dispatch({
      type: "LOGIN",
      payload: { user, token },
    });
  };

  const logout = async () => {
    await authLogout();
    dispatch({ type: "LOGOUT" });
  };

  const value = {
    ...state,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}