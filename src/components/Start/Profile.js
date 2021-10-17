import React, { useEffect, useState } from "react";
import {
  Text,
  Image,
  StyleSheet,
  View,
  TouchableOpacity,
  TextInput,
  Platform,
  PermissionsAndroid,
  SafeAreaView,
  Alert,
} from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Profile = ({ navigation }) => {
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
    // formData.append(
    //   "file",
    //   filePath.uri,
    //   filePath.width,
    //   filePath.height,
    //   filePath.fileSize,
    //   filePath.type,
    //   filePath.fileName
    // );

    const imageFormData = new FormData();

    let file = {
      uri: filePath.uri,
      type: filePath.type,
      name: filePath.fileName,
    };

    imageFormData.append("file", file, { type: "application/octet-stream" });

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    };

    let variables = {
      nickname: nickName,
    };
    console.log("nickanme = ", nickName);

    imageFormData.append("data", {
      //new Blob(variables, { type: "application/json" })
      string: JSON.stringify(variables),
      type: "application/json",
      //JSON.stringify(variables)
    });
    console.log("요청:", formData, config);
    console.log("imageFormData: ", imageFormData);
    axios
      .post("http://192.168.19.25:8080/profile", imageFormData, config)
      // .post("http://192.168.19.25:8080/test", null, config)
      .then((res) => {
        console.log("토큰 보냈다!");
        console.log(res);
        Alert.alert(`${nickName}님 환영합니다!`);
      })
      .catch((err) => {
        console.log("에러 발생 ");
        console.log(err);
      });
  };

  return (
    <SafeAreaView style={{ backgroundColor: "white", flex: 1 }}>
      <View>
        <View style={styles.textContainer}>
          <Text style={{ color: "#89A3F5" }}>어딘지 알고 싶은 SNS 속 장소</Text>
          <Text style={{ fontSize: 25 }}>사진 속 장소를 알아 볼까요?</Text>
        </View>
        <View>
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
              top: "50%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "10%",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("NavTabs");
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
              <Text style={{ color: "white", fontSize: 17 }}>시작하기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  textContainer: {
    top: "25%",
    left: "10%",
  },
  imgContainer: {
    top: "40%",
    display: "flex",
    alignItems: "center",
  },
  pic: {
    width: 200,
    height: 200,
    top: "15%",
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
    top: "40%",
    marginTop: "15%",
    marginLeft: "10%",
    marginRight: "10%",
  },
  input: {
    borderBottomColor: "#000",
    borderBottomWidth: 1,
  },
});
