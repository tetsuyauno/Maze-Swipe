import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { ThemedText } from "@/components/ThemedText";
import { Spacing, MazeColors } from "@/constants/theme";
import { CAR_ICONS, CarIconName } from "@/data/Mazes";
import type { RootStackParamList } from "@/navigation/RootStackNavigator";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Menu">;

export default function MenuScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const navigation = useNavigation<NavigationProp>();

  const [selectedLevel, setSelectedLevel] = useState<number>(1);
  const [selectedIcon, setSelectedIcon] = useState<CarIconName>("truck");

  const levels = [1, 2, 3, 4, 5];

  const handleStartGame = () => {
    navigation.navigate("Game", {
      level: selectedLevel,
      carIcon: selectedIcon,
    });
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: headerHeight + Spacing.lg,
          paddingBottom: insets.bottom + Spacing.xl,
        },
      ]}
    >
      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Choose Difficulty</ThemedText>
        <ThemedText style={styles.sectionSubtitle}>
          Higher levels have trickier paths
        </ThemedText>
        <View style={styles.levelGrid}>
          {levels.map((level) => (
            <Pressable
              key={level}
              style={[
                styles.levelButton,
                selectedLevel === level && styles.levelButtonSelected,
              ]}
              onPress={() => setSelectedLevel(level)}
            >
              <ThemedText
                style={[
                  styles.levelNumber,
                  selectedLevel === level && styles.levelNumberSelected,
                ]}
              >
                {level}
              </ThemedText>
              <ThemedText
                style={[
                  styles.levelLabel,
                  selectedLevel === level && styles.levelLabelSelected,
                ]}
              >
                {level === 1
                  ? "Easy"
                  : level === 2
                  ? "Normal"
                  : level === 3
                  ? "Medium"
                  : level === 4
                  ? "Hard"
                  : "Expert"}
              </ThemedText>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Pick Your Ride</ThemedText>
        <ThemedText style={styles.sectionSubtitle}>
          Choose an icon to navigate the maze
        </ThemedText>
        <View style={styles.iconGrid}>
          {CAR_ICONS.map((icon) => (
            <Pressable
              key={icon.name}
              style={[
                styles.iconButton,
                selectedIcon === icon.name && styles.iconButtonSelected,
              ]}
              onPress={() => setSelectedIcon(icon.name)}
            >
              <View style={styles.iconWrapper}>
                <Feather
                  name={icon.name}
                  size={32}
                  color={
                    selectedIcon === icon.name
                      ? "#FFFFFF"
                      : MazeColors.player
                  }
                />
              </View>
              <ThemedText
                style={[
                  styles.iconLabel,
                  selectedIcon === icon.name && styles.iconLabelSelected,
                ]}
              >
                {icon.label}
              </ThemedText>
            </Pressable>
          ))}
        </View>
      </View>

      <Pressable style={styles.startButton} onPress={handleStartGame}>
        <Feather name="play" size={24} color="#FFFFFF" />
        <ThemedText style={styles.startButtonText}>Start Adventure</ThemedText>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MazeColors.background,
  },
  content: {
    paddingHorizontal: Spacing.lg,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: MazeColors.textPrimary,
    marginBottom: Spacing.xs,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: MazeColors.textSecondary,
    marginBottom: Spacing.md,
  },
  levelGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  levelButton: {
    width: "18%",
    aspectRatio: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "transparent",
  },
  levelButtonSelected: {
    backgroundColor: MazeColors.player,
    borderColor: MazeColors.player,
  },
  levelNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: MazeColors.textPrimary,
  },
  levelNumberSelected: {
    color: "#FFFFFF",
  },
  levelLabel: {
    fontSize: 10,
    color: MazeColors.textSecondary,
    marginTop: 2,
  },
  levelLabelSelected: {
    color: "rgba(255, 255, 255, 0.9)",
  },
  iconGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  iconButton: {
    width: "30%",
    aspectRatio: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "transparent",
  },
  iconButtonSelected: {
    backgroundColor: MazeColors.player,
    borderColor: MazeColors.player,
  },
  iconWrapper: {
    marginBottom: Spacing.xs,
  },
  iconLabel: {
    fontSize: 12,
    color: MazeColors.textSecondary,
    fontWeight: "500",
  },
  iconLabelSelected: {
    color: "#FFFFFF",
  },
  startButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: MazeColors.success,
    paddingVertical: Spacing.lg,
    borderRadius: 30,
    marginTop: Spacing.md,
  },
  startButtonText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: Spacing.sm,
  },
});
