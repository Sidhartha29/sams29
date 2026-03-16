import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext({
  user: null,
  loading: true,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Validate essential fields exist
        if (parsed && parsed.role && (parsed.role === "student" || parsed.role === "admin")) {
          setUser(parsed);
        } else {
          console.warn("Stored user missing required fields, clearing.");
          localStorage.removeItem("user");
        }
      } catch (err) {
        console.warn("Invalid stored user data, clearing.", err);
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
