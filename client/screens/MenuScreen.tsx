import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { ThemedText } from "@/components/ThemedText";
import { Spacing, MazeColors } from "@/constants/theme";
import { CAR_ICONS, CarIconName, MAZE_SIZES } from "@/data/Mazes";
import type { RootStackParamList } from "@/navigation/RootStackNavigator";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Menu">;

export default function MenuScreen() {
  const insets = useSafeAreaInsets();
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
          paddingTop: insets.top + Spacing.lg,
          paddingBottom: insets.bottom + Spacing.lg,
          paddingLeft: insets.left + Spacing.lg,
          paddingRight: insets.right + Spacing.lg,
        },
      ]}
    >
      <View style={styles.header}>
        <Feather name="map" size={32} color={MazeColors.player} />
        <ThemedText style={styles.title}>Maze Adventure</ThemedText>
      </View>

      <View style={styles.mainContent}>
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Choose Maze Size</ThemedText>
          <View style={styles.levelGrid}>
            {levels.map((level) => {
              const sizeConfig = MAZE_SIZES[level];
              return (
                <Pressable
                  key={level}
                  style={[
                    styles.levelButton,
                    selectedLevel === level && styles.levelButtonSelected,
                  ]}
                  onPress={() => setSelectedLevel(level)}
                >
                  <View style={styles.levelIconWrapper}>
                    <Feather
                      name={sizeConfig.icon}
                      size={24}
                      color={
                        selectedLevel === level
                          ? "#FFFFFF"
                          : MazeColors.player
                      }
                    />
                  </View>
                  <ThemedText
                    style={[
                      styles.levelSize,
                      selectedLevel === level && styles.levelSizeSelected,
                    ]}
                  >
                    {sizeConfig.label}
                  </ThemedText>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Pick Your Ride</ThemedText>
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
                <Feather
                  name={icon.name}
                  size={28}
                  color={
                    selectedIcon === icon.name
                      ? "#FFFFFF"
                      : MazeColors.player
                  }
                />
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
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MazeColors.background,
  },
  content: {
    flexGrow: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: MazeColors.textPrimary,
    marginLeft: Spacing.sm,
  },
  mainContent: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    alignItems: "flex-start",
  },
  section: {
    marginBottom: Spacing.lg,
    minWidth: 200,
    maxWidth: 350,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: MazeColors.textPrimary,
    marginBottom: Spacing.md,
    textAlign: "center",
  },
  levelGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
    justifyContent: "center",
  },
  levelButton: {
    width: 80,
    paddingVertical: Spacing.md,
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
  levelIconWrapper: {
    marginBottom: Spacing.xs,
  },
  levelSize: {
    fontSize: 14,
    fontWeight: "600",
    color: MazeColors.textPrimary,
  },
  levelSizeSelected: {
    color: "#FFFFFF",
  },
  iconGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
    justifyContent: "center",
  },
  iconButton: {
    width: 70,
    paddingVertical: Spacing.md,
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
  iconLabel: {
    fontSize: 11,
    color: MazeColors.textSecondary,
    fontWeight: "500",
    marginTop: Spacing.xs,
  },
  iconLabelSelected: {
    color: "#FFFFFF",
  },
  startButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: MazeColors.success,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: 30,
    alignSelf: "center",
    marginTop: Spacing.lg,
  },
  startButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: Spacing.sm,
  },
});
