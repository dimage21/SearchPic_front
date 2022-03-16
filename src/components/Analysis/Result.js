import React, { useEffect, useState } from "react";
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
import * as tokenHandling from "../../constants/TokenErrorHandle";

const Result = ({ navigation, route }) => {
  // const result = route.params.result;
  const [result, setResult] = useState(route.params.result);
  const imageFormData = route.params.imageFormData;
  const cfg = route.params.config;
  const [token, setToken] = useState("");

  const [reLoader, setReLoader] = useState(0);

  const [Result1, setResult1] = useState(result.data[0]);
  const [Result2, setResult2] = useState(result.data[1]);
  const [Result3, setResult3] = useState(result.data[2]);

  let [mark1, setMark1] = useState(Result1.marked);
  let [mark2, setMark2] = useState(Result2.marked);
  let [mark3, setMark3] = useState(Result3.marked);

  const getUserToken = async () => {
    const userToken = await AsyncStorage.getItem("userToken");
    setToken(userToken);
    console.log("userToken ", userToken);
  };

  useEffect(() => {
    console.log("=======================[Result]=====================");
    getUserToken();
  }, [reLoader]);

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const postMark = (locationId) => {
    console.log("전송:", config, locationId);
    axios
      .post(preURL.preURL + `/location/${locationId}/mark`, "", config)
      .then((res) => {
        console.log("마크 추가 보냈다! ", res.data);
      })
      .catch((err) => {
        console.log("에러 발생 - postMark ", err);
      });
  };

  const deleteMark = (locationId) => {
    console.log("전송:", config, locationId);
    axios
      .delete(
        preURL.preURL + `/location/${locationId}/un-mark`,
        config,
        locationId
      )
      .then((res) => {
        console.log("마크 취소 보냈다! ", res.data);
      })
      .catch((err) => {
        console.log("에러 발생 - deleteMark ", err);
      });
  };

  const postAgain = (type) => {
    console.log("postAgain 호출 완료");
    console.log("type : ", type);
    console.log("postAgain request ", imageFormData, cfg);
    axios
      .post(preURL.preURL + `/analysis?type=${type}`, imageFormData, cfg)
      .then((res) => {
        navigation.navigate("Result2", {
          result: res.data,
          type: type,
        });
      })
      .catch((err) => {
        console.log("에러 발생 - 분석 결과 요청 ", err);
        tokenHandling.tokenErrorHandling(err);
      });
  };

  return (
    <SafeAreaView
      style={{
        padding: 20,
        width: "100%",
        height: "100%",
        backgroundColor: "#ffffff",
      }}
    >
      <TouchableOpacity onPress={() => navigation.navigate("AnalysisMain")}>
        <Icon size={40} color="black" name="left" />
      </TouchableOpacity>
      <View style={{ padding: 10 }}>
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
                setMark1(false);
                deleteMark(Result1.id);
              }}
            />
          ) : (
            <Icon
              size={35}
              color="#001A72"
              name="hearto"
              onPress={() => {
                setMark1(true);
                postMark(Result1.id);
              }}
            />
          )}
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
                    setMark2(false);
                    deleteMark(Result2.id);
                  }}
                />
              ) : (
                <Icon
                  size={35}
                  color="#001A72"
                  name="hearto"
                  onPress={() => {
                    setMark2(true);
                    postMark(Result2.id);
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
                    setMark3(false);
                    deleteMark(Result3.locationId);
                  }}
                />
              ) : (
                <Icon
                  size={35}
                  color="#001A72"
                  name="hearto"
                  onPress={() => {
                    setMark3(true);
                    postMark(Result3.locationId);
                  }}
                />
              )}
            </View>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-around",
              marginTop: 15,
            }}
          >
            <TouchableOpacity
              style={styles.analysisbtn}
              onPress={() => postAgain("cafe")}
            >
              <Text style={{ color: "#ffffff", fontSize: 15 }}>카페/식당</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.analysisbtn}
              onPress={() => postAgain("attraction")}
            >
              <Text style={{ color: "#ffffff", fontSize: 15 }}>명소</Text>
            </TouchableOpacity>
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
  analysisbtn: {
    backgroundColor: "#001A72",
    width: "30%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    borderRadius: 15,
  },
});
