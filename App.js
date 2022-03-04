import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import SplashScreen from "react-native-splash-screen";

// Contents
import Start from "./src/screens/StartScreen";

import NavTabs from "./src/screens/NavTab";
import Analysis from "./src/screens/AnalysisScreen";
import Search from "./src/screens/SearchScreen";
import Map from "./src/screens/MapScreen";
import Mypage from "./src/screens/MypageSreen";
import { SafeAreaProvider } from "react-native-safe-area-context";

import axios from "axios";
import preURL from "./src/preURL/preURL";

const MainStack = createStackNavigator();

const App = () => {
  const [token, setToken] = useState();
  const [rToken, setRToken] = useState();

  const getUserToken = async () => {
    const userToken = await AsyncStorage.getItem("userToken");
    const refreshToken = await AsyncStorage.getItem("refreshToken");
    setToken(userToken);
    setRToken(refreshToken);
    console.log("userToken ", token);
  };
  useEffect(() => {
    SplashScreen.hide();
    getUserToken();
    const config = {
      headers: {
        "refresh-token": rToken,
      },
    };
    // if (token == null || "") {
    //   axios
    //     .get(preURL.preURL + "reissue/access-token", config)
    //     .then((res) => {
    //       console.log("응답 받았다! - 엑세스 토큰", res.data);
    //       AsyncStorage.setItem("userToken", res.data.accessToken);
    //       AsyncStorage.setItem("refreshToken", res.data.refreshToken);
    //     })
    //     .catch((err) => {
    //       console.log("App 에러 발생❗️ - 엑세스 토큰 재발급", err);
    //     });
    // }
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <MainStack.Navigator
          initialRouteName={"Home"}
          screenOptions={{
            headerShown: false,
          }}
        >
          {/* {token == null || rtoken == null ? (
            <MainStack.Screen
              name="Start"
              component={Start}
              options={{ headerShown: false }}
            />
          ) : (
            <></>
          )} */}
          <MainStack.Screen
            name="NavTabs"
            component={NavTabs}
            option={{ headerShown: false }}
          />
          <MainStack.Screen
            name="Analysis"
            component={Analysis}
            option={{ headerShown: false }}
          />
          <MainStack.Screen
            name="Search"
            component={Search}
            option={{ headerShown: false }}
          />
          <MainStack.Screen
            name="Map"
            component={Map}
            option={{ headerShown: false }}
          />
          <MainStack.Screen
            name="Mypage"
            component={Mypage}
            option={{ headerShown: false }}
          />
        </MainStack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};
export default App;
