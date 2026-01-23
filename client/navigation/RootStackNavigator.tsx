import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SplashScreen from "@/screens/SplashScreen";
import MenuScreen from "@/screens/MenuScreen";
import RideSelectScreen from "@/screens/RideSelectScreen";
import WorldSelectScreen from "@/screens/WorldSelectScreen";
import GameScreen from "@/screens/GameScreen";
import SettingsScreen from "@/screens/SettingsScreen";
import { useScreenOptions } from "@/hooks/useScreenOptions";
import type { CarIconName } from "@/data/Mazes";

export type RootStackParamList = {
  Splash: undefined;
  Menu: undefined;
  RideSelect: {
    level: number;
  };
  WorldSelect: {
    level: number;
    carIcon: CarIconName;
  };
  Game: {
    level: number;
    carIcon: CarIconName;
    theme: string;
  };
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStackNavigator() {
  const screenOptions = useScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions} initialRouteName="Splash">
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
        options={{
          headerShown: false,
          animation: "fade",
        }}
      />
      <Stack.Screen
        name="Menu"
        component={MenuScreen}
        options={{
          headerShown: false,
          animation: "fade",
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
        name="WorldSelect"
        component={WorldSelectScreen}
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
