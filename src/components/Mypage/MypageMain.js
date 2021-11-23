import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  FlatList,
} from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import preURL from "../../preURL/preURL";

const MypageMain = ({ navigation }) => {
  const [userInfo, setUserInfo] = useState({});
  const [data, setData] = useState({});

  useEffect(() => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
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
      .get(preURL.preURL + "/member", config)
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
        <TouchableOpacity>
          <Image
            source={{ uri: `${item.pictureUrl}` }}
            style={{ width: 210, height: 210 }}
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
          padding: 15,
        }}
      >
        <TouchableOpacity onPress={() => navigation.navigate("Setting")}>
          <Icon size={40} color="black" name="setting" />
        </TouchableOpacity>
      </View>
      <View>
        <Image
          source={{ uri: `${userInfo.profileUrl}` }}
          style={{ width: 133, height: 133 }}
        />
        <Text style={{ fontSize: 22, fontWeight: "bold" }}>
          {userInfo.nickname}
        </Text>
        <Text style={{ fontSize: 18 }}>{userInfo.email}</Text>
      </View>
      <View>
        <Text>{userInfo.postCount} Pics</Text>
        <FlatList data={data} renderItem={photoItems} numColumns={2} />
      </View>
    </SafeAreaView>
  );
};

export default MypageMain;
