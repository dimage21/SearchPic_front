import axios from "axios";
import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  StyleSheet,
  FlatList,
  ImageBackground,
  Image,
  Modal,
} from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import preURL from "../../preURL/preURL";
import DropDownPicker from "react-native-dropdown-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SearchMain = ({ navigation }) => {
  const [token, setToken] = useState("");

  const [keyword, setKeyword] = useState("");
  const [prev, setPrev] = useState("");
  const [pData, setPData] = useState([]);
  const [resultPage, setResultPage] = useState(false);
  let [result, setResult] = useState([]);
  const [modal, setModal] = useState(false);
  const [info, setInfo] = useState();
  // Dropdown
  const [open, setOpen] = useState(false);
  const [item, setItem] = useState([
    { label: "최신순", value: "RECENT" },
    { label: "조회수순", value: "VIEW" },
  ]);
  const [value, setValue] = useState("RECENT");
  const [page, setPage] = useState(0);

  console.log("======================[SearchMain]===================");

  const getUserToken = async () => {
    const userToken = await AsyncStorage.getItem("userToken");
    setToken(userToken);
    console.log("userToken ", userToken);
    setToken(
      "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwiaWF0IjoxNjM5MjIwMjc2LCJleHAiOjE2Mzk5NDAyNzZ9.dMJANe3DNDgrPPpoMvrb4fHXcq-Q4TNRqjyIY6e9vHs"
    );
  };

  useEffect(() => {
    getUserToken();

    axios
      .get(preURL.preURL + "/tags")
      .then((res) => {
        console.log("응답 받았다!(인기 태그) ", res.data.data);
        setPData(res.data.data);
      })
      .catch((err) => {
        console.log("에러 발생❗️ ", err);
      });
    setResultPage(false);
    setKeyword("");
    setModal(false);
  }, []);

  const renderItem = ({ item }) => {
    console.log("item(인기 태그) 불러옴");
    return (
      <View style={{ margin: 10 }}>
        <TouchableOpacity>
          <ImageBackground
            source={{ uri: `${item.url}` }}
            style={{
              width: 155.5,
              height: 155.5,
              borderRadius: 30,
              overflow: "hidden",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            imageStyle={{ opacity: 0.7 }}
          >
            <Text
              style={{ fontSize: 18, color: "#ffffff", fontWeight: "bold" }}
            >
              #{item.name}
            </Text>
          </ImageBackground>
        </TouchableOpacity>
      </View>
    );
  };

  const postKeyword = () => {
    console.log("검색 키워드: ", keyword);
    const keywords = keyword.replace(" ", ",");
    console.log("보낼 키워드: ", keywords);
    console.log("보낼 정렬 기준: ", value);
    console.log("page: ", page);
    if (keywords != prev) {
      setPage(0);
    }

    fetch(
      preURL.preURL +
        `posts/search?page=${page}&tags=${keywords}&order=${value}`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        console.log("검색 결과 받았다! ", data.data);

        if (page == 0) {
          setResult(data.data);
        } else {
          result.push(...data.data);
        }

        // setResult(result);
        setPrev(keywords);
        console.log("PAGE: ", page);
      })
      .catch((err) => {
        console.log("에러 발생❗️ ", err);
      });
  };

  const listItems = ({ item }) => {
    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            setInfo(item);
            console.log("info: ", info);
            setModal(true);
          }}
        >
          <Image
            source={{ uri: `${item.pictureUrl}` }}
            style={{ width: 125, height: 125 }}
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, padding: 15, backgroundColor: "#ffffff" }}>
      {resultPage ? (
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              setResultPage(false);
              setResult([]);
            }}
          >
            <Icon size={40} color="black" name="left" />
          </TouchableOpacity>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>탐색하기</Text>
        </View>
      ) : (
        <View
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "bold", paddingTop: 10 }}>
            탐색하기
          </Text>
        </View>
      )}
      <View style={{ padding: 20, display: "flex", flexDirection: "row" }}>
        <TextInput
          style={styles.input}
          value={keyword}
          onChange={(event) => {
            const { text } = event.nativeEvent;
            setKeyword(text);
            setResultPage(true);
            if (text == "") {
              setResult([]);
            }
          }}
        />
        <Icon
          size={30}
          color="#001A72"
          name="search1"
          onPress={() => {
            setPage(0);
            postKeyword();
          }}
        />
      </View>
      {resultPage ? (
        // 검색창에 입력했을 경우
        <View>
          <View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <View>
                <Text style={{ fontSize: 13, color: "#FD0000" }}>
                  태그는 5개까지 입력 가능합니다
                </Text>
                <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                  검색 결과
                </Text>
              </View>
              <DropDownPicker
                placeholder={"최신순"}
                open={open}
                value={value}
                items={item}
                setOpen={setOpen}
                setValue={setValue}
                setItems={setItem}
                containerStyle={{
                  width: "30%",
                  marginBottom: 10,
                }}
              />
            </View>

            {/* 검색 결과 */}
            <View style={{ width: "100%" }}>
              <FlatList
                data={result}
                extraData={result}
                renderItem={listItems}
                numColumns={3}
                onEndReached={() => {
                  setPage(page + 1);
                  postKeyword();
                }}
              />
            </View>
            <View
              style={{
                flex: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {info !== undefined ? (
                <Modal animationType="slide" visible={modal} transparent>
                  <View
                    style={{
                      height: "50%",
                      width: "85%",

                      alignSelf: "center",
                      backgroundColor: "rgba(255,255,255,0.8)",
                      borderRadius: 20,
                      padding: 10,
                      marginTop: "60%",
                    }}
                  >
                    <TouchableOpacity>
                      <Icon
                        size={27}
                        color="black"
                        name="close"
                        style={{ alignSelf: "flex-end", padding: 5 }}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("Detail", {
                          locationId: info.postId,
                        })
                      }
                    >
                      <Image
                        source={{ uri: `${info.pictureUrl}` }}
                        style={{ width: 310, height: 310, alignSelf: "center" }}
                      />
                    </TouchableOpacity>
                    <View style={{ padding: 10 }}>
                      <Text>{info.address}</Text>
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "flex-start",
                        }}
                      >
                        {info.tagNames.length != 0 ? (
                          info.tagNames.map((tag) => (
                            <Text style={{ color: "#001A72" }}>#{tag} </Text>
                          ))
                        ) : (
                          <View></View>
                        )}
                      </View>
                    </View>
                  </View>
                </Modal>
              ) : (
                <View></View>
              )}
            </View>
          </View>
        </View>
      ) : (
        // 인기 태그
        <View style={{ paddingLeft: "5%", paddingRight: "5%" }}>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>인기 태그</Text>
          <View style={{ marginTop: 20 }}>
            <FlatList data={pData} renderItem={renderItem} numColumns={2} />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default SearchMain;

const styles = StyleSheet.create({
  input: { width: "90%", borderBottomColor: "#000", borderBottomWidth: 1 },
});
