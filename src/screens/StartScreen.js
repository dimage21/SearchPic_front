import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import StartMain from "../components/Start/StartMain";
import Profile from "../components/Start/Profile";
import NavTabs from "./NavTab";

const StartStack = createStackNavigator();

const Start = () => {
  return (
    <StartStack.Navigator>
      <StartStack.Screen
        name="StartMain"
        component={StartMain}
        options={{ headerShown: false, tabBarStyle: { display: "none" } }}
      />
      <StartStack.Screen
        name="Profile"
        component={Profile}
        options={{ headerShown: false }}
      />
      <StartStack.Screen
        name="NavTab"
        component={NavTabs}
        options={{ headerShown: false }}
      />
    </StartStack.Navigator>
  );
};

export default Start;
