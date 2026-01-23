import React from "react";
import {
  View,
  StyleSheet,
  Pressable,
  Image,
  ImageSourcePropType,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";

import { ThemedText } from "@/components/ThemedText";
import { Spacing } from "@/constants/theme";
import { MAZE_SIZES } from "@/data/Mazes";
import type { RootStackParamList } from "@/navigation/RootStackNavigator";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Menu">;

const LEVEL_IMAGES: Record<number, ImageSourcePropType> = {
  1: require("../../assets/levels/level1.png"),
  2: require("../../assets/levels/level2.png"),
  3: require("../../assets/levels/level3.png"),
  4: require("../../assets/levels/level4.png"),
  5: require("../../assets/levels/level5.png"),
};

const LEVEL_COLORS: Record<number, string[]> = {
  1: ["#A8D5BA", "#7CB894"],
  2: ["#F5D76E", "#D4AC0D"],
  3: ["#85C1E9", "#5DADE2"],
  4: ["#F5B041", "#E67E22"],
  5: ["#D7BDE2", "#A569BD"],
};

export default function MenuScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();

  const levels = [1, 2, 3, 4, 5];

  const handleSelectLevel = (level: number) => {
    navigation.navigate("RideSelect", { level });
  };

  return (
    <LinearGradient
      colors={["#B8E4F0", "#A5D8E6", "#93CCDC"]}
      style={styles.container}
    >
      <View
        style={[
          styles.content,
          {
            paddingTop: insets.top + Spacing.md,
            paddingBottom: insets.bottom + Spacing.md,
            paddingLeft: insets.left + Spacing.lg,
            paddingRight: insets.right + Spacing.lg,
          },
        ]}
      >
        <ThemedText style={styles.title}>Choose Maze Size</ThemedText>
        
        <View style={styles.levelGrid}>
          {levels.map((level) => {
            const sizeConfig = MAZE_SIZES[level];
            const colors = LEVEL_COLORS[level];
            return (
              <Pressable
                key={level}
                style={styles.levelButton}
                onPress={() => handleSelectLevel(level)}
              >
                <LinearGradient
                  colors={colors}
                  style={styles.levelButtonGradient}
                >
                  <View style={styles.levelImageWrapper}>
                    <Image
                      source={LEVEL_IMAGES[level]}
                      style={styles.levelImage}
                      resizeMode="contain"
                    />
                  </View>
                  <ThemedText style={styles.levelSize}>
                    {sizeConfig.label}
                  </ThemedText>
                </LinearGradient>
              </Pressable>
            );
          })}
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: Spacing.lg,
    textShadowColor: "rgba(255,255,255,0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  levelGrid: {
    flexDirection: "row",
    gap: Spacing.sm,
    justifyContent: "center",
  },
  levelButton: {
    width: 100,
    height: 100,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  levelButtonGradient: {
    flex: 1,
    padding: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  levelImageWrapper: {
    width: 65,
    height: 55,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  levelImage: {
    width: 50,
    height: 50,
  },
  levelSize: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    marginTop: 6,
    textShadowColor: "rgba(0,0,0,0.2)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
