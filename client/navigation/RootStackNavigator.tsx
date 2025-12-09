import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import GameScreen from "@/screens/GameScreen";
import SettingsScreen from "@/screens/SettingsScreen";
import { HeaderTitle } from "@/components/HeaderTitle";
import { useScreenOptions } from "@/hooks/useScreenOptions";

export type RootStackParamList = {
  Game: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStackNavigator() {
  const screenOptions = useScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="Game"
        component={GameScreen}
        options={{
          headerTitle: () => <HeaderTitle title="Maze Level 1" />,
        }}
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
