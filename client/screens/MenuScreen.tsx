import React from "react";
import {
  View,
  StyleSheet,
  Pressable,
  Image,
  ImageSourcePropType,
  ImageBackground,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";

import { ThemedText } from "@/components/ThemedText";
import { LanguageSwitch } from "@/components/LanguageSwitch";
import { useLanguage } from "@/contexts/LanguageContext";
import { Spacing } from "@/constants/theme";
import { MAZE_SIZES, LEVEL_IMAGES } from "@/data/Mazes";
import type { RootStackParamList } from "@/navigation/RootStackNavigator";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Menu">;


const LEVEL_COLORS: Record<number, [string, string]> = {
  1: ["#A8D5BA", "#7CB894"],
  2: ["#F5D76E", "#D4AC0D"],
  3: ["#85C1E9", "#5DADE2"],
  4: ["#F5B041", "#E67E22"],
  5: ["#D7BDE2", "#A569BD"],
};

export default function MenuScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const { t } = useLanguage();

  const levels = [1, 2, 3, 4, 5];

  const handleSelectLevel = (level: number) => {
    navigation.navigate("RideSelect", { level });
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
            paddingTop: insets.top + Spacing.sm,
            paddingBottom: insets.bottom + Spacing.sm,
            paddingLeft: insets.left + Spacing.md,
            paddingRight: insets.right + Spacing.md,
          },
        ]}
      >
        <View style={styles.header}>
          <LanguageSwitch />
        </View>

        <View style={styles.mainContent}>
          <ThemedText style={styles.title}>{t('menu.title')}</ThemedText>

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
  levelGrid: {
    flexDirection: "row",
    gap: Spacing.sm,
    justifyContent: "center",
  },
  levelButton: {
    width: 90,
    height: 90,
    borderRadius: 14,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  levelButtonGradient: {
    flex: 1,
    padding: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  levelImageWrapper: {
    width: 55,
    height: 45,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  levelImage: {
    width: 40,
    height: 40,
  },
  levelSize: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
    marginTop: 4,
    textShadowColor: "rgba(0,0,0,0.2)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
