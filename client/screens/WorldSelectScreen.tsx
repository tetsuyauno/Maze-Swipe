import React from "react";
import {
  View,
  StyleSheet,
  Pressable,
  ImageBackground,
  Dimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RouteProp } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

import { ThemedText } from "@/components/ThemedText";
import { LanguageSwitch } from "@/components/LanguageSwitch";
import { useLanguage } from "@/contexts/LanguageContext";
import { Spacing, MAZE_THEMES } from "@/constants/theme";
import type { RootStackParamList } from "@/navigation/RootStackNavigator";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "WorldSelect">;
type WorldSelectRouteProp = RouteProp<RootStackParamList, "WorldSelect">;

const themeKeys = Object.keys(MAZE_THEMES);

const THEME_COLORS: Record<string, [string, string]> = {
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
  const { t } = useLanguage();

  const { width, height } = Dimensions.get("window");
  const { level, carIcon } = route.params;

  const availableWidth = width - insets.left - insets.right - (Spacing.md * 2);
  const buttonSize = Math.floor(Math.min(100, (availableWidth - (Spacing.sm * 4)) / 5));

  const handleSelectWorld = (themeName: string) => {
    navigation.navigate("Game", {
      level,
      carIcon,
      theme: themeName,
    });
  };

  return (
    <ImageBackground
      source={require("../../assets/backgrounds/menu-bg.png")}
      style={styles.container}
      resizeMode="cover"
    >
      <View
        style={[
          styles.content,
          {
            paddingTop: insets.top + Spacing.xs,
            paddingBottom: insets.bottom + Spacing.xs,
            paddingLeft: insets.left + Spacing.sm,
            paddingRight: insets.right + Spacing.sm,
          },
        ]}
      >
        <View style={styles.header}>
          <LanguageSwitch />
        </View>

        <View style={styles.mainContent}>
          <ThemedText style={styles.title}>{t('world.title')}</ThemedText>

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
                    style={[styles.worldButtonGradient, { width: buttonSize, height: buttonSize }]}
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
                            size={20}
                            color={theme.walls}
                          />
                        </View>
                      </ImageBackground>
                    </View>
                    <ThemedText style={styles.worldLabel}>
                      {t(`world.${key}`)}
                    </ThemedText>
                  </LinearGradient>
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  mainContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: Spacing.md,
    textShadowColor: "rgba(255,255,255,0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  worldGrid: {
    flexDirection: "row",
    gap: Spacing.sm,
    justifyContent: "center",
  },
  worldButton: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  worldButtonGradient: {
    flex: 1,
    padding: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  worldPreview: {
    width: 55,
    height: 50,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
  },
  worldPreviewImage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  worldPreviewImageStyle: {
    borderRadius: 10,
  },
  worldIconBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  worldLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
    marginTop: 4,
    textShadowColor: "rgba(0,0,0,0.2)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
