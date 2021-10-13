import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import SplashScreen from "react-native-splash-screen";

// Contents
import Start from "./src/screens/StartScreen";

import HomeTab from "./src/components/HomeTab";

const MainStack = createStackNavigator();

const App = () => {
  useEffect(() => {
    SplashScreen.hide();
  }, []);
  return (
    <NavigationContainer>
      <MainStack.Navigator
        initialRouteName={"Home"}
        headerMode="none"
        screenOptions={{
          headerShown: false,
        }}
      >
        <MainStack.Screen
          name="Start"
          component={Start}
          options={{ headerShown: false }}
        />
        <MainStack.Screen
          name="HomeTab"
          component={HomeTab}
          options={{ headerShown: false }}
        />
      </MainStack.Navigator>
    </NavigationContainer>
  );
};
export default App;
