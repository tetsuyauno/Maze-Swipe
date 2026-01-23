import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  ImageBackground,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RouteProp } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

import { ThemedText } from "@/components/ThemedText";
import { Spacing, MazeColors, MAZE_THEMES } from "@/constants/theme";
import type { CarIconName } from "@/data/Mazes";
import type { RootStackParamList } from "@/navigation/RootStackNavigator";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "WorldSelect">;
type WorldSelectRouteProp = RouteProp<RootStackParamList, "WorldSelect">;

const themeKeys = Object.keys(MAZE_THEMES);

const THEME_COLORS: Record<string, string[]> = {
  classic: ["#A8D5BA", "#7CB894"],
  candy: ["#FFB6C1", "#FF69B4"],
  ocean: ["#87CEEB", "#4169E1"],
  jungle: ["#90EE90", "#228B22"],
  space: ["#9B59B6", "#5B2C6F"],
};

export default function WorldSelectScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<WorldSelectRouteProp>();
  
  const { level, carIcon } = route.params;

  const handleSelectWorld = (themeName: string) => {
    navigation.navigate("Game", {
      level,
      carIcon,
      theme: themeName,
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
        <ThemedText style={styles.title}>Choose World</ThemedText>
        
        <View style={styles.worldGrid}>
          {themeKeys.map((key) => {
            const theme = MAZE_THEMES[key];
            const colors = THEME_COLORS[key] || ["#A8D5BA", "#7CB894"];
            return (
              <Pressable
                key={key}
                style={styles.worldButton}
                onPress={() => handleSelectWorld(key)}
              >
                <LinearGradient
                  colors={colors}
                  style={styles.worldButtonGradient}
                >
                  <View style={styles.worldPreview}>
                    <ImageBackground
                      source={theme.backgroundImage}
                      style={styles.worldPreviewImage}
                      imageStyle={styles.worldPreviewImageStyle}
                      resizeMode="cover"
                    >
                      <View style={[styles.worldIconBg, { backgroundColor: "rgba(255,255,255,0.9)" }]}>
                        <Feather
                          name={theme.icon as any}
                          size={24}
                          color={theme.walls}
                        />
                      </View>
                    </ImageBackground>
                  </View>
                  <ThemedText style={styles.worldLabel}>
                    {theme.name}
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
  worldGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.md,
    justifyContent: "center",
    maxWidth: 700,
  },
  worldButton: {
    width: 120,
    height: 120,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  worldButtonGradient: {
    flex: 1,
    padding: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  worldPreview: {
    width: 80,
    height: 70,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
  },
  worldPreviewImage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  worldPreviewImageStyle: {
    borderRadius: 12,
  },
  worldIconBg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  worldLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
    marginTop: 6,
    textShadowColor: "rgba(0,0,0,0.2)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
