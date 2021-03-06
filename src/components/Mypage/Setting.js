import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import preURL from "../../preURL/preURL";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Setting = ({ navigation }) => {
  const [refreshToken, setRefreshToken] = useState("");

  const getRefreshToken = async () => {
    const rToken = await AsyncStorage.getItem("refreshToken");
    setRefreshToken(rToken);
    console.log("refreshToken-Test : ", refreshToken);
  };

  useEffect(() => {
    getRefreshToken();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <View style={{ padding: 15 }}>
        <TouchableOpacity onPress={() => navigation.navigate("MypageMain")}>
          <Icon size={40} color="black" name="close" />
        </TouchableOpacity>
      </View>
      <View
        style={{
          borderBottomColor: "gray",
          borderBottomWidth: 0.5,
          padding: 5,
        }}
      >
        <TouchableOpacity
          style={styles.line}
          onPress={() => navigation.navigate("ChangeProfile")}
        >
          <Text style={styles.text}>프로필 수정</Text>
          <Icon size={40} color="black" name="right" />
        </TouchableOpacity>
        {/* <TouchableOpacity
          style={styles.line}
          onPress={() => {
            Alert.alert(
              "로그아웃",
              "로그아웃을 진행하시려면 확인을 눌러주세요",
              [
                {
                  text: "취소",
                  style: "cancel",
                },
                {
                  text: "확인",
                  onPress: () => {
                    axios
                      .delete(preURL.preURL + "/logout", {
                        headers: {
                          "refresh-token": refreshToken,
                        },
                      })
                      .then((res) => {
                        console.log("로그아웃했다!", res);
                        navigation.navigate("StartMain");
                        AsyncStorage.setItem("isLogin", "false");
                      })
                      .catch((err) => {
                        console.log("에러 발생 ❗️ - 로그아웃", err);
                      });
                  },
                },
              ]
            );
          }}
        >
          <Text style={styles.text}>로그아웃</Text>
          <Icon size={40} color="black" name="right" />
        </TouchableOpacity> */}
      </View>
      {/* <View style={{ padding: 5 }}>
        <TouchableOpacity style={styles.line}>
          <Text style={styles.text}>도움말</Text>
          <Icon size={40} color="black" name="right" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.line}>
          <Text style={styles.text}>이용 약관</Text>
          <Icon size={40} color="black" name="right" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.line}>
          <Text style={styles.text}>버전 정보</Text>
          <Icon size={40} color="black" name="right" />
        </TouchableOpacity>
      </View> */}
    </SafeAreaView>
  );
};

export default Setting;

const styles = StyleSheet.create({
  line: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginLeft: 15,
    marginRight: 15,
    marginTop: 10,
    marginBottom: 10,
  },
  text: { fontSize: 18 },
});
