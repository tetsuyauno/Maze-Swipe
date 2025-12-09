import React, { useState, useMemo, useCallback } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  PanResponder,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { Spacing, MazeColors } from "@/constants/theme";
import { LEVEL_1_DATA } from "@/data/Mazes";

const GRID_SIZE = 7;
const WALL_THICKNESS = 4;
const MIN_SWIPE_DISTANCE = 40;

type Direction = "up" | "down" | "left" | "right";

export default function GameScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();

  const [playerPosition, setPlayerPosition] = useState({
    y: LEVEL_1_DATA.start.y,
    x: LEVEL_1_DATA.start.x,
  });

  const screenWidth = Dimensions.get("window").width;
  const gridPadding = Spacing.xl * 2;
  const cellSize = Math.floor((screenWidth - gridPadding) / GRID_SIZE);
  const iconSize = Math.floor(cellSize * 0.55);

  const shakeX = useSharedValue(0);

  const animatedPlayerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: shakeX.value }],
    };
  });

  const triggerShake = useCallback(() => {
    shakeX.value = withSequence(
      withTiming(5, { duration: 50 }),
      withTiming(-5, { duration: 50 }),
      withTiming(5, { duration: 50 }),
      withTiming(0, { duration: 50 })
    );
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  }, [shakeX]);

  const canMove = useCallback(
    (direction: Direction): boolean => {
      const currentCell = LEVEL_1_DATA.grid[playerPosition.y][playerPosition.x];
      switch (direction) {
        case "up":
          return !currentCell.north && playerPosition.y > 0;
        case "down":
          return !currentCell.south && playerPosition.y < GRID_SIZE - 1;
        case "left":
          return !currentCell.west && playerPosition.x > 0;
        case "right":
          return !currentCell.east && playerPosition.x < GRID_SIZE - 1;
        default:
          return false;
      }
    },
    [playerPosition]
  );

  const movePlayer = useCallback(
    (direction: Direction) => {
      if (canMove(direction)) {
        setPlayerPosition((prev) => {
          switch (direction) {
            case "up":
              return { ...prev, y: prev.y - 1 };
            case "down":
              return { ...prev, y: prev.y + 1 };
            case "left":
              return { ...prev, x: prev.x - 1 };
            case "right":
              return { ...prev, x: prev.x + 1 };
            default:
              return prev;
          }
        });
        if (Platform.OS !== "web") {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
      } else {
        triggerShake();
      }
    },
    [canMove, triggerShake]
  );

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderRelease: (_, gestureState) => {
          const { dx, dy } = gestureState;

          if (
            Math.abs(dx) < MIN_SWIPE_DISTANCE &&
            Math.abs(dy) < MIN_SWIPE_DISTANCE
          ) {
            return;
          }

          let direction: Direction;
          if (Math.abs(dx) > Math.abs(dy)) {
            direction = dx > 0 ? "right" : "left";
          } else {
            direction = dy > 0 ? "down" : "up";
          }

          movePlayer(direction);
        },
      }),
    [movePlayer]
  );

  const renderCell = (rowIndex: number, colIndex: number) => {
    const cell = LEVEL_1_DATA.grid[rowIndex][colIndex];
    const isPlayer =
      playerPosition.y === rowIndex && playerPosition.x === colIndex;
    const isEnd =
      LEVEL_1_DATA.end.y === rowIndex && LEVEL_1_DATA.end.x === colIndex;

    return (
      <View
        key={`${rowIndex}-${colIndex}`}
        style={[
          styles.cell,
          {
            width: cellSize,
            height: cellSize,
            backgroundColor: isEnd ? "#90EE90" : MazeColors.gridPath,
            borderTopWidth: cell.north ? WALL_THICKNESS : 0,
            borderBottomWidth: cell.south ? WALL_THICKNESS : 0,
            borderLeftWidth: cell.west ? WALL_THICKNESS : 0,
            borderRightWidth: cell.east ? WALL_THICKNESS : 0,
            borderColor: MazeColors.walls,
          },
        ]}
      >
        {isPlayer ? (
          <Animated.View style={[styles.playerContainer, animatedPlayerStyle]}>
            <View style={styles.carContainer}>
              <Feather name="truck" size={iconSize} color={MazeColors.player} />
            </View>
          </Animated.View>
        ) : null}
        {isEnd && !isPlayer ? (
          <View style={styles.goalContainer}>
            <Feather name="flag" size={iconSize * 0.7} color={MazeColors.success} />
          </View>
        ) : null}
      </View>
    );
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: headerHeight + Spacing.xl,
          paddingBottom: insets.bottom + Spacing.xl,
        },
      ]}
    >
      <View style={styles.content}>
        <View style={styles.gridWrapper}>
          <View {...panResponder.panHandlers} style={styles.gridContainer}>
            {LEVEL_1_DATA.grid.map((row, rowIndex) => (
              <View key={rowIndex} style={styles.row}>
                {row.map((_, colIndex) => renderCell(rowIndex, colIndex))}
              </View>
            ))}
          </View>
        </View>

        <ThemedText style={styles.instructionText}>Swipe to drive!</ThemedText>
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
    paddingHorizontal: Spacing.xl,
  },
  gridWrapper: {
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 4,
    borderColor: MazeColors.walls,
  },
  gridContainer: {
    flexDirection: "column",
  },
  row: {
    flexDirection: "row",
  },
  cell: {
    justifyContent: "center",
    alignItems: "center",
  },
  playerContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  carContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  goalContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  instructionText: {
    marginTop: Spacing.xl,
    fontSize: 18,
    fontWeight: "600",
    color: MazeColors.textPrimary,
  },
});
