// app/context/AuthContext.js
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter, useSegments } from "expo-router";
import Cookies from "js-cookie";
import { supabase } from "../../backend/supabaseClient";
import bcrypt from "bcryptjs";

const AuthContext = createContext();

// Helper function to get the correct dashboard based on user type
const getDashboardRoute = userType => {
  if (userType === "MEPO employee") {
    return "/modules/stallManagement/screens/adminInterface";
  } else if (userType === "Stall Owner") {
    return "/modules/storeManagement/screens/dashboard";
  }

  return "/modules/stallManagement/screens/adminInterface";
};

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
    } // ...existing code...
    else if (user && inAuthGroup) {
      // Authenticated user trying to access login screen
      const dashboardRoute = getDashboardRoute(user.userType);
      router.replace(dashboardRoute);
    }
    // ...existing code...
    else if (!user && segments.length === 0) {
      // init screen for unauthenticated users
      router.replace("/");
    }
  }, [user, segments, loading, router]);

  // Save user to cookies on login
  const login = async (username, password, userType) => {
    const table =
      userType === "MEPO employee"
        ? "mepo_employee_account"
        : "stall_owner_account";

    const { data, error } = await supabase
      .from(table)
      .select("*")
      .eq("username", username)
      .single();

    if (error || !data) {
      console.error("Invalid credentials");
      return null;
    }

    const passwordMatch = await bcrypt.compare(password, data.password);
    if (!passwordMatch) {
      console.error("Password mismatch");
      return null;
    }

    const userData = { ...data, userType };
    setUser(userData);
    Cookies.set("user", JSON.stringify(userData), {
      expires: 7,
      secure: true,
      sameSite: "strict",
    });

    return userData;
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
