import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MypageMain from "../components/Mypage/MypageMain";
import Setting from "../components/Mypage/Setting";

const MypageStack = createNativeStackNavigator();

const Mypage = () => {
  return (
    <MypageStack.Navigator>
      <MypageStack.Screen
        name="MypageMain"
        component={MypageMain}
        options={{ headerShown: false }}
      />
      <MypageStack.Screen
        name="Setting"
        component={Setting}
        options={{ headerShown: false }}
      />
    </MypageStack.Navigator>
  );
};

export default Mypage;
