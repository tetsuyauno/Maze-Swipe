import React, { useEffect } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  withSpring,
  Easing,
  runOnJS,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/navigation/RootStackNavigator";
import { ThemedText } from "@/components/ThemedText";
import { MazeColors, Spacing } from "@/constants/theme";

const { width, height } = Dimensions.get("window");

type SplashNavProp = NativeStackNavigationProp<RootStackParamList, "Splash">;

export default function SplashScreen() {
  const navigation = useNavigation<SplashNavProp>();
  
  const logoScale = useSharedValue(0);
  const logoRotate = useSharedValue(-180);
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(30);
  const subtitleOpacity = useSharedValue(0);
  const screenOpacity = useSharedValue(1);
  
  const star1Scale = useSharedValue(0);
  const star2Scale = useSharedValue(0);
  const star3Scale = useSharedValue(0);
  const star1Rotate = useSharedValue(0);
  const star2Rotate = useSharedValue(0);
  const star3Rotate = useSharedValue(0);

  const navigateToMenu = () => {
    navigation.replace("Menu");
  };

  useEffect(() => {
    logoScale.value = withSpring(1, { damping: 8, stiffness: 100 });
    logoRotate.value = withSpring(0, { damping: 12, stiffness: 80 });
    
    titleOpacity.value = withDelay(400, withTiming(1, { duration: 500 }));
    titleTranslateY.value = withDelay(400, withSpring(0, { damping: 12 }));
    
    subtitleOpacity.value = withDelay(700, withTiming(1, { duration: 400 }));
    
    star1Scale.value = withDelay(300, withSpring(1, { damping: 6 }));
    star1Rotate.value = withDelay(300, withTiming(360, { duration: 1000 }));
    
    star2Scale.value = withDelay(500, withSpring(1, { damping: 6 }));
    star2Rotate.value = withDelay(500, withTiming(-360, { duration: 1200 }));
    
    star3Scale.value = withDelay(700, withSpring(1, { damping: 6 }));
    star3Rotate.value = withDelay(700, withTiming(360, { duration: 1400 }));
    
    const timer = setTimeout(() => {
      screenOpacity.value = withTiming(0, { duration: 400, easing: Easing.out(Easing.ease) }, () => {
        runOnJS(navigateToMenu)();
      });
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: logoScale.value },
      { rotate: `${logoRotate.value}deg` },
    ],
  }));

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslateY.value }],
  }));

  const subtitleStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
  }));

  const screenStyle = useAnimatedStyle(() => ({
    opacity: screenOpacity.value,
  }));

  const star1Style = useAnimatedStyle(() => ({
    transform: [
      { scale: star1Scale.value },
      { rotate: `${star1Rotate.value}deg` },
    ],
  }));

  const star2Style = useAnimatedStyle(() => ({
    transform: [
      { scale: star2Scale.value },
      { rotate: `${star2Rotate.value}deg` },
    ],
  }));

  const star3Style = useAnimatedStyle(() => ({
    transform: [
      { scale: star3Scale.value },
      { rotate: `${star3Rotate.value}deg` },
    ],
  }));

  return (
    <Animated.View style={[styles.container, screenStyle]}>
      <LinearGradient
        colors={["#667eea", "#764ba2", "#f093fb"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <Animated.View style={[styles.star, styles.star1, star1Style]}>
            <Feather name="star" size={24} color="#FFD700" />
          </Animated.View>
          <Animated.View style={[styles.star, styles.star2, star2Style]}>
            <Feather name="star" size={18} color="#FFA500" />
          </Animated.View>
          <Animated.View style={[styles.star, styles.star3, star3Style]}>
            <Feather name="star" size={20} color="#FF69B4" />
          </Animated.View>
          
          <Animated.View style={[styles.logoContainer, logoStyle]}>
            <View style={styles.logoInner}>
              <Feather name="grid" size={60} color="#FFFFFF" />
            </View>
          </Animated.View>
          
          <Animated.View style={titleStyle}>
            <ThemedText style={styles.title}>Maze Adventure</ThemedText>
          </Animated.View>
          
          <Animated.View style={subtitleStyle}>
            <ThemedText style={styles.subtitle}>Find your way!</ThemedText>
          </Animated.View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 30,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  logoInner: {
    width: 90,
    height: 90,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 18,
    color: "rgba(255, 255, 255, 0.9)",
    marginTop: Spacing.sm,
    textAlign: "center",
  },
  star: {
    position: "absolute",
  },
  star1: {
    top: "20%",
    left: "15%",
  },
  star2: {
    top: "25%",
    right: "20%",
  },
  star3: {
    bottom: "30%",
    left: "25%",
  },
});
