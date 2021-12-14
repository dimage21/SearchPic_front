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

const Detail = ({ navigation, route }) => {
  const locationId = route.params.locationId;
  let [place, setPlace] = useState({});
  let [places, setPlaces] = useState([]);
  let [repTags, setRepTags] = useState([]);
  const [modal, setModal] = useState(false);
  const [modalPlace, setModalPlace] = useState({});
  const [loading, setLoading] = useState(false);

  const [mark, setMark] = useState(place.marked);
  const [token, setToken] = useState("");

  console.log("=======================[Detail]======================");

  const getUserToken = async () => {
    const userToken = await AsyncStorage.getItem("userToken");
    setToken(userToken);
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

    let isMount = true;

    axios
      .get(preURL.preURL + `location/${locationId}`, config)
      .then((res) => {
        console.log("장소 요청 보냈다!", res.data.data);
        setPlace(res.data.data);
        console.log("res.data: ", res.data.data);
        setRepTags(res.data.data.repTags);
        console.log("place: ", place);
      })
      .catch((err) => {
        console.log("에러 발생 - 장소 요청", err);
        console.log(err);
      });

    axios
      .get(preURL.preURL + `${locationId}/posts/10000`, config)
      .then((res) => {
        console.log("근처 장소 요청 보냈다!", res.data.data);
        setPlaces(res.data.data);
      })
      .catch((err) => {
        console.log("에러 발생 - 근처 장소 요청 ");
        console.log(err);
      });

    return () => {
      isMount = false;
    };
  }, []);

  const postMark = () => {
    console.log("전송:", config, locationId);
    axios
      .post(preURL.preURL + `location/${locationId}/mark`, "", config)
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
        preURL.preURL + `location/${locationId}/un-mark`,
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
            style={{ width: 150, height: 150, margin: 10 }}
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
        style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
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
          keyExtractor={(item) => item.id}
        />
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
