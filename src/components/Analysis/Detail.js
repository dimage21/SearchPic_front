import React, { useState, useEffect, useRef } from "react";
import {
  SafeAreaView,
  TouchableOpacity,
  Text,
  View,
  Image,
  StyleSheet,
  Modal,
  FlatList,
} from "react-native";
import axios from "axios";
import Icon from "react-native-vector-icons/AntDesign";
import AsyncStorage from "@react-native-async-storage/async-storage";
import preURL from "../../preURL/preURL";
import GestureRecognizer from "react-native-swipe-gestures";
import * as tokenHandling from "../../constants/TokenErrorHandle";

const Detail = ({ navigation, route }) => {
  const locationId = route.params.locationId;
  let [place, setPlace] = useState({});
  let [places, setPlaces] = useState([]);
  let [repTags, setRepTags] = useState([]);
  const [modal, setModal] = useState(false);
  const [modalPlace, setModalPlace] = useState({});
  const [loading, setLoading] = useState(false);

  const [mark, setMark] = useState(place.marked);
  let [token, setToken] = useState("");
  const [IFF, setIFF] = useState();

  console.log("=======================[Detail]======================");
  console.log("locationId : ", locationId);

  const getUserToken = async () => {
    const userToken = await AsyncStorage.getItem("userToken");
    setToken(userToken);
    console.log("userToken ", userToken);
    console.log("token : ", token);

    const config = {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    };

    let isMount = true;

    console.log(
      "하나의 장소 조회 request ",
      preURL.preURL + `/location/${locationId}`,
      config
    );
    axios
      .get(preURL.preURL + `/location/${locationId}`, config)
      .then((res) => {
        console.log("장소 요청 보냈다!", res.data.data);
        setPlace(res.data.data);
        console.log("res.data: ", res.data.data);
        setRepTags(res.data.data.repTags);
        console.log("place: ", place);
      })
      .catch((err) => {
        console.log("에러 발생 - 장소 요청", err);
        tokenHandling.tokenErrorHandling(err);
      });

    axios
      .get(preURL.preURL + `/${locationId}/posts/10000`, config)
      .then((res) => {
        console.log("근처 장소 요청 보냈다!", res.data.data);
        setPlaces(res.data.data);
      })
      .catch((err) => {
        console.log("에러 발생 - 근처 장소 요청 ");
        console.log(err);
        tokenHandling.tokenErrorHandling(err);
      });

    return () => {
      isMount = false;
    };
  };

  useEffect(() => {
    getUserToken();
  }, []);

  const postMark = () => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    console.log("전송:", config, locationId);
    axios
      .post(preURL.preURL + `/location/${locationId}/mark`, "", config)
      .then((res) => {
        console.log("마크 추가 보냈다! ", res.data);
        setResult(res.data);
      })
      .catch((err) => {
        console.log("에러 발생 - postMark ", err);
      });
  };

  const deleteMark = () => {
    console.log("전송:", config, locationId);
    axios
      .delete(
        preURL.preURL + `/location/${locationId}/un-mark`,
        config,
        locationId
      )
      .then((res) => {
        console.log("마크 취소 보냈다! ", res.data);
        setResult(res.data);
      })
      .catch((err) => {
        console.log("에러 발생 - deleteMark ", err);
      });
  };

  const listItems = ({ item }) => {
    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            setModal(true);
            setModalPlace(item);
          }}
          key={item.locationId}
        >
          <Image
            source={{ uri: item.pictureUrl }}
            style={{ width: 165, aspectRatio: 1, margin: 10 }}
          />
        </TouchableOpacity>
      </View>
    );
  };

  useEffect(() => {
    console.log("place => ", place);
    return () => setLoading(false); // cleanup function을 이용
  }, []);

  return (
    <SafeAreaView style={{ padding: 10, flex: 1, backgroundColor: "#ffffff" }}>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          flex: 1,
        }}
      >
        <TouchableOpacity onPress={() => navigation.navigate("MypageMain")}>
          <Icon size={40} color="black" name="left" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>포토스팟</Text>
      </View>
      <View style={styles.main}>
        <Image
          source={{ uri: `${place.repImageUrl}` }}
          style={{ width: "95%", height: 200, marginBottom: 10 }}
        />
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <View style={{ marginRight: "10%" }}>
            {place.placeName ? (
              <Text style={{ fontSize: 18 }}>{place.placeName}</Text>
            ) : (
              <Text></Text>
            )}
            <Text style={{ fontSize: 16 }}>{place.address}</Text>
            <View style={styles.hashtags}>
              <Text style={styles.hashtag}>#{repTags[0]}</Text>
              <Text style={styles.hashtag}>#{repTags[1]}</Text>
              <Text style={styles.hashtag}>#{repTags[2]}</Text>
            </View>
          </View>
          {mark ? (
            <Icon
              size={27}
              color="#001A72"
              name="heart"
              onPress={() => {
                setMark(!mark);
                deleteMark();
              }}
            />
          ) : (
            <Icon
              size={27}
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
      <View style={{ marginTop: 20, marginLeft: 10, marginRight: 10 }}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingLeft: 15,
            paddingRight: 15,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
            }}
          >
            근처 포토스팟
          </Text>
          <TouchableOpacity>
            <Text>더보기</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={places}
          renderItem={listItems}
          numColumns={2}
          style={{ alignSelf: "center" }}
        />
      </View>
      {modal ? (
        <View style={{ display: "flex", justifyContent: "flex-end" }}>
          <GestureRecognizer onSwipeDown={() => setModal(false)}>
            <Modal animationType="slide" visible={modal} transparent>
              <View
                style={{
                  height: "45%",
                  width: "85%",
                  alignSelf: "center",
                  backgroundColor: "rgba(230,230,230, 0.99)",
                  borderTopLeftRadius: 30,
                  borderTopRightRadius: 30,
                  paddingTop: 10,
                  paddingBottom: 10,
                  marginTop: "60%",
                  position: "absolute",
                  bottom: "10%",
                }}
              >
                <TouchableOpacity>
                  <Icon
                    size={25}
                    color="black"
                    name="close"
                    style={{
                      alignSelf: "flex-end",
                      marginRight: 15,
                      marginBottom: 15,
                      backgroundColor: "rgba(245,245,245,1)",
                      borderRadius: 15,
                      padding: 3,
                    }}
                    onPress={() => setModal(false)}
                  />
                </TouchableOpacity>
                <Image
                  source={{ uri: modalPlace.pictureUrl }}
                  style={{ width: "80%", height: "65%", alignSelf: "center" }}
                />
                <View style={{ margin: 10, paddingLeft: 25 }}>
                  <Text style={{ fontSize: 17 }}>{modalPlace.address}</Text>
                  {modalPlace.tagNames.length != 0 ? (
                    <View style={styles.hashtags}>
                      <Text style={styles.hashtag}>
                        #{modalPlace.tagNames[0]}
                      </Text>
                      <Text style={styles.hashtag}>
                        #{modalPlace.tagNames[1]}
                      </Text>
                      <Text style={styles.hashtag}>
                        #{modalPlace.tagNames[2]}
                      </Text>
                    </View>
                  ) : (
                    <View></View>
                  )}
                </View>
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
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 15,
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
