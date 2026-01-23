import React, { useState } from "react";
import { View, StyleSheet, Switch, Alert, Pressable, ImageBackground } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

import { ThemedText } from "@/components/ThemedText";
import { Spacing, BorderRadius, MazeColors } from "@/constants/theme";

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hapticEnabled, setHapticEnabled] = useState(true);

  const handleResetProgress = () => {
    Alert.alert(
      "Start Over?",
      "Are you sure you want to start the game from the beginning?",
      [
        { text: "No, Keep Playing", style: "cancel" },
        {
          text: "Yes, Start Over",
          style: "destructive",
          onPress: () => {
            navigation.goBack();
          },
        },
      ]
    );
  };

  return (
    <ImageBackground
      source={require("../../assets/backgrounds/menu-bg.png")}
      style={styles.container}
      resizeMode="cover"
    >
      <View
        style={[
          styles.innerContainer,
          {
            paddingTop: Spacing.xl,
            paddingBottom: insets.bottom + Spacing.xl,
          },
        ]}
      >
      <View style={styles.section}>
        <View style={styles.settingRow}>
          <ThemedText style={styles.settingLabel}>Sound Effects</ThemedText>
          <Switch
            value={soundEnabled}
            onValueChange={setSoundEnabled}
            trackColor={{ false: MazeColors.disabled, true: MazeColors.success }}
            thumbColor={soundEnabled ? "#FFFFFF" : "#FFFFFF"}
          />
        </View>

        <View style={styles.settingRow}>
          <ThemedText style={styles.settingLabel}>Haptic Feedback</ThemedText>
          <Switch
            value={hapticEnabled}
            onValueChange={setHapticEnabled}
            trackColor={{ false: MazeColors.disabled, true: MazeColors.success }}
            thumbColor={hapticEnabled ? "#FFFFFF" : "#FFFFFF"}
          />
        </View>
      </View>

      <View style={styles.dangerSection}>
        <Pressable
          style={({ pressed }) => [
            styles.resetButton,
            {
              opacity: pressed ? 0.8 : 1,
              transform: [{ scale: pressed ? 0.98 : 1 }],
            },
          ]}
          onPress={handleResetProgress}
        >
          <ThemedText style={styles.resetButtonText}>Start Over</ThemedText>
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
  innerContainer: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  section: {
    backgroundColor: MazeColors.gridPath,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    gap: Spacing.lg,
    borderWidth: 2,
    borderColor: MazeColors.walls,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: MazeColors.textPrimary,
  },
  dangerSection: {
    marginTop: Spacing.xl,
  },
  resetButton: {
    backgroundColor: MazeColors.player,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.md,
    alignItems: "center",
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
