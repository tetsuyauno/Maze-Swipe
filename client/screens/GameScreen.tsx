import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Platform,
  Modal,
  Pressable,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { Feather } from "@expo/vector-icons";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withSpring,
  withRepeat,
  Easing,
  runOnJS,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { Spacing, MazeColors } from "@/constants/theme";
import { LEVEL_1_DATA, CellWalls } from "@/data/Mazes";

const GRID_SIZE = 7;
const WALL_THICKNESS = 4;

type Position = { y: number; x: number };

function canMoveBetween(from: Position, to: Position, grid: CellWalls[][]): boolean {
  const fromCell = grid[from.y][from.x];
  
  if (to.y === from.y - 1 && to.x === from.x) {
    return !fromCell.north;
  }
  if (to.y === from.y + 1 && to.x === from.x) {
    return !fromCell.south;
  }
  if (to.x === from.x - 1 && to.y === from.y) {
    return !fromCell.west;
  }
  if (to.x === from.x + 1 && to.y === from.y) {
    return !fromCell.east;
  }
  return false;
}

function findPathToTarget(
  start: Position,
  target: Position,
  grid: CellWalls[][]
): Position[] | null {
  if (target.x < 0 || target.x >= GRID_SIZE || target.y < 0 || target.y >= GRID_SIZE) {
    return null;
  }
  
  if (start.x === target.x && start.y === target.y) {
    return [];
  }

  const queue: { pos: Position; path: Position[] }[] = [{ pos: start, path: [] }];
  const visited = new Set<string>();
  visited.add(`${start.y},${start.x}`);

  const directions = [
    { dy: -1, dx: 0 },
    { dy: 1, dx: 0 },
    { dy: 0, dx: -1 },
    { dy: 0, dx: 1 },
  ];

  while (queue.length > 0) {
    const { pos, path } = queue.shift()!;

    for (const dir of directions) {
      const nextPos = { y: pos.y + dir.dy, x: pos.x + dir.dx };
      const key = `${nextPos.y},${nextPos.x}`;

      if (
        nextPos.x >= 0 &&
        nextPos.x < GRID_SIZE &&
        nextPos.y >= 0 &&
        nextPos.y < GRID_SIZE &&
        !visited.has(key) &&
        canMoveBetween(pos, nextPos, grid)
      ) {
        const newPath = [...path, nextPos];

        if (nextPos.x === target.x && nextPos.y === target.y) {
          return newPath;
        }

        visited.add(key);
        queue.push({ pos: nextPos, path: newPath });
      }
    }
  }

  return null;
}

function ConfettiPiece({ delay, color }: { delay: number; color: string }) {
  const translateY = useSharedValue(-50);
  const translateX = useSharedValue((Math.random() - 0.5) * 300);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    const timeout = setTimeout(() => {
      translateY.value = withTiming(400, { duration: 2000, easing: Easing.out(Easing.quad) });
      rotate.value = withRepeat(withTiming(360, { duration: 500 }), 4, false);
      opacity.value = withTiming(0, { duration: 2000 });
    }, delay);
    return () => clearTimeout(timeout);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
      { rotate: `${rotate.value}deg` },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.confettiPiece,
        { backgroundColor: color },
        animatedStyle,
      ]}
    />
  );
}

function Confetti() {
  const colors = ["#FF6B35", "#FFD700", "#FF69B4", "#00CED1", "#9B59B6", "#2ECC71"];
  const pieces = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    delay: Math.random() * 500,
    color: colors[i % colors.length],
  }));

  return (
    <View style={styles.confettiContainer}>
      {pieces.map((piece) => (
        <ConfettiPiece key={piece.id} delay={piece.delay} color={piece.color} />
      ))}
    </View>
  );
}

