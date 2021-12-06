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
  const result = route.params.result;
  console.log("Result에서 이상한 걸까?", result);
  const [token, setToken] = useState("");
  console.log("=======================[Result]=====================");
  const getUserToken = async () => {
    const userToken = await AsyncStorage.getItem("userToken");
    setToken(userToken);
    console.log("userToken ", userToken);
  };

  getUserToken();

  const Result1 = result.data[0];
  const Result2 = result.data[1];
  const Result3 = result.data[2];

  const [mark1, setMark1] = useState(Result1.marked);
  const [mark2, setMark2] = useState(Result2.marked);
  const [mark3, setMark3] = useState(Result3.marked);

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const postMark = (locationId) => {
    console.log("전송:", config, locationId);
    fetch(preURL.preURL + `location/${locationId}/mark`, {
      method: "POST",
      config,
    })
      .then((res) => {
        console.log("마크 추가 보냈다!");
        console.log(res);
      })
      .catch((err) => {
        console.log("에러 발생 ");
        console.log(err);
      });
  };

  const deleteMark = (locationId) => {
    console.log("전송:", config, locationId);
    axios
      .delete(preURL.preURL + `location/${locationId}/un-mark`, config)
      .then((res) => {
        console.log("마크 취소 보냈다!");
        console.log(res);
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
                deleteMark(Result1.id);
              }}
            />
          ) : (
            <Icon
              size={35}
              color="#001A72"
              name="hearto"
              onPress={() => {
                setMark1(!mark1);
                postMark(Result1.id);
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
                  deleteMark(Result2.id);
                }}
              />
            ) : (
              <Icon
                size={35}
                color="#001A72"
                name="hearto"
                onPress={() => {
                  setMark2(!mark2);
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
