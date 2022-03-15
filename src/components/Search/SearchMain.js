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
import GestureRecognizer from "react-native-swipe-gestures";
import Tags from "react-native-tags";
import * as tokenHandling from "../../constants/TokenErrorHandle";

const SearchMain = ({ navigation }) => {
  const [token, setToken] = useState("");

  const [keyword, setKeyword] = useState([]);
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
        tokenHandling.tokenErrorHandling(err);
      });
    setResultPage(false);
    setKeyword([]);
    setModal(false);
  }, []);

  const searchPop = (name) => {
    setKeyword([name]);
    setValue("RECENT");
    setResultPage(true);
    postKeyword();
  };

  const renderItem = ({ item }) => {
    console.log("item(인기 태그) 불러옴");
    return (
      <View style={{ margin: 10 }}>
        <TouchableOpacity onPress={() => searchPop(`${item.name}`)}>
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

  useEffect(() => {
    postKeyword();
  }, [open]);

  const postKeyword = () => {
    console.log("보낼 키워드: ", keyword);
    console.log("보낼 정렬 기준: ", value);
    console.log("page: ", page);
    if (keyword != prev) {
      setPage(0);
    }
    let keywords = "";
    let rkeywords = "";
    if (keyword.length >= 2) {
      for (let i = 0; i < keyword.length; i++) {
        keywords = keywords + keyword[i] + ",";
        console.log(keywords);
        rkeywords = keywords.slice(0, -1);
      }
    }
    console.log("실제 보낼 태그 : ", rkeywords);
    console.log(
      "url 확인 : ",
      preURL.preURL +
        `/posts/search?page=${page}&tags=${rkeywords}&order=${value}`
    );
    fetch(
      preURL.preURL +
        `/posts/search?page=${page}&tags=${rkeywords}&order=${value}`
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
        setPrev(keyword);
        console.log("PAGE: ", page);
      })
      .catch((err) => {
        console.log("에러 발생❗️ - 검색 결과", err.response.data);
        tokenHandling.tokenErrorHandling(err.response.data);
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
      <View
        style={{ padding: 20, display: "flex", flexDirection: "row" }}
      ></View>
      <Tags
        initialText="태그 ..."
        textInputProps={{
          placeholder: "검색하실 태그를 입력해주세요",
        }}
        onChangeTags={(tags) => {
          console.log(tags);
          setKeyword(tags);
          setResultPage(true);
          if (tags == "") {
            setResult([]);
          }
        }}
        onTagPress={(index, tagLabel, event, deleted) =>
          console.log(
            index,
            tagLabel,
            event,
            deleted ? "deleted" : "not deleted"
          )
        }
        containerStyle={{ justifyContent: "center" }}
        inputStyle={{
          backgroundColor: "white",
          borderBottomColor: "#000",
          borderBottomWidth: 1,
        }}
        maxNumberOfTags={5}
        renderTag={({ tag, index, onPress, deleteTagOnPress, readonly }) => (
          <TouchableOpacity
            key={`${tag}-${index}`}
            onPress={onPress}
            style={{
              padding: 7,
              backgroundColor: "#D0DBFB",
              borderRadius: 10,
              margin: 2,
            }}
          >
            <Text>{tag}</Text>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity
        onPress={() => {
          setPage(0);
          postKeyword();
        }}
        style={{
          width: "95%",
          backgroundColor: "#001A72",
          padding: 10,
          justifyContent: "center",
          alignItems: "center",
          alignSelf: "center",
          borderRadius: 10,
          margin: 10,
        }}
      >
        <Text style={{ color: "white" }}>검색</Text>
      </TouchableOpacity>
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
                <Text
                  style={{ fontSize: 18, fontWeight: "bold", marginTop: 10 }}
                >
                  검색 결과
                </Text>
              </View>
              <DropDownPicker
                placeholder={"최신순"}
                open={open}
                value={value}
                items={item}
                setOpen={() => setOpen(open)}
                setValue={() => setValue(value)}
                setItems={() => setItem(item)}
                containerStyle={{
                  width: "30%",
                  marginBottom: 10,
                  zIndex: 5,
                }}
              />
            </View>

            {/* 검색 결과 */}
            <View style={{ width: "100%", padding: 10 }}>
              <FlatList
                data={result}
                extraData={result}
                renderItem={listItems}
                numColumns={3}
                keyExtractor={(item) => item.id}
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
              {/* 결과 상세 모달 */}
              {info !== undefined ? (
                <GestureRecognizer onSwipeDown={() => setModal(false)}>
                  <Modal animationType="slide" visible={modal} transparent>
                    <View
                      style={{
                        height: "50%",
                        width: "80%",
                        alignSelf: "center",
                        backgroundColor: "rgba(255,255,255,0.8)",
                        borderRadius: 20,
                        padding: 10,
                        marginTop: "60%",
                      }}
                    >
                      <TouchableOpacity onPress={() => setModal(false)}>
                        <Icon
                          size={25}
                          color="black"
                          name="close"
                          style={{
                            alignSelf: "flex-end",
                            margin: 5,
                            backgroundColor: "rgba(245,245,245,1)",
                            borderRadius: 15,
                            padding: 3,
                          }}
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
                          style={{
                            width: 300,
                            height: 300,
                            alignSelf: "center",
                          }}
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
                </GestureRecognizer>
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
            <FlatList
              data={pData}
              renderItem={renderItem}
              numColumns={2}
              keyExtractor={(item) => item.id}
            />
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
