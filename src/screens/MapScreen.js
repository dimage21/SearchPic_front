import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MapMain from "../components/Map/MapMain";
import AddPlaceMain from "../components/Map/AddPlaceMain";
import Upload from "../components/Map/Upload";
import UploadMarkers from "../components/Map/UploadMarkers";
import LikedMarkers from "../components/Map/LikedMarkers";


const MapStack = createNativeStackNavigator();

const Map = () => {
  return (
    <MapStack.Navigator initialRouteName="MapMain">
      <MapStack.Screen
        name="MapMain"
        component={MapMain}
        options={{ headerShown: false }}
      />
      <MapStack.Screen
        name="AddPlaceMain"
        component={AddPlaceMain}
        options={{ headerShown: false }}
      />
      <MapStack.Screen
        name="Upload"
        component={Upload}
        options={{ headerShown: false }}
      />
      <MapStack.Screen
        name="UploadMarkers"
        component={UploadMarkers}
        options={{ headerShown: false }}
      />
      <MapStack.Screen
        name="LikedMarkers"
        component={LikedMarkers}
        options={{ headerShown: false }}
      />
    </MapStack.Navigator>
  );
};

export default Map;
