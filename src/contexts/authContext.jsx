import React, { createContext, useState, useEffect, ReactNode } from "react";
import apiFetch from "../apiFetch";
import { Navigate } from "react-router-dom";
// Create a context for auth
const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isPaid,setIsPaid]= useState(false);
 
  const [loading, setLoading] = useState(true);




  /**
   * fetchUser
   *
   * This function calls the API to get the current authenticated user.
   * If the response shows the user is unauthenticated (e.g., 401 Unauthorized),
   * it removes the JWT token from localStorage and sets the user state to null.
   *
   * This helps ensure that if the token is invalid or expired, it won't be used further.
   */
  const fetchUser = async () => {
    try {
      const res = await apiFetch("auth/me", { method: "GET" });
      const data = await res.json();
      if (res.ok) {
        
        setUser(data.data);
        setIsPaid(data.data.is_paid);
        
      } 

      if (data.message === "Unauthenticated") {
        localStorage.removeItem("jwtToken");
        return <Navigate to="/" replace />;
        
      } 
    } catch (error) {
      console.error("Fetch user error:", error);
      localStorage.removeItem("jwtToken");
      return <Navigate to="/" replace />;
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Call fetchUser once on component mount to check the user's auth status.
  useEffect(() => {
    fetchUser();
    
  }, []);

 



  const login = async (email, password) => {
    try {
      
      const res = await apiFetch("auth/login", {
        auth: false,
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("jwtToken", data.data.token);
        fetchUser();
        return { success: data.status, message: data.message };
      } else {
        const errorData = await res.json();
        return { success: false, message: errorData.message || "Login failed" };
      }
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: error.message || "Login failed" };
    }
  };

  const register = async (name, email, password, password_confirmation) => {
    try {
      const res = await apiFetch("auth/register", {
        auth: false,
        method: "POST",
        body: JSON.stringify({ name, email, password, password_confirmation }),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("jwtToken", data.data.token);
        setUser(data.data.user);
        return { success: data.status, message: data.message };
      } else {
        const errorData = await res.json();
        return {
          success: false,
          message: errorData.message || "Registration failed",
        };
      }
    } catch (error) {
      console.error("Registration error:", error);
      return {
        success: false,
        message: error.message || "Registration failed",
      };
    }
  };

  const logout = async () => {
    try {
      const res = await apiFetch("auth/logout", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        return { success: data.status, message: data.message };
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("jwtToken");
      setUser(null);
    }
  };

  const refreshToken = async () => {
    try {
      const res = await apiFetch("auth/refresh-token", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        const newToken = data.data.access_token || data.data.token;
        localStorage.setItem("jwtToken", newToken);
      } else {
        logout();
      }
    } catch (error) {
      console.error("Refresh token error:", error);
      logout();
    }
  };

  return (
    <AuthContext
      value={{ user, loading, login, register, logout, refreshToken,isPaid,fetchUser }}
    >
      {children}
    </AuthContext>
  );
};

export { AuthContext, AuthProvider };
