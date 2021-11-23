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

const SearchMain = () => {
  const [keyword, setKeyword] = useState("");
  const [pData, setPData] = useState([]);
  const [resultPage, setResultPage] = useState(false);
  const [result, setResult] = useState({});
  const [modal, setModal] = useState(false);
  const [info, setInfo] = useState({});
  // Dropdown
  const [open, setOpen] = useState(false);
  const [item, setItem] = useState([
    { label: "최신순", value: "RECENT" },
    { label: "조회수순", value: "VIEW" },
  ]);
  const [value, setValue] = useState("RECENT");

  console.log("======================[SearchMain]===================");

  const config = {
    headers: {
      Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwiaWF0IjoxNjM3MzcyNTUyLCJleHAiOjE2MzgwOTI1NTJ9.ODrxTHg0A4SDB5qSf348XlbpNM5HQPef-jO8MZx8Bfw`,
    },
  };

  useEffect(() => {
    axios
      .get(preURL.preURL + "/tags", config)
      .then((res) => {
        console.log("응답 받았다!(인기 태그) ", res.data.data);
        setPData(res.data.data);
      })
      .catch((err) => {
        console.log("에러 발생❗️ ", err);
      });
  }, []);

  // 임시 data
  // const pData = [
  //   {
  //     id: 2,
  //     name: "액자",
  //     url: "https://postfiles.pstatic.net/MjAyMDA1MTdfMjEg/MDAxNTg5NzE1NzcwMzYx.YvWUNQQFolEIZapddpe11fuNQe1C8_b1TMVmZ8GaF80g.cgRtMr6GCrERiJlaLie84jAuoDvfWR856YiOECE0kEsg.JPEG.minimal_mk/IMG_6507.JPG?type=w966",
  //   },
  //   {
  //     id: 1,
  //     name: "자연",
  //     url: "https://postfiles.pstatic.net/MjAyMDA1MTdfMjEg/MDAxNTg5NzE1NzcwMzYx.YvWUNQQFolEIZapddpe11fuNQe1C8_b1TMVmZ8GaF80g.cgRtMr6GCrERiJlaLie84jAuoDvfWR856YiOECE0kEsg.JPEG.minimal_mk/IMG_6507.JPG?type=w966",
  //   },
  //   {
  //     id: 3,
  //     name: "바다",
  //     url: "https://postfiles.pstatic.net/MjAyMDA1MTdfMjEg/MDAxNTg5NzE1NzcwMzYx.YvWUNQQFolEIZapddpe11fuNQe1C8_b1TMVmZ8GaF80g.cgRtMr6GCrERiJlaLie84jAuoDvfWR856YiOECE0kEsg.JPEG.minimal_mk/IMG_6507.JPG?type=w966",
  //   },
  //   {
  //     id: 8,
  //     name: "테스트1",
  //     url: "https://postfiles.pstatic.net/MjAyMDA1MTdfMjEg/MDAxNTg5NzE1NzcwMzYx.YvWUNQQFolEIZapddpe11fuNQe1C8_b1TMVmZ8GaF80g.cgRtMr6GCrERiJlaLie84jAuoDvfWR856YiOECE0kEsg.JPEG.minimal_mk/IMG_6507.JPG?type=w966",
  //   },
  //   {
  //     id: 9,
  //     name: "기념",
  //     url: "https://postfiles.pstatic.net/MjAyMDA1MTdfMjEg/MDAxNTg5NzE1NzcwMzYx.YvWUNQQFolEIZapddpe11fuNQe1C8_b1TMVmZ8GaF80g.cgRtMr6GCrERiJlaLie84jAuoDvfWR856YiOECE0kEsg.JPEG.minimal_mk/IMG_6507.JPG?type=w966",
  //   },
  //   {
  //     id: 5,
  //     name: "강릉",
  //     url: "https://postfiles.pstatic.net/MjAyMDA1MTdfMjEg/MDAxNTg5NzE1NzcwMzYx.YvWUNQQFolEIZapddpe11fuNQe1C8_b1TMVmZ8GaF80g.cgRtMr6GCrERiJlaLie84jAuoDvfWR856YiOECE0kEsg.JPEG.minimal_mk/IMG_6507.JPG?type=w966",
  //   },
  // ];

  const renderItem = ({ item }) => {
    console.log("item(인기 태그): ", item);
    return (
      <View style={{ margin: 10 }}>
        <ImageBackground
          source={{ uri: `${item.url}` }}
          style={{
            width: 155,
            height: 155,
            borderRadius: 30,
            overflow: "hidden",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          imageStyle={{ opacity: 0.7 }}
        >
          <Text style={{ fontSize: 18, color: "#ffffff", fontWeight: "bold" }}>
            #{item.name}
          </Text>
        </ImageBackground>
      </View>
    );
  };

  const postKeyword = () => {
    const body = {
      tags: [keyword],
      order: value,
    };

    console.log("body: ", body);
    axios
      .get(preURL.preURL + "/posts/search", config, body)
      .then((res) => {
        console.log("검색 결과 받았다! ", res.data.data);
        setResult(res.data.data);
      })
      .catch((err) => {
        console.log("에러 발생❗️ ", err);
      });
  };

  const listItems = ({ item }) => {
    console.log("item(검색 결과): ", item);
    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            setInfo(item);
            setModal(true);
          }}
        >
          <Image
            source={{ uri: `${item.pictureUrl}` }}
            style={{ width: 140, height: 140 }}
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ padding: 15 }}>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <TouchableOpacity onPress={() => navigation.navigate("AnalysisMain")}>
          <Icon size={40} color="black" name="left" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>탐색하기</Text>
      </View>
      <View style={{ padding: 20, display: "flex", flexDirection: "row" }}>
        <TextInput
          style={styles.input}
          value={keyword}
          onChange={(event) => {
            const { eventCount, target, text } = event.nativeEvent;
            setKeyword(text);
            setResultPage(true);
          }}
        />
        <Icon
          size={30}
          color="#001A72"
          name="search1"
          onPress={() => {
            postKeyword();
          }}
        />
      </View>
      {resultPage ? (
        <View style={{ paddingLeft: "5%", paddingRight: "5%" }}>
          <Text style={{ fontSize: 13, color: "#FD0000" }}>
            태그는 5개까지 입력 가능합니다
          </Text>
          <View style={{ marginTop: 10 }}>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                검색 결과
              </Text>
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
                }}
              />
            </View>
            <FlatList data={result} renderItem={listItems} numColumns={3} />
            <Modal visible={modal}>
              <View
                style={{ width: 370, height: 440, backgroundColor: "#ffffff" }}
              >
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("Detail", { locationId: info.postId })
                  }
                >
                  <Image source={{ uri: `${info.pictureUrl}` }} />
                </TouchableOpacity>
                <Text>{info.address}</Text>
                {info.tagNames.map((tag) => (
                  <Text>#{tag} </Text>
                ))}
              </View>
            </Modal>
          </View>
        </View>
      ) : (
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
