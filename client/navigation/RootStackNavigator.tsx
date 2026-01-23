import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HeaderButton } from "@react-navigation/elements";
import { Feather } from "@expo/vector-icons";
import MenuScreen from "@/screens/MenuScreen";
import RideSelectScreen from "@/screens/RideSelectScreen";
import GameScreen from "@/screens/GameScreen";
import SettingsScreen from "@/screens/SettingsScreen";
import { HeaderTitle } from "@/components/HeaderTitle";
import { useScreenOptions } from "@/hooks/useScreenOptions";
import { MazeColors } from "@/constants/theme";
import type { CarIconName } from "@/data/Mazes";

export type RootStackParamList = {
  Menu: undefined;
  RideSelect: {
    level: number;
  };
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
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="RideSelect"
        component={RideSelectScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Game"
        component={GameScreen}
        options={({ navigation }) => ({
          headerShown: false,
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