export default function GameScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();

  const [playerPosition, setPlayerPosition] = useState<Position>({
    y: LEVEL_1_DATA.start.y,
    x: LEVEL_1_DATA.start.x,
  });
  const [moveCount, setMoveCount] = useState(0);
  const [showWinModal, setShowWinModal] = useState(false);
  const [hasWon, setHasWon] = useState(false);

  const playerPositionRef = useRef(playerPosition);
  playerPositionRef.current = playerPosition;

  const screenWidth = Dimensions.get("window").width;
  const gridPadding = Spacing.md * 2;
  const cellSize = Math.floor((screenWidth - gridPadding) / GRID_SIZE);
  const iconSize = Math.floor(cellSize * 0.55);

  const shakeX = useSharedValue(0);
  const playerScale = useSharedValue(1);
  const goalPulse = useSharedValue(1);

  useEffect(() => {
    goalPulse.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 600 }),
        withTiming(1, { duration: 600 })
      ),
      -1,
      true
    );
  }, []);

  useEffect(() => {
    if (
      playerPosition.y === LEVEL_1_DATA.end.y &&
      playerPosition.x === LEVEL_1_DATA.end.x &&
      !hasWon
    ) {
      setHasWon(true);
      setShowWinModal(true);
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    }
  }, [playerPosition, hasWon]);

  const animatedPlayerStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: shakeX.value },
      { scale: playerScale.value },
    ],
  }));

  const animatedGoalStyle = useAnimatedStyle(() => ({
    transform: [{ scale: goalPulse.value }],
  }));

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

  const triggerMoveAnimation = useCallback(() => {
    playerScale.value = withSequence(
      withSpring(1.3, { damping: 5 }),
      withSpring(1, { damping: 8 })
    );
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  }, [playerScale]);

  const gridLayoutRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleTapAtPosition = useCallback((touchX: number, touchY: number) => {
    const gridX = gridLayoutRef.current.x;
    const gridY = gridLayoutRef.current.y;
    
    const relativeX = touchX - gridX;
    const relativeY = touchY - gridY;
    
    const targetCol = Math.floor(relativeX / cellSize);
    const targetRow = Math.floor(relativeY / cellSize);
    
    if (targetCol < 0 || targetCol >= GRID_SIZE || targetRow < 0 || targetRow >= GRID_SIZE) {
      triggerShake();
      return;
    }
    
    const target: Position = { y: targetRow, x: targetCol };
    const currentPos = playerPositionRef.current;
    
    if (target.x === currentPos.x && target.y === currentPos.y) {
      return;
    }
    
    const path = findPathToTarget(currentPos, target, LEVEL_1_DATA.grid);
    
    if (path && path.length > 0) {
      setPlayerPosition(target);
      setMoveCount((prev) => prev + path.length);
      triggerMoveAnimation();
    } else {
      triggerShake();
    }
  }, [cellSize, triggerMoveAnimation, triggerShake]);

  const tapGesture = Gesture.Tap()
    .onEnd((event) => {
      runOnJS(handleTapAtPosition)(event.absoluteX, event.absoluteY);
    });

  const resetGame = useCallback(() => {
    setPlayerPosition({
      y: LEVEL_1_DATA.start.y,
      x: LEVEL_1_DATA.start.x,
    });
    setMoveCount(0);
    setHasWon(false);
    setShowWinModal(false);
  }, []);

  const getStarRating = () => {
    if (moveCount <= 8) return 3;
    if (moveCount <= 12) return 2;
    return 1;
  };

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
          <Animated.View style={[styles.goalContainer, animatedGoalStyle]}>
            <Feather name="flag" size={iconSize * 0.7} color={MazeColors.success} />
          </Animated.View>
        ) : null}
      </View>
    );
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: headerHeight + Spacing.sm,
          paddingBottom: insets.bottom + Spacing.sm,
        },
      ]}
    >
      <View style={styles.content}>
        <View style={styles.statsContainer}>
          <View style={styles.statBadge}>
            <Feather name="navigation" size={16} color={MazeColors.player} />
            <ThemedText style={styles.statText}>{moveCount} moves</ThemedText>
          </View>
        </View>

        <GestureDetector gesture={tapGesture}>
          <View 
            style={styles.gridWrapper}
            onLayout={(event) => {
              event.target.measure((x, y, width, height, pageX, pageY) => {
                gridLayoutRef.current = { x: pageX, y: pageY };
              });
            }}
          >
            <View style={styles.gridContainer}>
              {LEVEL_1_DATA.grid.map((row, rowIndex) => (
                <View key={rowIndex} style={styles.row}>
                  {row.map((_, colIndex) => renderCell(rowIndex, colIndex))}
                </View>
              ))}
            </View>
          </View>
        </GestureDetector>

        <ThemedText style={styles.instructionText}>Tap to drive!</ThemedText>
        <ThemedText style={styles.tipText}>
          Tap any cell to move there
        </ThemedText>
      </View>

      <Modal
        visible={showWinModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowWinModal(false)}
      >
        <View style={styles.modalOverlay}>
          <Confetti />
          <View style={styles.modalContent}>
            <ThemedText style={styles.winTitle}>Amazing!</ThemedText>
            <ThemedText style={styles.winSubtitle}>You reached the goal!</ThemedText>
            
            <View style={styles.starsContainer}>
              {[1, 2, 3].map((star) => (
                <Feather
                  key={star}
                  name="star"
                  size={40}
                  color={star <= getStarRating() ? "#FFD700" : "#E0E0E0"}
                  style={styles.star}
                />
              ))}
            </View>

            <ThemedText style={styles.movesSummary}>
              Completed in {moveCount} moves
            </ThemedText>

            <Pressable style={styles.playAgainButton} onPress={resetGame}>
              <Feather name="refresh-cw" size={20} color="#FFFFFF" />
              <ThemedText style={styles.playAgainText}>Play Again</ThemedText>
            </Pressable>
          </View>
        </View>
      </Modal>
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
    paddingHorizontal: Spacing.sm,
  },
  statsContainer: {
    flexDirection: "row",
    marginBottom: Spacing.md,
  },
  statBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
  },
  statText: {
    marginLeft: Spacing.xs,
    fontSize: 16,
    fontWeight: "600",
    color: MazeColors.textPrimary,
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
    marginTop: Spacing.md,
    fontSize: 18,
    fontWeight: "600",
    color: MazeColors.textPrimary,
  },
  tipText: {
    marginTop: Spacing.xs,
    fontSize: 14,
    color: MazeColors.textSecondary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: Spacing["2xl"],
    alignItems: "center",
    marginHorizontal: Spacing.xl,
    minWidth: 280,
  },
  winTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: MazeColors.success,
    marginBottom: Spacing.sm,
  },
  winSubtitle: {
    fontSize: 18,
    color: MazeColors.textPrimary,
    marginBottom: Spacing.lg,
  },
  starsContainer: {
    flexDirection: "row",
    marginBottom: Spacing.lg,
  },
  star: {
    marginHorizontal: 4,
  },
  movesSummary: {
    fontSize: 16,
    color: MazeColors.textSecondary,
    marginBottom: Spacing.xl,
  },
  playAgainButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: MazeColors.player,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: 30,
  },
  playAgainText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: Spacing.sm,
  },
  confettiContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: "hidden",
    pointerEvents: "none",
  },
  confettiPiece: {
    position: "absolute",
    width: 10,
    height: 10,
    borderRadius: 2,
    top: "30%",
    left: "50%",
  },
});
