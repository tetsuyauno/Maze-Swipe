import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Pressable,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RouteProp } from "@react-navigation/native";

import { ThemedText } from "@/components/ThemedText";
import { Spacing, MazeColors, MAZE_THEMES } from "@/constants/theme";
import { CAR_ICONS, CarIconName } from "@/data/Mazes";
import type { RootStackParamList } from "@/navigation/RootStackNavigator";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "RideSelect">;
type RideSelectRouteProp = RouteProp<RootStackParamList, "RideSelect">;

const themeKeys = Object.keys(MAZE_THEMES);

export default function RideSelectScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RideSelectRouteProp>();
  
  const { level } = route.params;
  const [selectedIcon, setSelectedIcon] = useState<CarIconName>("truck");
  const [selectedTheme, setSelectedTheme] = useState<string>("classic");

  const handleStartGame = () => {
    navigation.navigate("Game", {
      level,
      carIcon: selectedIcon,
      theme: selectedTheme,
    });
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top + Spacing.sm,
          paddingBottom: insets.bottom + Spacing.sm,
          paddingLeft: insets.left + Spacing.md,
          paddingRight: insets.right + Spacing.md,
        },
      ]}
    >
      <View style={styles.leftSection}>
        <ThemedText style={styles.title}>Pick Your Ride</ThemedText>
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
                size={22}
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

      <View style={styles.rightSection}>
        <ThemedText style={styles.title}>Choose World</ThemedText>
        <View style={styles.themeGrid}>
          {themeKeys.map((key) => {
            const theme = MAZE_THEMES[key];
            const isSelected = selectedTheme === key;
            return (
              <Pressable
                key={key}
                style={[
                  styles.themeButton,
                  { backgroundColor: theme.gridPath, borderColor: theme.walls },
                  isSelected && { borderWidth: 3 },
                ]}
                onPress={() => setSelectedTheme(key)}
              >
                <View style={[styles.themeIconBg, { backgroundColor: theme.walls }]}>
                  <Feather
                    name={theme.icon as any}
                    size={16}
                    color="#FFFFFF"
                  />
                </View>
                <ThemedText style={[styles.themeLabel, { color: theme.walls }]}>
                  {theme.name}
                </ThemedText>
              </Pressable>
            );
          })}
        </View>

        <Pressable style={styles.startButton} onPress={handleStartGame}>
          <Feather name="play" size={20} color="#FFFFFF" />
          <ThemedText style={styles.startButtonText}>Start</ThemedText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MazeColors.background,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: Spacing.xl,
  },
  leftSection: {
    alignItems: "center",
  },
  rightSection: {
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: MazeColors.textPrimary,
    marginBottom: Spacing.sm,
  },
  iconGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.xs,
    justifyContent: "center",
    maxWidth: 200,
  },
  iconButton: {
    width: 56,
    height: 56,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  iconButtonSelected: {
    backgroundColor: MazeColors.player,
    borderColor: MazeColors.player,
  },
  iconLabel: {
    fontSize: 8,
    color: MazeColors.textSecondary,
    fontWeight: "600",
    marginTop: 2,
  },
  iconLabelSelected: {
    color: "#FFFFFF",
  },
  themeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.xs,
    justifyContent: "center",
    maxWidth: 260,
  },
  themeButton: {
    width: 64,
    height: 56,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
  },
  themeIconBg: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  themeLabel: {
    fontSize: 9,
    fontWeight: "600",
    marginTop: 2,
  },
  startButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: MazeColors.success,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xl,
    borderRadius: 24,
    marginTop: Spacing.md,
  },
  startButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: Spacing.xs,
  },
});
