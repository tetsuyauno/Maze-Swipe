import React, { useState } from "react";
import { View, StyleSheet, Switch, Alert, Pressable } from "react-native";
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
      "Reset Progress",
      "Are you sure you want to reset all progress? This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: () => {
            navigation.goBack();
          },
        },
      ]
    );
  };

  return (
    <View
      style={[
        styles.container,
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
            trackColor={{ false: MazeColors.disabled, true: MazeColors.accent }}
            thumbColor={soundEnabled ? MazeColors.player : MazeColors.textSecondary}
          />
        </View>

        <View style={styles.settingRow}>
          <ThemedText style={styles.settingLabel}>Haptic Feedback</ThemedText>
          <Switch
            value={hapticEnabled}
            onValueChange={setHapticEnabled}
            trackColor={{ false: MazeColors.disabled, true: MazeColors.accent }}
            thumbColor={hapticEnabled ? MazeColors.player : MazeColors.textSecondary}
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
          <ThemedText style={styles.resetButtonText}>Reset Progress</ThemedText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MazeColors.background,
    paddingHorizontal: Spacing.lg,
  },
  section: {
    backgroundColor: MazeColors.gridPath,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    gap: Spacing.lg,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: MazeColors.textPrimary,
  },
  dangerSection: {
    marginTop: Spacing.xl,
  },
  resetButton: {
    backgroundColor: "#DC3545",
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.md,
    alignItems: "center",
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
