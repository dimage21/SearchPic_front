import React, { useState } from "react";
import {
  SafeAreaView,
  TouchableOpacity,
  Text,
  View,
  Image,
  StyleSheet,
  Modal,
} from "react-native";
import axios from "axios";
import Icon from "react-native-vector-icons/AntDesign";
import AsyncStorage from "@react-native-async-storage/async-storage";
import preURL from "../../preURL/preURL";
import GridImageView from "react-native-grid-image-viewer";
import GestureRecognizer from "react-native-swipe-gestures";

const Detail = ({ navigation, route }) => {
  const locationId = route.params;
  //   const [place, setPlace] = useState({});
  //   const [places, setPlaces] = useState([]);
  const [modal, setModal] = useState(false);
  const [modalPlace, setModalPlace] = useState({});

  // 임시 data
  const place = {
    id: 276,
    address: "제주특별자치도 제주시 구좌읍 종달리 2690",
    x: 126.888955399,
    y: 33.49808308,
    placeName: null,
    repImageUrl:
      "/Users/oghyewon/Documents/search-pic/2/16c678d3-7bde-4d8f-9d37-1b4f3efe89b7.jpg",
    repTags: ["강릉", "진수", "이이"],
    marked: false,
  };
  const places = [
    {
      postId: 65,
      pictureUrl:
        "https://s3-ap-northeast-1.amazonaws.com/dcreviewsresized/300_300_20200701035909_photo2_aad9545a5655.jpg",
      tagNames: ["자연", "액자", "바다"],
      address: "서울 강남구 테헤란로1길 28-3",
      description: "메모입니다.",
      locationId: 248,
    },
    {
      postId: 60,
      pictureUrl:
        "https://cdn.eyesmag.com/content/uploads/posts/2021/01/20/ottogi-rolyopoly-cotto-info-01-2c657350-9240-4670-96a5-364bb35c0a62.jpg",
      tagNames: ["자연", "액자", "바다"],
      address: "서울 강남구 봉은사로51길 19",
      description: "메모입니다.",
      locationId: 243,
    },
    {
      postId: 62,
      pictureUrl: "http://www.newstof.com/news/photo/201908/1901_5129_155.jpg",
      tagNames: ["자연", "액자", "바다"],
      address: "서울 종로구 계동길 5",
      description: "메모입니다.",
      locationId: 245,
    },
    {
      postId: 91,
      pictureUrl:
        "https://search.pstatic.net/common/?autoRotate=true&quality=95&type=w750&src=https%3A%2F%2Fmyplace-phinf.pstatic.net%2F20210926_120%2F1632614979878HBmqX_JPEG%2Fupload_4107e2439955abfadb6e61d2496e2ef2.jpeg",
      tagNames: ["자연", "액자", "바다"],
      address: "서울특별시 중구 정동 세종대로 99",
      description: "메모입니다.",
      locationId: 274,
    },
  ];

  const [mark, setMark] = useState(place.marked);
  const [token, setToken] = useState("");

  console.log("=======================[Detail]======================");

  const getUserToken = async () => {
    const userToken = await AsyncStorage.getItem("userToken");
    setToken(userToken);
    console.log("userToken ", userToken);
  };

  getUserToken();

  const getPlace = () => {
    axios
      .get(preURL.preURL + `location/${locationId}`, locationId)
      .then((res) => {
        console.log("장소 요청 보냈다!");
        console.log(res.data);
        setPlace(res.data);
      })
      .catch((err) => {
        console.log("에러 발생 ");
        console.log(err);
      });
  };

  getPlace();

  const getPlaces = () => {
    axios
      .get(preURL.preURL + `${locationId}/posts`)
      .then((res) => {
        console.log("근처 장소 요청 보냈다!");
        console.log(res.data);
        setPlaces(res.data);
      })
      .catch((err) => {
        console.log("에러 발생 ");
        console.log(err);
      });
  };

  getPlaces();

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  };

  const postMark = () => {
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

  const deleteMark = () => {
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

  const listItems = places.map((place) => (
    <View>
      <TouchableOpacity
        onPress={() => {
          setModal(true);
          setModalPlace(place);
        }}
      >
        <Image
          source={{ uri: place.pictureUrl }}
          style={{ width: 150, height: 150 }}
        />
      </TouchableOpacity>
    </View>
  ));

  return (
    <SafeAreaView style={{ padding: 10 }}>
      <View
        style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
      >
        <TouchableOpacity onPress={() => navigation.navigate("Result")}>
          <Icon size={40} color="black" name="left" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>포토스팟</Text>
      </View>
      <View style={styles.main}>
        <Image />
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View>
            {place.placeName ? (
              <Text style={{ fontSize: 18 }}>{place.placeName}</Text>
            ) : (
              <Text></Text>
            )}
            <Text style={{ fontSize: 16 }}>{place.address}</Text>
            <View style={styles.hashtags}>
              <Text style={styles.hashtag}>#{place.repTags[0]}</Text>
              <Text style={styles.hashtag}>#{place.repTags[1]}</Text>
              <Text style={styles.hashtag}>#{place.repTags[2]}</Text>
            </View>
          </View>
          {mark ? (
            <Icon
              size={35}
              color="#001A72"
              name="heart"
              onPress={() => {
                setMark(!mark);
                deleteMark();
              }}
            />
          ) : (
            <Icon
              size={35}
              color="#001A72"
              name="hearto"
              onPress={() => {
                setMark(!mark);
                postMark();
              }}
            />
          )}
        </View>
      </View>
      <View>
        <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 20 }}>
          근처 포토스팟
        </Text>
        <View>{listItems}</View>
      </View>
      {modal ? (
        <View style={{ display: "flex", justifyContent: "flex-end" }}>
          <GestureRecognizer
            onSwipeUp={() => setModal(true)}
            onSwipeDown={() => setModal(false)}
          >
            <Modal
              animationType="slide"
              presentationStyle="formSheet"
              style={{
                height: "50%",
                display: "flex",
                justifyContent: "flex-end",
                margin: 0,
                backgroundColor: "green",
              }}
            >
              <View
                style={{
                  width: "100%",
                  height: "50%",
                  backgroundColor: "yellow",
                  justifyContent: "flex-end",
                }}
              >
                <View
                  style={{
                    backgroundColor: "blue",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Image
                    source={{ uri: modalPlace.pictureUrl }}
                    style={{ width: 362, height: 170 }}
                  />
                </View>
                <Text>{modalPlace.address}</Text>
              </View>
            </Modal>
          </GestureRecognizer>
        </View>
      ) : (
        <View></View>
      )}
    </SafeAreaView>
  );
};

export default Detail;

const styles = StyleSheet.create({
  main: {
    width: "100%",
  },
  hashtags: {
    display: "flex",
    flexDirection: "row",
  },
  hashtag: {
    marginRight: 5,
    color: "#001A72",
  },
});