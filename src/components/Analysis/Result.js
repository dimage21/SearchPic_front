import React, { useState } from "react";
import {
  SafeAreaView,
  TouchableOpacity,
  Text,
  View,
  Image,
  StyleSheet,
} from "react-native";
import axios from "axios";
import Icon from "react-native-vector-icons/AntDesign";
import AsyncStorage from "@react-native-async-storage/async-storage";
import preURL from "../../preURL/preURL";

const Result = ({ navigation, route }) => {
  //   const Result = route.params;
  const [token, setToken] = useState("");
  console.log("=======================[Result]=====================");
  const getUserToken = async () => {
    const userToken = await AsyncStorage.getItem("userToken");
    setToken(userToken);
    console.log("userToken ", userToken);
  };

  getUserToken();

  // 임시 data
  const Result = [
    {
      id: 255,
      address: "서울 송파구 백제고분로 435",
      x: 127.111552566541,
      y: 37.5097815878229,
      placeName: "서울리즘",
      repImageUrl:
        "https://s3-ap-northeast-1.amazonaws.com/dcreviewsresized/pre_20180701074347518_menu3_3el7hGvSZLeT.jpg",
      repTags: null,
      marked: false,
    },
    {
      id: 250,
      address: "서울 서대문구 연세로 36",
      x: 126.937231255637,
      y: 37.5587887769132,
      placeName: "독수리다방",
      repImageUrl:
        "https://search.pstatic.net/common/?autoRotate=true&quality=95&type=w750&src=https%3A%2F%2Fmyplace-phinf.pstatic.net%2F20210804_225%2F1628074630385GKlnr_JPEG%2Fupload_4c9f150f059acf67414ed14c92fbc1d5.jpeg",
      repTags: null,
      marked: false,
    },
    {
      id: 264,
      address: "제주특별자치도 제주시 한림읍 금악동길 28",
      x: 126.327959363756,
      y: 33.3469077943428,
      placeName: "테쉬폰",
      repImageUrl:
        "https://img.khan.co.kr/news/2017/01/15/l_2017011601001911800161721.jpg",
      repTags: null,
      marked: false,
    },
  ];
  const Result1 = Result[0];
  const Result2 = Result[1];
  const Result3 = Result[2];

  const [mark1, setMark1] = useState(Result1.marked);
  const [mark2, setMark2] = useState(Result2.marked);
  const [mark3, setMark3] = useState(Result3.marked);

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  };

  const postMark = (locationId) => {
    console.log("전송:", config, locationId);
    axios
      .post(preURL.preURL + `location/${locationId}/mark`, config, locationId)
      .then((res) => {
        console.log("마크 추가 보냈다!");
        console.log(res.data);
        setResult(res.data);
      })
      .catch((err) => {
        console.log("에러 발생 ");
        console.log(err);
      });
  };

  const deleteMark = (locationId) => {
    console.log("전송:", config, locationId);
    axios
      .delete(
        preURL.preURL + `location/${locationId}/un-mark`,
        config,
        locationId
      )
      .then((res) => {
        console.log("마크 취소 보냈다!");
        console.log(res.data);
        setResult(res.data);
      })
      .catch((err) => {
        console.log("에러 발생 ");
        console.log(err);
      });
  };

  return (
    <SafeAreaView style={{ padding: 15, width: "100%", height: "100%" }}>
      <TouchableOpacity onPress={() => navigation.navigate("AnalysisMain")}>
        <Icon size={40} color="black" name="left" />
      </TouchableOpacity>
      <View>
        <Text
          style={{
            fontSize: 20,
            marginTop: 20,
            marginBottom: 10,
            fontWeight: "bold",
          }}
        >
          분석 결과
        </Text>
        <Text style={{ fontSize: 16, color: "#89A3F5" }}>Best</Text>
        <View style={styles.imageBlock}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Detail", { locationId: Result1.id })
            }
          >
            <Image source={{ uri: Result1.repImageUrl }} style={styles.image} />
          </TouchableOpacity>
          <View style={styles.textBlock}>
            <Text style={styles.placeName}>{Result1.placeName}</Text>
            <Text style={styles.address}>{Result1.address}</Text>
          </View>
          {mark1 ? (
            <Icon
              size={35}
              color="#001A72"
              name="heart"
              onPress={() => {
                setMark1(!mark1);
                deleteMark(Result1.locationId);
              }}
            />
          ) : (
            <Icon
              size={35}
              color="#001A72"
              name="hearto"
              onPress={() => {
                setMark1(!mark1);
                postMark(Result1.locationId);
              }}
            />
          )}
        </View>
      </View>
      <View>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            marginTop: 10,
          }}
        >
          비슷한 장소 더보기
        </Text>
        <View>
          <View style={styles.imageBlock}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Detail", { locationId: Result2.id })
              }
            >
              <Image
                source={{ uri: Result2.repImageUrl }}
                style={styles.image}
              />
            </TouchableOpacity>
            <View style={styles.textBlock}>
              <Text style={styles.placeName}>{Result2.placeName}</Text>
              <Text style={styles.address}>{Result2.address}</Text>
            </View>
            {mark2 ? (
              <Icon
                size={35}
                color="#001A72"
                name="heart"
                onPress={() => {
                  setMark2(!mark2);
                  deleteMark(Result2.locationId);
                }}
              />
            ) : (
              <Icon
                size={35}
                color="#001A72"
                name="hearto"
                onPress={() => {
                  setMark2(!mark2);
                  postMark(Result2.locationId);
                }}
              />
            )}
          </View>
        </View>
        <View>
          <View style={styles.imageBlock}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Detail", { locationId: Result3.id })
              }
            >
              <Image
                source={{ uri: Result3.repImageUrl }}
                style={styles.image}
              />
            </TouchableOpacity>
            <View style={styles.textBlock}>
              <Text style={styles.placeName}>{Result3.placeName}</Text>
              <Text style={styles.address}>{Result3.address}</Text>
            </View>
            {mark3 ? (
              <Icon
                size={35}
                color="#001A72"
                name="heart"
                onPress={() => {
                  setMark3(!mark3);
                  deleteMark(Result3.locationId);
                }}
              />
            ) : (
              <Icon
                size={35}
                color="#001A72"
                name="hearto"
                onPress={() => {
                  setMark3(!mark3);
                  postMark(Result3.locationId);
                }}
              />
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Result;

const styles = StyleSheet.create({
  imageBlock: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  textBlock: { width: "40%", marginRight: 10 },
  placeName: {
    fontSize: 18,
    marginBottom: 10,
  },
  address: {
    fontSize: 10,
  },
  image: { width: 156, height: 97, margin: 10, marginLeft: 0 },
});
