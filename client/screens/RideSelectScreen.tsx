import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  ImageBackground,
  Image,
  Dimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RouteProp } from "@react-navigation/native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { LanguageSwitch } from "@/components/LanguageSwitch";
import { useLanguage } from "@/contexts/LanguageContext";
import { Spacing, MazeColors } from "@/constants/theme";
import { CAR_ICONS, CarIconName } from "@/data/Mazes";
import type { RootStackParamList } from "@/navigation/RootStackNavigator";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "RideSelect">;
type RideSelectRouteProp = RouteProp<RootStackParamList, "RideSelect">;

interface IconButtonProps {
  icon: any;
  isSelected: boolean;
  onPress: () => void;
  label: string;
}

function AnimatedIconButton({ icon, isSelected, onPress, label, size }: IconButtonProps & { size: number }) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    scale.value = withSequence(
      withTiming(1.15, { duration: 100 }),
      withSpring(1)
    );
    onPress();
  };

  return (
    <AnimatedPressable
      style={[
        styles.iconButton,
        { width: size, height: size },
        isSelected && styles.iconButtonSelected,
        animatedStyle,
      ]}
      onPress={handlePress}
    >
      <Image
        source={icon.image}
        style={[
          styles.iconImage,
          isSelected && styles.iconImageSelected,
        ]}
        resizeMode="contain"
      />
      <ThemedText
        style={[
          styles.iconLabel,
          isSelected && styles.iconLabelSelected,
        ]}
      >
        {label}
      </ThemedText>
    </AnimatedPressable>
  );
}

export default function RideSelectScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RideSelectRouteProp>();
  const { t } = useLanguage();

  const { width, height } = Dimensions.get("window");
  const { level } = route.params;

  const availableWidth = width - insets.left - insets.right - (Spacing.md * 2);
  const buttonSize = Math.floor(Math.min(80, (availableWidth - (Spacing.sm * 5)) / 6));
  const [selectedIcon, setSelectedIcon] = useState<CarIconName>("submarine");

  const handleContinue = () => {
    navigation.navigate("WorldSelect", {
      level,
      carIcon: selectedIcon,
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
          <ThemedText style={styles.title}>{t('ride.title')}</ThemedText>

          <View style={styles.iconGrid}>
            {CAR_ICONS.map((icon) => (
              <AnimatedIconButton
                key={icon.name}
                icon={icon}
                isSelected={selectedIcon === icon.name}
                onPress={() => setSelectedIcon(icon.name)}
                label={t(`ride.${icon.name}`)}
                size={buttonSize}
              />
            ))}
          </View>

          <Pressable style={styles.nextButton} onPress={handleContinue}>
            <ThemedText style={styles.nextButtonText}>{t('ride.next')}</ThemedText>
            <Feather name="arrow-right" size={18} color="#FFFFFF" />
          </Pressable>
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
  iconGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
    justifyContent: "center",
    paddingHorizontal: Spacing.md,
  },
  iconButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    marginBottom: Spacing.xs,
  },
  iconButtonSelected: {
    borderColor: MazeColors.player,
    backgroundColor: "#FFFFFF",
    borderWidth: 3,
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  iconLabel: {
    fontSize: 9,
    color: MazeColors.textSecondary,
    fontWeight: "600",
    marginTop: 2,
    textAlign: "center",
  },
  iconLabelSelected: {
    color: MazeColors.player,
    fontWeight: "bold",
  },
  iconImage: {
    width: 36,
    height: 36,
    opacity: 0.7,
  },
  iconImageSelected: {
    opacity: 1,
    // tintColor: "#FFFFFF", // Removed as requested to keep original icon colors
  },
  nextButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: MazeColors.success,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: 25,
    marginTop: Spacing.xl,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  nextButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    marginRight: Spacing.sm,
  },
});
