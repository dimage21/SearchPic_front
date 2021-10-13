import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AnalysisMain from "../components/Analysis/AnalysisMain";

const AnalysisStack = createNativeStackNavigator();

const Analysis = () => {
  return (
    <AnalysisStack.Navigator>
      <AnalysisStack.Screen
        name="AnalysisMain"
        component={AnalysisMain}
        options={{ headerShown: false }}
      />
    </AnalysisStack.Navigator>
  );
};

export default Analysis;
