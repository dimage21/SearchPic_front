import React, { useState } from "react";
import {
  SafeAreaView,
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  Image,
  TextInput,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import { launchImageLibrary } from "react-native-image-picker";
import axios from "axios";
import preURL from "../../preURL/preURL";
import * as tokenHandling from "../../constants/TokenErrorHandle";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ChangeProfile = ({ navigation }) => {
  const [nickName, setNickName] = useState("");
  const [filePath, setFilePath] = useState({});
  const [picSelected, setPicSelected] = useState(false);
  const [token, setToken] = useState("");

  const getUserToken = async () => {
    const userToken = await AsyncStorage.getItem("userToken");
    setToken(userToken);
  };

  getUserToken();

  const requestExternalWritePermission = async () => {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: "External Storage Write Permission",
            message: "App needs write permission",
          }
        );
        // If WRITE_EXTERNAL_STORAGE Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        alert("Write permission err", err);
      }
      return false;
    } else return true;
  };

  const chooseFile = (type) => {
    let options = {
      mediaType: type,
      maxWidth: 300,
      maxHeight: 550,
      quality: 1,
    };
    launchImageLibrary(options, (response) => {
      console.log("Response = ", response);
      const assets = response.assets[0];
      console.log("asset:", assets);
      if (response.didCancel) {
        alert("User cancelled camera picker");
        return;
      } else if (response.errorCode == "camera_unavailable") {
        alert("Camera not available on device");
        return;
      } else if (response.errorCode == "permission") {
        alert("Permission not satisfied");
        return;
      } else if (response.errorCode == "others") {
        alert(response.errorMessage);
        return;
      }
      console.log("base64 -> ", assets.base64);
      console.log("uri -> ", assets.uri);
      console.log("width -> ", assets.width);
      console.log("height -> ", assets.height);
      console.log("fileSize -> ", assets.fileSize);
      console.log("type -> ", assets.type);
      console.log("fileName -> ", assets.fileName);
      setFilePath(assets);
      console.log(assets);
      console.log("filePath:", filePath);
      setPicSelected(!picSelected);
    });
  };

  const onClickHandler = (event) => {
    const formData = new FormData();

    const imageFormData = new FormData();

    let file = {
      uri: filePath.uri,
      type: filePath.type,
      name: filePath.fileName,
    };

    imageFormData.append("file", file, { type: "application/octet-stream" });

    const config = {
      headers: {
        // Authorization: `Bearer ${token}`,
        Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwiaWF0IjoxNjM4NDM5MzYxLCJleHAiOjE2MzkxNTkzNjF9.6w88W_vkHeq2sV1O409awYb03329NJZgj0_PdhLZq4s`,
        "Content-Type": "multipart/form-data",
      },
    };

    let variables = {
      nickname: nickName,
    };
    console.log("nickanme = ", nickName);

    imageFormData.append("data", {
      string: JSON.stringify(variables),
      type: "application/json",
    });
    console.log("요청:", formData, config);
    console.log("imageFormData: ", imageFormData);
    axios
      .post(preURL.preURL + "/profile", imageFormData, config)
      .then((res) => {
        console.log("새 프로필 보냈다!");
        console.log(res);
        Alert.alert("프로필을 변경하였습니다");
        navigation.navigate("Setting");
      })
      .catch((err) => {
        console.log("에러 발생 - 프로필 변경 : ", err.response.data);
        tokenHandling.tokenErrorHandling(err.response.data);
      });
  };
  return (
    <SafeAreaView>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        <TouchableOpacity onPress={() => navigation.navigate("Setting")}>
          <Icon size={40} color="black" name="left" />
        </TouchableOpacity>
        <Text style={{ padding: 5, fontSize: 10 }}>프로필 수정하기</Text>
      </View>
      <View
        style={{
          marginTop: 30,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <View style={styles.imgContainer}>
          {picSelected ? (
            <Image source={{ uri: filePath.uri }} style={styles.pic} />
          ) : (
            <Image
              style={styles.pic}
              source={require("../../assets/profile.png")}
            />
          )}

          <TouchableOpacity
            activeOpacity={0.5}
            style={styles.buttonStyle}
            onPress={() => chooseFile("photo")}
          >
            <Text style={styles.textStyle}>사진 선택</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.inputContainer}>
          <Text>닉네임 입력</Text>
          {/* <Text>이미 존재하는 닉네임입니다.</Text> */}
          <TextInput
            style={styles.input}
            value={nickName}
            onChange={(event) => {
              const { eventCount, target, text } = event.nativeEvent;
              setNickName(text);
            }}
          />
        </View>
        <View
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "8%",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              onClickHandler();
            }}
            style={{
              width: 347,
              height: 50,
              backgroundColor: "#89A3F5",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 15,
            }}
          >
            <Text style={{ color: "white", fontSize: 17 }}>저장하기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ChangeProfile;
const styles = StyleSheet.create({
  textContainer: {
    top: "25%",
    left: "10%",
  },
  imgContainer: {
    display: "flex",
    alignItems: "center",
  },
  pic: {
    width: 200,
    height: 200,
    margin: 0,
    borderRadius: 100,
  },
  textStyle: {
    padding: 1,
    color: "black",
  },
  buttonStyle: {
    top: "5%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "#DDDDDD",
    padding: 5,
  },
  inputContainer: {
    marginTop: "15%",
    marginLeft: "10%",
    marginRight: "10%",
  },
  input: {
    borderBottomColor: "#000",
    borderBottomWidth: 1,
  },
});
