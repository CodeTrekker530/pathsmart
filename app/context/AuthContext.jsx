// app/context/AuthContext.js
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter, useSegments } from "expo-router";
import Cookies from "js-cookie";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const segments = useSegments();

  // Load user from cookies on app start
  useEffect(() => {
    const storedUser = Cookies.get("user");
    if (storedUser) setUser(JSON.parse(storedUser));
    setLoading(false);
  }, []);

  // Authentication guard effect
  useEffect(() => {
    if (loading) return; // Don't do anything while loading

    const inAuthGroup =
      segments[0] === "screens" && segments[1] === "loginScreen";
    const inProtectedGroup = segments[0] === "modules";
    console.log(inAuthGroup, inProtectedGroup, user);
    if (!user && inProtectedGroup) {
      // Unauthenticated user trying to access protected routes
      router.replace("/screens/loginScreen");
    } else if (user && inAuthGroup) {
      // Authenticated user trying to access login screen
      router.replace("/modules/stallManagement/screens/adminInterface");
    } else if (user && segments.length === 0) {
      // Authenticated user at root, redirect to admin interface
      router.replace("/modules/stallManagement/screens/adminInterface");
    } else if (!user && segments.length === 0) {
      // init screen for unauthenticated users
      router.replace("/");
    }
  }, [user, segments, loading, router]);

  // Save user to cookies on login
  const login = userData => {
    console.log("Login successful, user data:", userData);
    setUser(userData);
    Cookies.set("user", JSON.stringify(userData), {
      expires: 7, // 7 days
      secure: true,
      httpOnly: false,
      sameSite: "strict", // CSRF protection
    });
  };

  // Remove user from cookies on logout
  const logout = () => {
    console.log("Logging out user");
    setUser(null);
    Cookies.remove("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
