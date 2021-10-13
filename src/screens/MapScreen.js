import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MapMain from "../components/Map/MapMain";

const MapStack = createNativeStackNavigator();

const Map = () => {
  return (
    <MapStack.Navigator>
      <MapStack.Screen
        name="MapMain"
        component={MapMain}
        options={{ headerShown: false }}
      />
    </MapStack.Navigator>
  );
};

export default Map;
