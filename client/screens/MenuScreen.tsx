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

import { ThemedText } from "@/components/ThemedText";
import { Spacing, MazeColors } from "@/constants/theme";
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

export default function MenuScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();

  const levels = [1, 2, 3, 4, 5];

  const handleSelectLevel = (level: number) => {
    navigation.navigate("RideSelect", { level });
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top + Spacing.md,
          paddingBottom: insets.bottom + Spacing.md,
          paddingLeft: insets.left + Spacing.lg,
          paddingRight: insets.right + Spacing.lg,
        },
      ]}
    >
      <View style={styles.content}>
        <ThemedText style={styles.title}>Choose Maze Size</ThemedText>
        
        <View style={styles.levelGrid}>
          {levels.map((level) => {
            const sizeConfig = MAZE_SIZES[level];
            return (
              <Pressable
                key={level}
                style={styles.levelButton}
                onPress={() => handleSelectLevel(level)}
              >
                <Image
                  source={LEVEL_IMAGES[level]}
                  style={styles.levelImage}
                  resizeMode="contain"
                />
                <ThemedText style={styles.levelSize}>
                  {sizeConfig.label}
                </ThemedText>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MazeColors.background,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: MazeColors.textPrimary,
    marginBottom: Spacing.lg,
  },
  levelGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.md,
    justifyContent: "center",
    maxWidth: 600,
  },
  levelButton: {
    width: 100,
    height: 100,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.xs,
  },
  levelImage: {
    width: 60,
    height: 60,
  },
  levelSize: {
    fontSize: 14,
    fontWeight: "600",
    color: MazeColors.textPrimary,
    marginTop: 2,
  },
});
