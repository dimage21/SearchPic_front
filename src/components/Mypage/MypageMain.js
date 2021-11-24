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

const MypageMain = ({ navigation }) => {
  const [userInfo, setUserInfo] = useState({});
  const [data, setData] = useState({});

  useEffect(() => {
    const config = {
      headers: {
        Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwiaWF0IjoxNjM3MzcyNTUyLCJleHAiOjE2MzgwOTI1NTJ9.ODrxTHg0A4SDB5qSf348XlbpNM5HQPef-jO8MZx8Bfw`,
      },
    };

    axios
      .get(preURL.preURL + "/profile", config)
      .then((res) => {
        console.log("유저 개인 정보 받았다! ", res.data.data);
        setUserInfo(res.data.data);
      })
      .catch((err) => {
        console.log("에러 발생❗️ ", err);
      });

    axios
      .get(preURL.preURL + "/posts/member", config)
      .then((res) => {
        console.log("게시글 받았다! ", res.data.data);
        setData(res.data.data);
      })
      .catch((err) => {
        console.log("에러 발생❗️ ", err);
      });
  }, []);

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
    <SafeAreaView style={{ padding: 15, backgroundColor: "#ffffff" }}>
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
          <FlatList data={data} renderItem={photoItems} numColumns={2} />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default MypageMain;
