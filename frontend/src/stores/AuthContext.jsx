import { createContext, useContext, useEffect, useReducer } from "react";
import {
  getCurrentUser,
  logout as authLogout,
} from "../services/authService.js";

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  role: null,
  hydrating: true,
};

function authReducer(state, action) {
  switch (action.type) {
    case "LOGIN":
      return {
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        role: action.payload.role,
        hydrating: false,
      };
    case "HYDRATION_COMPLETE":
      return {
        ...state,
        hydrating: false,
      };
    case "LOGOUT":
      return {
        ...initialState,
        hydrating: false,
      };
    default:
      return state;
  }
}

export const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const hydrateAuth = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        dispatch({ type: "HYDRATION_COMPLETE" });
        return;
      }

      try {
        const currentUser = await getCurrentUser();

        dispatch({
          type: "LOGIN",
          payload: {
            user: currentUser,
            token,
            role: currentUser?.role,
          },
        });
      } catch (error) {
        localStorage.removeItem("token");
        dispatch({ type: "LOGOUT" });
      }
    };

    hydrateAuth();
  }, []);

  const login = (user, token, role) => {
    localStorage.setItem("token", token);
    dispatch({
      type: "LOGIN",
      payload: { user, token, role },
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