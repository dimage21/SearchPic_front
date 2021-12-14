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

const MypageMain = ({ navigation }) => {
  const [token, setToken] = useState("");

  const [userInfo, setUserInfo] = useState({});
  const [page, setPage] = useState(0);
  const [pData, setPData] = useState([]);

  const getUserToken = async () => {
    const userToken = await AsyncStorage.getItem("userToken");
    if (userToken !== null) {
      console.log("userToken: ", userToken);
      setToken(userToken);
    } else {
      console.log("토큰 아직 못 받음!");
    }
    console.log("userToken ", userToken);
    setToken(
      "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwiaWF0IjoxNjM5MjIwMjc2LCJleHAiOjE2Mzk5NDAyNzZ9.dMJANe3DNDgrPPpoMvrb4fHXcq-Q4TNRqjyIY6e9vHs"
    );
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
    getInfo();
    getData();
  }, [token]);

  const getInfo = () => {
    axios
      .get(preURL.preURL + "/profile", config)
      .then((res) => {
        console.log("유저 개인 정보 받았다! ", res.data.data);
        setUserInfo(res.data.data);
      })
      .catch((err) => {
        console.log("에러 발생❗️ ", err);
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
        console.log("에러 발생❗️ ", err);
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
      style={{ padding: 15, backgroundColor: "#ffffff", marginBottom: "50%" }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
        }}
      >
        <TouchableOpacity onPress={() => navigation.navigate("Setting")}>
          <Icon size={40} color="black" name="setting" />
        </TouchableOpacity>
      </View>
      <View>
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
      </View>
      <View style={{ marginTop: 20 }}>
        <Text style={{ fontWeight: "bold", marginBottom: 10 }}>
          {userInfo.postCount} Pics
        </Text>
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
