import React from "react";
import {
  View,
  StyleSheet,
  Pressable,
  Image,
  ImageSourcePropType,
  ImageBackground,
  Dimensions,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
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

  const { width, height } = Dimensions.get("window");
  const levels = [1, 2, 3, 4, 5];

  const availableWidth = width - insets.left - insets.right - (Spacing.md * 2);
  const buttonWidth = Math.floor(Math.min(130, (availableWidth - (Spacing.md * 2)) / 3));
  const buttonHeight = buttonWidth * 1.3; // Make it taller than wide

  const handleSelectLevel = (level: number) => {
    navigation.navigate("RideSelect", { level });
  };

  return (
    <ImageBackground
      source={require("../../assets/backgrounds/menu-bg.png")}
      style={styles.container}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
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
                    hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                  >
                    <LinearGradient
                      colors={colors}
                      style={[styles.levelButtonGradient, { width: buttonWidth, height: buttonHeight }]}
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
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
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
    fontSize: 32,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: Spacing.xl,
    textShadowColor: "rgba(255,255,255,0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  levelGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.xl,
    justifyContent: "center",
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  levelButton: {
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: Spacing.md,
  },
  levelButtonGradient: {
    padding: Spacing.md,
    alignItems: "center",
    justifyContent: "center",
  },
  levelImageWrapper: {
    width: "85%",
    height: "55%",
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    padding: 10,
  },
  levelImage: {
    width: "90%",
    height: "90%",
  },
  levelSize: {
    fontSize: 18,
    fontWeight: "900",
    color: "#FFFFFF",
    marginTop: 12,
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});
