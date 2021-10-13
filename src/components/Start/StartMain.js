import React, { useEffect, useState } from "react";
import {
  Button,
  View,
  Dimensions,
  StyleSheet,
  StatusBar,
  ImageBackground,
  Alert,
} from "react-native";
import Styled from "styled-components/native";
import { NaverLogin, getProfile } from "@react-native-seoul/naver-login";
import axios from "axios";
// post 성공시 User id 저장
import AsyncStorage from "@react-native-async-storage/async-storage";

// user id로 캐릭터, userName get 한 후에, asyncStorage에 저장

// const iosKeys = {
//   kConsumerKey: "dBTCaf__PhKbM6UieQby",
//   kConsumerSecret: "zkTe9EErPl",
//   kServiceAppName: "테스트앱(iOS)",
//   kServiceAppUrlScheme: "marimologin",
// };

const androidKeys = {
  kConsumerKey: "WfY6pghIqcFwpkxA7YYj",
  kConsumerSecret: "UpneszQ3W_",
  kServiceAppName: "테스트앱(안드로이드)",
};

const initials = Platform.OS === "ios" ? iosKeys : androidKeys;

// post user info

const StartMain = ({ navigation }) => {
  const [naverToken, setNaverToken] = React.useState(null);
  const [userId, setUserId] = useState(-1);
  const [aToken, setAccessToken] = useState("");
  const [refresh, setRefresh] = useState(false);

  const naverLogin = (props) => {
    NaverLogin.login(props, (err, token) => {
      console.log(`\n\n  Token is fetched  :: ${token} \n\n`);
      setNaverToken(token);
      console.log("accessToken:", naverToken.accessToken);

      if (err) {
        return err;
      }
      console.log("pass token");
      return token;
    });
  };

  const naverLogout = () => {
    NaverLogin.logout();
    setNaverToken("");
  };

  useEffect(() => {
    AsyncStorage.setItem("isLogin", "false");
    if (naverToken !== null && AsyncStorage.getItem("isLogin") !== "true") {
      getUserProfile();
    }
  }, [naverToken]);

  const postUserInfo = async (token) => {
    console.log("postUserInfo - accessToken:", token);
    await axios
      .get(`http://192.168.35.40:8080/login/naver?token=${token}`)
      .then(async (res) => {
        // const response = res.data.id;
        // await setUserId(response);
        console.log("토큰 보냈다!");
      })
      .catch((err) => {
        console.log("에러 발생 ");
        console.log(err);
      });

    if (userId !== -1) {
      await setLogin();
    }
  };

  const Login = (props) => {
    naverLogin(props);
  };

  const setLogin = async () => {
    AsyncStorage.removeItem("userId");
    await AsyncStorage.setItem("isLogin", "true");
    await AsyncStorage.setItem("token", JSON.stringify(naverToken));
    await AsyncStorage.setItem("userId", JSON.stringify(userId));
  };

  const hanldeContinue = async () => {
    const isLogin = await AsyncStorage.getItem("isLogin");
    Alert.alert("환영합니다.");
    navigation.navigate("NavTabs");
    /*if (isLogin === "true") {
      Alert.alert("환영합니다.");
      navigation.navigate("NavTab");
    } else {
      Alert.alert(
        "사용자 정보가 없습니다.\n시작하기 버튼을 눌러 가입을 해주세요."
      );
    }*/
  };

  const getUserProfile = async () => {
    const profileResult = await getProfile(naverToken.accessToken);
    console.log("profile:", profileResult);
    if (profileResult.resultcode === "024") {
      Alert.alert("로그인 실패", profileResult.message);
      return;
    } else {
      // const id = await postUserInfo({
      //   username: profileResult.response.name,
      //   identifier: profileResult.response.id,
      // });
      if (naverToken == null) {
        console.log("Token: null");
      } else {
        console.log("토큰 있다!");
        console.log(naverToken);
        console.log("accessToken:", naverToken.accessToken);
        setAccessToken(naverToken.accessToken);
        console.log("accessToken 2:", aToken);
        postUserInfo(naverToken.accessToken);
      }
      console.log("로그인 성공");
      Alert.alert(`${profileResult.response.name}님 환영합니다`);
      navigation.navigate("NavTabs", { name: profileResult.response.name });
    }
  };

  const { width, height } = Dimensions.get("window");
  let topMargin = height * 0.03;
  let bottomMargin = 0;
  let displayHeight = 0;

  const initials2 =
    Platform.OS === "ios"
      ? (displayHeight = height - 30)
      : (displayHeight = height);

  const style = StyleSheet.create({
    view: {
      backgroundColor: "#FFFBF8",
      width: "100%",
      height: "100%",
      alignItems: "center",
      justifyContent: "center",
    },
  });
  return (
    <View style={style.view}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={"transparent"}
        translucent={true}
      />

      <Cntr>
        <LogoCntr
          margin={topMargin}
          bottom={bottomMargin}
          width={displayHeight * 0.9}
        >
          <View
            style={{
              width: "100%",
              height: "50%",

              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <MainLogo
              resizeMode="contain"
              source={require("../../assets/icons/SPLogo.png")}
            />
          </View>
          <BtnCntr>
            <Btn2 onPress={() => Login(initials)}>
              <NIMg
                source={require("../../assets/icons/Home/naverLogin.png")}
              />
            </Btn2>

            <Btn
              style={{ marginTop: height * 0.025 }}
              onPress={() => hanldeContinue()}
            >
              <BtnText>이어하기</BtnText>
            </Btn>
          </BtnCntr>
        </LogoCntr>
      </Cntr>
    </View>
  );
};
const MainLogo = Styled.Image`
    height: 170;
    width: 170;
`;
const LogoCntr = Styled.View`
    align-items:center;
    justify-content:center;
    width:100%;
    height: ${(props) => props.width};
`;
const BtnCntr = Styled.View`
    width:100%;
    height:50%;
    justify-content:center;
    align-items:center;
`;
const AppName = Styled.Text`
  width:100%;
  text-align:center;
    height:20%;
    position:relative;
    top:0;
    color: #F66C6C;
    font-size: 52px;
    font-family: "Cafe24Ssurround"
    line-height: 61px;
`;
const DtText = Styled.Text`
  height:10%;
  width:100%;
  text-align:center;
  color: #191919;
    font-size: 18px;
    font-family: "Cafe24Ssurround"
`;
const Btn = Styled.TouchableOpacity`
  background-color: #B16CF6;
  color: white;
  width: 88%;
  height: 60;
  border-radius: 14px;
  align-items:center;
  justify-content:center;
`;
const Btn2 = Styled.TouchableOpacity`
  background-color: #03C75A;
  color: white;
  width: 88%;
  height: 60;
  border-radius: 14px;
  align-items:center;
  justify-content:center;
`;
const NIMg = Styled.Image`
  width: 70%;
  height: 90%;
  border-radius: 14px;
  align-items:center;
  justify-content:center;
`;

const Cntr = Styled.View`
width:100%;
height:100%;
align-items:center;
justify-content:flex-end;
`;

const BtnText = Styled.Text`
  color:white;
  font-size: 18px;
  letter-spacing: -0.408px;
`;
export default StartMain;
