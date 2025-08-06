import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Dimensions } from "react-native";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

export default function LandingAnimation() {
  const router = useRouter();
  const translateX = useRef(new Animated.Value(-100)).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const bgColor = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: width / 2 - 40 - 20,
        duration: 1600,
        useNativeDriver: true,
      }),
      Animated.timing(rotate, {
        toValue: 4,
        duration: 1600,
        useNativeDriver: true,
      }),
    ]).start(() => {
      Animated.parallel([
        Animated.timing(scale, {
          toValue: 2,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(bgColor, {
          toValue: 1,
          duration: 600,
          useNativeDriver: false,
        }),
      ]).start(() => {
        setTimeout(() => {
          router.replace("/screens/home");
        }, 800);
      });
    });
  }, []);

  const rotateInterpolate = rotate.interpolate({
    inputRange: [0, 4],
    outputRange: ["0deg", "360deg"],
  });

  const bgColorInterpolate = bgColor.interpolate({
    inputRange: [0, 1],
    outputRange: ["#fff", "#0077cc"],
  });

  return (
    <Animated.View
      style={[styles.container, { backgroundColor: bgColorInterpolate }]}
    >
      <Animated.Image
        source={require("../assets/logo.png")}
        style={[
          styles.logo,
          {
            transform: [
              { translateX },
              { rotate: rotateInterpolate },
              { scale },
            ],
          },
        ]}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
    paddingLeft: 20,
  },
  logo: {
    width: 80,
    height: 80,
  },
});
