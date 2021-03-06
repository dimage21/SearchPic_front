import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import preURL from "../../preURL/preURL";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import * as tokenHandling from "../../constants/TokenErrorHandle";

const MypageMain = ({ navigation }) => {
  let [token, setToken] = useState("");

  const [userInfo, setUserInfo] = useState({});
  const [page, setPage] = useState(0);
  const [pData, setPData] = useState([]);
  const [reLoader, setReLoader] = useState(0);
  const isFocused = useIsFocused();

  const getUserToken = async () => {
    const userToken = await AsyncStorage.getItem("userToken");
    console.log("userToken-Test : ", userToken);
    if (userToken !== null) {
      setToken(userToken);
      console.log("userToken: ", token);
    } else {
      console.log("MypageMain - 토큰 아직 못 받음!");
    }
    setToken(userToken);
    console.log("userToken ", token);
  };

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    getUserToken();
    console.log("토큰: ", token);
  }, [token]);

  useEffect(() => {
    console.log("config: ", config);
    setReLoader(reLoader + 1);
    getInfo();
    setReLoader(reLoader + 1);
    getData();
    setReLoader(reLoader + 1);
  }, [token]);

  useEffect(() => {
    if (isFocused) {
      setReLoader(reLoader + 1);
      getInfo();
      setReLoader(reLoader + 1);
      getData();
      setReLoader(reLoader + 1);
    }
  }, [isFocused]);

  const getInfo = () => {
    axios
      .get(preURL.preURL + "/profile", config)
      .then((res) => {
        console.log("유저 개인 정보 받았다! ", res.data.data);
        setUserInfo(res.data.data);
      })
      .catch((err) => {
        console.log("에러 발생❗️ - 유저 정보", err.response.data);
        // tokenHandling.tokenErrorHandling(err.response.data);
      });
  };

  const getData = () => {
    axios
      .get(preURL.preURL + `/posts/member?page=${page}`, config)
      .then((res) => {
        console.log("게시글 받았다! ", res.data.data);
        pData.push(...res.data.data);
        setPData(pData);
        console.log("DATA: ", pData);
        setPage(page + 1);
        console.log("PAGE: ", page);
      })
      .catch((err) => {
        console.log("에러 발생❗️ - 게시글", err.response.data);
        // tokenHandling.tokenErrorHandling(err.response.data);
      });
  };

  const photoItems = ({ item }) => {
    console.log("item(게시글): ", item);
    return (
      <View>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("Detail", { locationId: item.locationId })
          }
        >
          <Image
            source={{ uri: `${item.pictureUrl}` }}
            style={{ width: 180, height: 180 }}
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={{ padding: 15, backgroundColor: "#ffffff", paddingBottom: "50%" }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
          backgroundColor: "#ffffff",
          padding: 20,
        }}
      >
        <TouchableOpacity onPress={() => navigation.navigate("Setting")}>
          <Icon size={40} color="black" name="setting" />
        </TouchableOpacity>
      </View>
      <View style={{ padding: 15 }}>
        {userInfo.profileUrl == null ? (
          <View
            style={{
              width: 133,
              height: 133,
              backgroundColor: "red",
              borderRadius: 100,
            }}
          ></View>
        ) : (
          <Image
            source={{ uri: `${userInfo.profileUrl}` }}
            style={{ width: 133, height: 133, borderRadius: 100 }}
          />
        )}
        <Text style={{ fontSize: 22, fontWeight: "bold", marginTop: 20 }}>
          {userInfo.nickname}
        </Text>
        <Text style={{ fontSize: 18, marginTop: 5 }}>{userInfo.email}</Text>
        <Text style={{ fontWeight: "bold", marginTop: 10 }}>
          {userInfo.postCount} Pics
        </Text>
      </View>
      <View style={{ marginTop: 10 }}>
        <View
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <FlatList
            data={pData}
            extraData={pData}
            keyExtractor={(item) => item.id}
            renderItem={photoItems}
            numColumns={2}
            onEndReached={() => getData()}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default MypageMain;
