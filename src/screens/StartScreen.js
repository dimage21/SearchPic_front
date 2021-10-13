import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import StartMain from "../components/Start/StartMain";

const StartStack = createStackNavigator();

const Start = () => {
  return (
    <StartStack.Navigator>
      <StartStack.Screen
        name="StartMain"
        component={StartMain}
        options={{ headerShown: false }}
      />
    </StartStack.Navigator>
  );
};

export default Start;
