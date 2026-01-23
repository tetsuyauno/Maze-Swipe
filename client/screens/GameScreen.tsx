import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Platform,
  Modal,
  Pressable,
  ImageBackground,
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
import { Spacing, MazeColors, MAZE_THEMES, MazeTheme } from "@/constants/theme";
import { CellWalls, getRandomMaze, MazeData, CarIconName, MAZE_SIZES } from "@/data/Mazes";
import type { RootStackParamList } from "@/navigation/RootStackNavigator";

const WALL_THICKNESS = 5;
const MOVE_DURATION = 150;

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

  const { level, carIcon, theme: themeName } = route.params;
  const sizeConfig = MAZE_SIZES[level];
  const theme = MAZE_THEMES[themeName] || MAZE_THEMES.classic;

  const [currentMaze, setCurrentMaze] = useState<MazeData>(() => getRandomMaze(level));
  const [playerPosition, setPlayerPosition] = useState<Position>({
    y: currentMaze.start.y,
    x: currentMaze.start.x,
  });
  const [moveCount, setMoveCount] = useState(0);
  const [showWinModal, setShowWinModal] = useState(false);
  const [hasWon, setHasWon] = useState(false);
  const [drawnPath, setDrawnPath] = useState<Position[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  const currentMazeRef = useRef(currentMaze);
  currentMazeRef.current = currentMaze;

  const playerPositionRef = useRef(playerPosition);
  playerPositionRef.current = playerPosition;
  
  const drawnPathRef = useRef<Position[]>([]);
  const isDrawingRef = useRef(false);

  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;
  
  const availableHeight = screenHeight - insets.top - insets.bottom - 20;
  const availableWidth = screenWidth - insets.left - insets.right - 20;
  
  const cellSizeByHeight = Math.floor(availableHeight / currentMaze.rows);
  const cellSizeByWidth = Math.floor(availableWidth / currentMaze.cols);
  const cellSize = Math.min(cellSizeByHeight, cellSizeByWidth, 70);
  const iconSize = Math.floor(cellSize * 0.55);

  const playerX = useSharedValue(currentMaze.start.x * cellSize);
  const playerY = useSharedValue(currentMaze.start.y * cellSize);
  const playerScale = useSharedValue(1);
  const goalPulse = useSharedValue(1);

  const cellSizeRef = useRef(cellSize);
  cellSizeRef.current = cellSize;

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
      { translateX: playerX.value },
      { translateY: playerY.value },
      { scale: playerScale.value },
    ],
  }));

  const animatedGoalStyle = useAnimatedStyle(() => ({
    transform: [{ scale: goalPulse.value }],
  }));

  const animateAlongPath = useCallback((path: Position[], onComplete: () => void) => {
    if (path.length <= 1) {
      onComplete();
      return;
    }

    setIsAnimating(true);
    const size = cellSizeRef.current;
    
    let currentIndex = 0;
    
    const moveToNext = () => {
      if (currentIndex >= path.length - 1) {
        setIsAnimating(false);
        onComplete();
        return;
      }
      
      currentIndex++;
      const nextPos = path[currentIndex];
      
      playerScale.value = withSequence(
        withTiming(1.15, { duration: MOVE_DURATION / 3 }),
        withTiming(1, { duration: MOVE_DURATION / 3 })
      );
      
      playerX.value = withTiming(nextPos.x * size, { 
        duration: MOVE_DURATION,
        easing: Easing.out(Easing.quad)
      });
      playerY.value = withTiming(nextPos.y * size, { 
        duration: MOVE_DURATION,
        easing: Easing.out(Easing.quad)
      });
      
      if (Platform.OS !== "web") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      
      setTimeout(moveToNext, MOVE_DURATION);
    };
    
    moveToNext();
  }, [playerX, playerY, playerScale]);

  const gridLayoutRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const gridViewRef = useRef<View>(null);

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
    if (isAnimating) return;
    
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
  }, [getCellFromTouch, isAnimating]);

  const handlePanUpdate = useCallback((touchX: number, touchY: number) => {
    if (!isDrawingRef.current || isAnimating) return;
    
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
  }, [getCellFromTouch, isAnimating]);

  const handlePanEnd = useCallback(() => {
    if (!isDrawingRef.current || isAnimating) {
      setDrawnPath([]);
      return;
    }
    
    const path = [...drawnPathRef.current];
    
    isDrawingRef.current = false;
    drawnPathRef.current = [];
    
    if (path.length > 1) {
      setMoveCount((prev) => prev + (path.length - 1));
      
      animateAlongPath(path, () => {
        const finalPosition = path[path.length - 1];
        setPlayerPosition(finalPosition);
        setDrawnPath([]);
      });
    } else {
      setDrawnPath([]);
    }
  }, [animateAlongPath, isAnimating]);

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
    playerX.value = newMaze.start.x * cellSizeRef.current;
    playerY.value = newMaze.start.y * cellSizeRef.current;
    setMoveCount(0);
    setHasWon(false);
    setShowWinModal(false);
    setIsAnimating(false);
  }, [level, playerX, playerY]);

  const playDifferentLevel = useCallback((newLevel: number) => {
    navigation.replace("Game", { level: newLevel, carIcon, theme: themeName });
  }, [navigation, carIcon, themeName]);

  const goToMenu = useCallback(() => {
    setShowWinModal(false);
    navigation.navigate("Menu");
  }, [navigation]);

  const getStarRating = () => {
    const baseMoves = currentMaze.rows + currentMaze.cols;
    if (moveCount <= baseMoves) return 3;
    if (moveCount <= baseMoves + 4) return 2;
    return 1;
  };

  const hasCornerTopLeft = (rowIndex: number, colIndex: number) => {
    const cell = currentMaze.grid[rowIndex][colIndex];
    return cell.north || cell.west;
  };

  const hasCornerTopRight = (rowIndex: number, colIndex: number) => {
    const cell = currentMaze.grid[rowIndex][colIndex];
    return cell.north || cell.east;
  };

  const hasCornerBottomLeft = (rowIndex: number, colIndex: number) => {
    const cell = currentMaze.grid[rowIndex][colIndex];
    return cell.south || cell.west;
  };

  const hasCornerBottomRight = (rowIndex: number, colIndex: number) => {
    const cell = currentMaze.grid[rowIndex][colIndex];
    return cell.south || cell.east;
  };

  const renderCell = (rowIndex: number, colIndex: number) => {
    const cell = currentMaze.grid[rowIndex][colIndex];
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
              ? theme.pathHighlight 
              : isEnd 
                ? theme.goalColor 
                : theme.gridPath,
          },
        ]}
      >
        {cell.north ? (
          <View style={[styles.wallTop, { backgroundColor: theme.walls, height: WALL_THICKNESS }]} />
        ) : null}
        {cell.south ? (
          <View style={[styles.wallBottom, { backgroundColor: theme.walls, height: WALL_THICKNESS }]} />
        ) : null}
        {cell.west ? (
          <View style={[styles.wallLeft, { backgroundColor: theme.walls, width: WALL_THICKNESS }]} />
        ) : null}
        {cell.east ? (
          <View style={[styles.wallRight, { backgroundColor: theme.walls, width: WALL_THICKNESS }]} />
        ) : null}
        
        {hasCornerTopLeft(rowIndex, colIndex) ? (
          <View style={[styles.cornerTopLeft, { backgroundColor: theme.walls, width: WALL_THICKNESS, height: WALL_THICKNESS }]} />
        ) : null}
        {hasCornerTopRight(rowIndex, colIndex) ? (
          <View style={[styles.cornerTopRight, { backgroundColor: theme.walls, width: WALL_THICKNESS, height: WALL_THICKNESS }]} />
        ) : null}
        {hasCornerBottomLeft(rowIndex, colIndex) ? (
          <View style={[styles.cornerBottomLeft, { backgroundColor: theme.walls, width: WALL_THICKNESS, height: WALL_THICKNESS }]} />
        ) : null}
        {hasCornerBottomRight(rowIndex, colIndex) ? (
          <View style={[styles.cornerBottomRight, { backgroundColor: theme.walls, width: WALL_THICKNESS, height: WALL_THICKNESS }]} />
        ) : null}

        {isInPath ? (
          <View style={[styles.pathDot, { width: cellSize * 0.25, height: cellSize * 0.25, backgroundColor: theme.walls }]} />
        ) : null}
        {isEnd && !isInPath ? (
          <Animated.View style={[styles.goalContainer, animatedGoalStyle]}>
            <Feather name="flag" size={iconSize * 0.7} color={MazeColors.success} />
          </Animated.View>
        ) : null}
      </View>
    );
  };

  return (
    <ImageBackground
      source={theme.backgroundImage}
      style={[
        styles.container,
        {
          backgroundColor: theme.background,
        },
      ]}
      resizeMode="cover"
    >
      <View style={[
        styles.contentWrapper,
        {
          paddingTop: insets.top + Spacing.sm,
          paddingBottom: insets.bottom + Spacing.sm,
          paddingLeft: insets.left + Spacing.sm,
          paddingRight: insets.right + Spacing.sm,
        },
      ]}>
        <View style={styles.content}>
        <GestureDetector gesture={panGesture}>
          <View 
            ref={gridViewRef}
            style={[styles.gridWrapper, { borderColor: theme.walls }]}
            onLayout={updateGridPosition}
          >
            <View style={styles.gridContainer}>
              {currentMaze.grid.map((row, rowIndex) => (
                <View key={rowIndex} style={styles.row}>
                  {row.map((_, colIndex) => renderCell(rowIndex, colIndex))}
                </View>
              ))}
            </View>

            <View style={[styles.roundedCornerTL, { backgroundColor: theme.walls }]} />
            <View style={[styles.roundedCornerTR, { backgroundColor: theme.walls }]} />
            <View style={[styles.roundedCornerBL, { backgroundColor: theme.walls }]} />
            <View style={[styles.roundedCornerBR, { backgroundColor: theme.walls }]} />
            
            <Animated.View 
              style={[
                styles.floatingPlayer,
                {
                  width: cellSize,
                  height: cellSize,
                },
                animatedPlayerStyle
              ]}
            >
              <View style={styles.carContainer}>
                <Feather name={carIcon} size={iconSize} color={MazeColors.player} />
              </View>
            </Animated.View>
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
          <View style={styles.modalContent}>
            <View style={styles.modalLeft}>
              <ThemedText style={styles.winTitle}>Amazing!</ThemedText>
              
              <View style={styles.starsContainer}>
                {[1, 2, 3].map((star) => (
                  <Feather
                    key={star}
                    name="star"
                    size={28}
                    color={star <= getStarRating() ? "#FFD700" : "#E0E0E0"}
                    style={styles.star}
                  />
                ))}
              </View>

              <ThemedText style={styles.movesSummary}>
                {sizeConfig.label} in {moveCount} moves
              </ThemedText>

              <Pressable style={styles.primaryButton} onPress={playNewMazeSameLevel}>
                <Feather name="refresh-cw" size={16} color="#FFFFFF" />
                <ThemedText style={styles.primaryButtonText}>Play Again</ThemedText>
              </Pressable>
              
              <Pressable style={styles.menuButton} onPress={goToMenu}>
                <Feather name="home" size={14} color={MazeColors.textPrimary} />
                <ThemedText style={styles.menuButtonText}>Menu</ThemedText>
              </Pressable>
            </View>

            <View style={styles.modalRight}>
              <ThemedText style={styles.sectionLabel}>Try Another Size</ThemedText>
              <View style={styles.levelButtonsRow}>
                {[1, 2, 3, 4, 5].filter(l => l !== level).map((lvl) => (
                  <Pressable
                    key={lvl}
                    style={styles.levelButton}
                    onPress={() => playDifferentLevel(lvl)}
                  >
                    <Feather name={MAZE_SIZES[lvl].icon} size={18} color={MazeColors.player} />
                    <ThemedText style={styles.levelButtonLabel}>{MAZE_SIZES[lvl].label}</ThemedText>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>
        </View>
      </Modal>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MazeColors.background,
  },
  contentWrapper: {
    flex: 1,
  },
  content: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  gridWrapper: {
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: WALL_THICKNESS,
    position: "relative",
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
    position: "relative",
  },
  wallTop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  wallBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  wallLeft: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
  },
  wallRight: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
  },
  cornerTopLeft: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  cornerTopRight: {
    position: "absolute",
    top: 0,
    right: 0,
  },
  cornerBottomLeft: {
    position: "absolute",
    bottom: 0,
    left: 0,
  },
  cornerBottomRight: {
    position: "absolute",
    bottom: 0,
    right: 0,
  },
  roundedCornerTL: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 12,
    height: 12,
    borderBottomRightRadius: 12,
  },
  roundedCornerTR: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 12,
    height: 12,
    borderBottomLeftRadius: 12,
  },
  roundedCornerBL: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: 12,
    height: 12,
    borderTopRightRadius: 12,
  },
  roundedCornerBR: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderTopLeftRadius: 12,
  },
  floatingPlayer: {
    position: "absolute",
    top: 0,
    left: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
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
    borderRadius: 100,
    opacity: 0.7,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: Spacing.md,
    flexDirection: "row",
    alignItems: "center",
    maxHeight: "90%",
  },
  modalLeft: {
    alignItems: "center",
    paddingRight: Spacing.md,
    borderRightWidth: 1,
    borderRightColor: "#E0E0E0",
    minWidth: 140,
  },
  modalRight: {
    alignItems: "center",
    paddingLeft: Spacing.md,
  },
  winTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: MazeColors.success,
    marginBottom: Spacing.xs,
  },
  starsContainer: {
    flexDirection: "row",
    marginBottom: Spacing.xs,
  },
  star: {
    marginHorizontal: 2,
  },
  movesSummary: {
    fontSize: 12,
    color: MazeColors.textSecondary,
    marginBottom: Spacing.sm,
    textAlign: "center",
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: MazeColors.player,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    justifyContent: "center",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
    marginLeft: Spacing.xs,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: MazeColors.textSecondary,
    marginBottom: Spacing.sm,
  },
  levelButtonsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: Spacing.xs,
    maxWidth: 200,
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
