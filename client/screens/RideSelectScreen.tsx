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
import { LinearGradient } from "expo-linear-gradient";

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

  const handleContinue = () => {
    navigation.navigate("WorldSelect", {
      level,
      carIcon: selectedIcon,
    });
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

        <Pressable style={styles.nextButton} onPress={handleContinue}>
          <ThemedText style={styles.nextButtonText}>Next</ThemedText>
          <Feather name="arrow-right" size={20} color="#FFFFFF" />
        </Pressable>
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
  iconGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.md,
    justifyContent: "center",
    maxWidth: 400,
  },
  iconButton: {
    width: 72,
    height: 72,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "transparent",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  iconButtonSelected: {
    backgroundColor: MazeColors.player,
    borderColor: "#FFFFFF",
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
  nextButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: MazeColors.success,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: 30,
    marginTop: Spacing.xl,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  nextButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    marginRight: Spacing.sm,
  },
});
