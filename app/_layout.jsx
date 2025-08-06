import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import LandingAnimation from "./screens/landing_animation";

export default function Layout() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2000); // adjust duration
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <LandingAnimation onFinish={() => setShowSplash(false)} />;
  }

  return <Stack />;
}
