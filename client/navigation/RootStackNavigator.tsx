import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HeaderButton } from "@react-navigation/elements";
import { Feather } from "@expo/vector-icons";
import MenuScreen from "@/screens/MenuScreen";
import GameScreen from "@/screens/GameScreen";
import SettingsScreen from "@/screens/SettingsScreen";
import { HeaderTitle } from "@/components/HeaderTitle";
import { useScreenOptions } from "@/hooks/useScreenOptions";
import { MazeColors } from "@/constants/theme";
import type { CarIconName } from "@/data/Mazes";

export type RootStackParamList = {
  Menu: undefined;
  Game: {
    level: number;
    carIcon: CarIconName;
  };
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStackNavigator() {
  const screenOptions = useScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="Menu"
        component={MenuScreen}
        options={{
          headerTitle: () => <HeaderTitle title="Maze Adventure" />,
        }}
      />
      <Stack.Screen
        name="Game"
        component={GameScreen}
        options={({ navigation }) => ({
          headerTitle: () => <HeaderTitle title="Maze Adventure" />,
          headerRight: () => (
            <HeaderButton onPress={() => navigation.navigate("Settings")}>
              <Feather name="settings" size={24} color={MazeColors.textPrimary} />
            </HeaderButton>
          ),
        })}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          presentation: "modal",
          headerTitle: "Settings",
        }}
      />
    </Stack.Navigator>
  );
}
