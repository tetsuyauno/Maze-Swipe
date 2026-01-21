import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Platform,
  Modal,
  Pressable,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
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
import { useRoute, useNavigation } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { ThemedText } from "@/components/ThemedText";
import { Spacing, MazeColors } from "@/constants/theme";
import { CellWalls, getRandomMaze, MazeData, CarIconName, MAZE_SIZES } from "@/data/Mazes";
import type { RootStackParamList } from "@/navigation/RootStackNavigator";

const WALL_THICKNESS = 4;

type Position = { y: number; x: number };
type GameRouteProp = RouteProp<RootStackParamList, "Game">;
type GameNavProp = NativeStackNavigationProp<RootStackParamList, "Game">;

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
  const route = useRoute<GameRouteProp>();
  const navigation = useNavigation<GameNavProp>();
  const insets = useSafeAreaInsets();

  const { level, carIcon } = route.params;
  const sizeConfig = MAZE_SIZES[level];

  const [currentMaze, setCurrentMaze] = useState<MazeData>(() => getRandomMaze(level));
  const [playerPosition, setPlayerPosition] = useState<Position>({
    y: currentMaze.start.y,
    x: currentMaze.start.x,
  });
  const [moveCount, setMoveCount] = useState(0);
  const [showWinModal, setShowWinModal] = useState(false);
  const [hasWon, setHasWon] = useState(false);
  const [drawnPath, setDrawnPath] = useState<Position[]>([]);

  const currentMazeRef = useRef(currentMaze);
  currentMazeRef.current = currentMaze;

  const playerPositionRef = useRef(playerPosition);
  playerPositionRef.current = playerPosition;
  
  const drawnPathRef = useRef<Position[]>([]);
  const isDrawingRef = useRef(false);

  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;
  
  const availableHeight = screenHeight - insets.top - insets.bottom - 120;
  const availableWidth = screenWidth - insets.left - insets.right - 200;
  
  const cellSizeByHeight = Math.floor(availableHeight / currentMaze.rows);
  const cellSizeByWidth = Math.floor(availableWidth / currentMaze.cols);
  const cellSize = Math.min(cellSizeByHeight, cellSizeByWidth, 70);
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
      playerPosition.y === currentMaze.end.y &&
      playerPosition.x === currentMaze.end.x &&
      !hasWon
    ) {
      setHasWon(true);
      setShowWinModal(true);
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    }
  }, [playerPosition, hasWon, currentMaze.end]);

  const animatedPlayerStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: shakeX.value },
      { scale: playerScale.value },
    ],
  }));

  const animatedGoalStyle = useAnimatedStyle(() => ({
    transform: [{ scale: goalPulse.value }],
  }));

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
  const gridViewRef = useRef<View>(null);
  const cellSizeRef = useRef(cellSize);
  cellSizeRef.current = cellSize;

  const mazeRowsRef = useRef(currentMaze.rows);
  const mazeColsRef = useRef(currentMaze.cols);
  mazeRowsRef.current = currentMaze.rows;
  mazeColsRef.current = currentMaze.cols;

  const updateGridPosition = useCallback(() => {
    if (gridViewRef.current && typeof (gridViewRef.current as any).measureInWindow === 'function') {
      (gridViewRef.current as any).measureInWindow((x: number, y: number) => {
        gridLayoutRef.current = { x, y };
      });
    }
  }, []);

  const getCellFromTouch = useCallback((touchX: number, touchY: number): Position | null => {
    const gridX = gridLayoutRef.current.x;
    const gridY = gridLayoutRef.current.y;
    const size = cellSizeRef.current;
    
    const relativeX = touchX - gridX;
    const relativeY = touchY - gridY;
    
    const col = Math.floor(relativeX / size);
    const row = Math.floor(relativeY / size);
    
    if (col < 0 || col >= mazeColsRef.current || row < 0 || row >= mazeRowsRef.current) {
      return null;
    }
    
    return { y: row, x: col };
  }, []);

  const handlePanStart = useCallback((touchX: number, touchY: number) => {
    const cell = getCellFromTouch(touchX, touchY);
    const currentPos = playerPositionRef.current;
    
    if (cell && cell.x === currentPos.x && cell.y === currentPos.y) {
      isDrawingRef.current = true;
      drawnPathRef.current = [currentPos];
      setDrawnPath([currentPos]);
    } else {
      isDrawingRef.current = false;
      drawnPathRef.current = [];
      setDrawnPath([]);
    }
  }, [getCellFromTouch]);

  const handlePanUpdate = useCallback((touchX: number, touchY: number) => {
    if (!isDrawingRef.current) return;
    
    const cell = getCellFromTouch(touchX, touchY);
    if (!cell) return;
    
    const currentPath = drawnPathRef.current;
    if (currentPath.length === 0) return;
    
    const lastCell = currentPath[currentPath.length - 1];
    
    if (cell.x === lastCell.x && cell.y === lastCell.y) {
      return;
    }
    
    const existingIndex = currentPath.findIndex(p => p.x === cell.x && p.y === cell.y);
    if (existingIndex !== -1) {
      const newPath = currentPath.slice(0, existingIndex + 1);
      drawnPathRef.current = newPath;
      setDrawnPath([...newPath]);
      return;
    }
    
    const isAdjacent = 
      (Math.abs(cell.x - lastCell.x) === 1 && cell.y === lastCell.y) ||
      (Math.abs(cell.y - lastCell.y) === 1 && cell.x === lastCell.x);
    
    if (!isAdjacent) return;
    
    if (canMoveBetween(lastCell, cell, currentMazeRef.current.grid)) {
      const newPath = [...currentPath, cell];
      drawnPathRef.current = newPath;
      setDrawnPath([...newPath]);
      
      if (Platform.OS !== "web") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    }
  }, [getCellFromTouch]);

  const handlePanEnd = useCallback(() => {
    if (!isDrawingRef.current) {
      setDrawnPath([]);
      return;
    }
    
    const path = drawnPathRef.current;
    
    if (path.length > 1) {
      const finalPosition = path[path.length - 1];
      setPlayerPosition(finalPosition);
      setMoveCount((prev) => prev + (path.length - 1));
      triggerMoveAnimation();
    }
    
    isDrawingRef.current = false;
    drawnPathRef.current = [];
    setDrawnPath([]);
  }, [triggerMoveAnimation]);

  const panGesture = Gesture.Pan()
    .minDistance(0)
    .onStart((event) => {
      runOnJS(handlePanStart)(event.absoluteX, event.absoluteY);
    })
    .onUpdate((event) => {
      runOnJS(handlePanUpdate)(event.absoluteX, event.absoluteY);
    })
    .onEnd(() => {
      runOnJS(handlePanEnd)();
    });

  const playNewMazeSameLevel = useCallback(() => {
    const newMaze = getRandomMaze(level);
    setCurrentMaze(newMaze);
    setPlayerPosition({ y: newMaze.start.y, x: newMaze.start.x });
    setMoveCount(0);
    setHasWon(false);
    setShowWinModal(false);
  }, [level]);

  const playDifferentLevel = useCallback((newLevel: number) => {
    navigation.replace("Game", { level: newLevel, carIcon });
  }, [navigation, carIcon]);

  const goToMenu = useCallback(() => {
    navigation.navigate("Menu");
  }, [navigation]);

  const getStarRating = () => {
    const baseMoves = currentMaze.rows + currentMaze.cols;
    if (moveCount <= baseMoves) return 3;
    if (moveCount <= baseMoves + 4) return 2;
    return 1;
  };

  const renderCell = (rowIndex: number, colIndex: number) => {
    const cell = currentMaze.grid[rowIndex][colIndex];
    const isPlayer =
      playerPosition.y === rowIndex && playerPosition.x === colIndex;
    const isEnd =
      currentMaze.end.y === rowIndex && currentMaze.end.x === colIndex;
    const isInPath = drawnPath.some(p => p.y === rowIndex && p.x === colIndex);

    return (
      <View
        key={`${rowIndex}-${colIndex}`}
        style={[
          styles.cell,
          {
            width: cellSize,
            height: cellSize,
            backgroundColor: isInPath 
              ? "rgba(255, 165, 0, 0.4)" 
              : isEnd 
                ? "#90EE90" 
                : MazeColors.gridPath,
            borderTopWidth: cell.north ? WALL_THICKNESS : 0,
            borderBottomWidth: cell.south ? WALL_THICKNESS : 0,
            borderLeftWidth: cell.west ? WALL_THICKNESS : 0,
            borderRightWidth: cell.east ? WALL_THICKNESS : 0,
            borderColor: MazeColors.walls,
          },
        ]}
      >
        {isInPath && !isPlayer ? (
          <View style={[styles.pathDot, { width: cellSize * 0.3, height: cellSize * 0.3 }]} />
        ) : null}
        {isPlayer ? (
          <Animated.View style={[styles.playerContainer, animatedPlayerStyle]}>
            <View style={styles.carContainer}>
              <Feather name={carIcon} size={iconSize} color={MazeColors.player} />
            </View>
          </Animated.View>
        ) : null}
        {isEnd && !isPlayer && !isInPath ? (
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
          paddingTop: insets.top + Spacing.sm,
          paddingBottom: insets.bottom + Spacing.sm,
          paddingLeft: insets.left + Spacing.sm,
          paddingRight: insets.right + Spacing.sm,
        },
      ]}
    >
      <View style={styles.content}>
        <View style={styles.sidebar}>
          <View style={styles.statsContainer}>
            <View style={styles.statBadge}>
              <Feather name={sizeConfig.icon} size={16} color={MazeColors.success} />
              <ThemedText style={styles.statText}>{sizeConfig.label}</ThemedText>
            </View>
            <View style={styles.statBadge}>
              <Feather name="navigation" size={16} color={MazeColors.player} />
              <ThemedText style={styles.statText}>{moveCount} moves</ThemedText>
            </View>
          </View>
          
          <ThemedText style={styles.instructionText}>Draw to drive!</ThemedText>
          <ThemedText style={styles.tipText}>
            Draw a path from the {carIcon === "truck" ? "truck" : "icon"} to move
          </ThemedText>
        </View>

        <GestureDetector gesture={panGesture}>
          <View 
            ref={gridViewRef}
            style={styles.gridWrapper}
            onLayout={updateGridPosition}
          >
            <View style={styles.gridContainer}>
              {currentMaze.grid.map((row, rowIndex) => (
                <View key={rowIndex} style={styles.row}>
                  {row.map((_, colIndex) => renderCell(rowIndex, colIndex))}
                </View>
              ))}
            </View>
          </View>
        </GestureDetector>
      </View>

      <Modal
        visible={showWinModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowWinModal(false)}
      >
        <View style={styles.modalOverlay}>
          <Confetti />
          <ScrollView 
            contentContainerStyle={styles.modalScrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.modalContent}>
              <ThemedText style={styles.winTitle}>Amazing!</ThemedText>
              <ThemedText style={styles.winSubtitle}>You reached the goal!</ThemedText>
              
              <View style={styles.starsContainer}>
                {[1, 2, 3].map((star) => (
                  <Feather
                    key={star}
                    name="star"
                    size={36}
                    color={star <= getStarRating() ? "#FFD700" : "#E0E0E0"}
                    style={styles.star}
                  />
                ))}
              </View>

              <ThemedText style={styles.movesSummary}>
                Completed {sizeConfig.label} maze in {moveCount} moves
              </ThemedText>

              <Pressable style={styles.primaryButton} onPress={playNewMazeSameLevel}>
                <Feather name="refresh-cw" size={18} color="#FFFFFF" />
                <ThemedText style={styles.primaryButtonText}>New {sizeConfig.label} Maze</ThemedText>
              </Pressable>

              <ThemedText style={styles.sectionLabel}>Try Another Size</ThemedText>
              <View style={styles.levelButtonsRow}>
                {[1, 2, 3, 4, 5].filter(l => l !== level).map((lvl) => (
                  <Pressable
                    key={lvl}
                    style={styles.levelButton}
                    onPress={() => playDifferentLevel(lvl)}
                  >
                    <Feather name={MAZE_SIZES[lvl].icon} size={16} color={MazeColors.player} />
                    <ThemedText style={styles.levelButtonLabel}>{MAZE_SIZES[lvl].label}</ThemedText>
                  </Pressable>
                ))}
              </View>

              <Pressable style={styles.menuButton} onPress={goToMenu}>
                <Feather name="home" size={16} color={MazeColors.textPrimary} />
                <ThemedText style={styles.menuButtonText}>Back to Menu</ThemedText>
              </Pressable>
            </View>
          </ScrollView>
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
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  sidebar: {
    marginRight: Spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    maxWidth: 150,
  },
  statsContainer: {
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  statBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
  },
  statText: {
    marginLeft: Spacing.xs,
    fontSize: 14,
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
  pathDot: {
    backgroundColor: "rgba(255, 140, 0, 0.8)",
    borderRadius: 100,
  },
  instructionText: {
    fontSize: 16,
    fontWeight: "600",
    color: MazeColors.textPrimary,
    textAlign: "center",
  },
  tipText: {
    marginTop: Spacing.xs,
    fontSize: 12,
    color: MazeColors.textSecondary,
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalScrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: Spacing.lg,
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: Spacing.lg,
    alignItems: "center",
    marginHorizontal: Spacing.lg,
    maxWidth: 380,
    width: "90%",
  },
  winTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: MazeColors.success,
    marginBottom: Spacing.xs,
  },
  winSubtitle: {
    fontSize: 16,
    color: MazeColors.textPrimary,
    marginBottom: Spacing.md,
  },
  starsContainer: {
    flexDirection: "row",
    marginBottom: Spacing.md,
  },
  star: {
    marginHorizontal: 4,
  },
  movesSummary: {
    fontSize: 13,
    color: MazeColors.textSecondary,
    marginBottom: Spacing.md,
    textAlign: "center",
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: MazeColors.player,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: 30,
    width: "100%",
    justifyContent: "center",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
    marginLeft: Spacing.sm,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: MazeColors.textSecondary,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  levelButtonsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: Spacing.xs,
  },
  levelButton: {
    backgroundColor: "#F0F0F0",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 12,
    alignItems: "center",
    minWidth: 70,
  },
  levelButtonLabel: {
    fontSize: 11,
    color: MazeColors.textSecondary,
    marginTop: 2,
  },
  menuButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  menuButtonText: {
    color: MazeColors.textPrimary,
    fontSize: 13,
    marginLeft: Spacing.xs,
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
