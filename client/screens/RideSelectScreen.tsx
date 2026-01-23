import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  ScrollView,
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
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.scrollContent,
        {
          paddingTop: insets.top + Spacing.md,
          paddingBottom: insets.bottom + Spacing.md,
          paddingLeft: insets.left + Spacing.lg,
          paddingRight: insets.right + Spacing.lg,
        },
      ]}
    >
      <View style={styles.content}>
        <View style={styles.section}>
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

        <View style={styles.section}>
          <ThemedText style={styles.title}>Choose a World</ThemedText>
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
                    isSelected && { borderWidth: 4 },
                  ]}
                  onPress={() => setSelectedTheme(key)}
                >
                  <View style={[styles.themeIconBg, { backgroundColor: theme.walls }]}>
                    <Feather
                      name={theme.icon as any}
                      size={20}
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
        </View>

        <Pressable style={styles.startButton} onPress={handleStartGame}>
          <Feather name="play" size={24} color="#FFFFFF" />
          <ThemedText style={styles.startButtonText}>Start</ThemedText>
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
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    gap: Spacing.xl,
  },
  section: {
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: MazeColors.textPrimary,
    marginBottom: Spacing.md,
  },
  iconGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
    justifyContent: "center",
    maxWidth: 280,
  },
  iconButton: {
    width: 70,
    height: 70,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
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
    fontSize: 10,
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
    gap: Spacing.sm,
    justifyContent: "center",
    maxWidth: 320,
  },
  themeButton: {
    width: 80,
    height: 70,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
  },
  themeIconBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  themeLabel: {
    fontSize: 11,
    fontWeight: "600",
    marginTop: 4,
  },
  startButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: MazeColors.success,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: 30,
  },
  startButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: Spacing.sm,
  },
});
