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
import { Spacing, MazeColors } from "@/constants/theme";
import { CAR_ICONS, CarIconName } from "@/data/Mazes";
import type { RootStackParamList } from "@/navigation/RootStackNavigator";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "RideSelect">;
type RideSelectRouteProp = RouteProp<RootStackParamList, "RideSelect">;

export default function RideSelectScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RideSelectRouteProp>();
  
  const { level } = route.params;
  const [selectedIcon, setSelectedIcon] = useState<CarIconName>("truck");

  const handleStartGame = () => {
    navigation.navigate("Game", {
      level,
      carIcon: selectedIcon,
    });
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
                size={36}
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

        <Pressable style={styles.startButton} onPress={handleStartGame}>
          <Feather name="play" size={24} color="#FFFFFF" />
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
  iconGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.md,
    justifyContent: "center",
    maxWidth: 500,
  },
  iconButton: {
    width: 90,
    height: 90,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
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
    fontSize: 12,
    color: MazeColors.textSecondary,
    fontWeight: "600",
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
    marginTop: Spacing.xl,
  },
  startButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: Spacing.sm,
  },
});
