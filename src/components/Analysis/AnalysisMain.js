import React, { useState, useEffect } from "react";
import {
  Text,
  Image,
  StyleSheet,
  View,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
  SafeAreaView,
} from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import preURL from "../../preURL/preURL";

const Profile = ({ navigation }) => {
  const [filePath, setFilePath] = useState({});
  const [picSelected, setPicSelected] = useState(false);
  const [token, setToken] = useState("");
  const [result, setResult] = useState();
  const [loading, setLoading] = useState(false);

  const getUserToken = async () => {
    const userToken = await AsyncStorage.getItem("userToken");
    setToken(userToken);
    console.log("userToken ", userToken);
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
      setFilePath(assets);
      console.log(assets);
      console.log("filePath:", filePath);
      setPicSelected(!picSelected);
    });
  };

  const onClickHandler = (event) => {
    let isMount = true;

    const formData = new FormData();

    const imageFormData = new FormData();

    let file = {
      uri: filePath.uri,
      type: filePath.type,
      name: filePath.fileName,
    };

    imageFormData.append("image", file, { type: "application/octet-stream" });

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    };

    console.log("요청:", formData, config);
    console.log("imageFormData: ", imageFormData);
    axios
      .post(preURL.preURL + "analysis", imageFormData, config)
      .then((res) => {
        setLoading(true);
        console.log("사진 보냈다!");
        setResult(res.data);
        console.log("res.data", res.data);
        console.log("result", result);
      })
      .catch((err) => {
        console.log("에러 발생 ");
        console.log(err);
      });

    return () => {
      isMount = false;
    };
  };
  useEffect(() => {
    return () => setLoading(false); // cleanup function을 이용
  }, []);

  console.log(result);
  return (
    <SafeAreaView style={{ backgroundColor: "white", flex: 1 }}>
      <View
        style={{
          height: 50,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 20 }}>분석하기</Text>
      </View>
      <View>
        <View style={styles.imgContainer}>
          {picSelected ? (
            <Image
              source={{ uri: filePath.uri }}
              style={styles.pic}
              onPress={onClickHandler()}
            />
          ) : (
            <View
              style={{ height: "100%", width: "100%", backgroundColor: "gray" }}
            />
          )}
        </View>
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.buttonStyle}
          onPress={() => chooseFile("photo")}
        >
          <Text style={styles.textStyle}>사진 선택</Text>
        </TouchableOpacity>
        <View>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Result", { result: result.data });
            }}
          >
            <Text>다음</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  textContainer: {
    left: "10%",
  },
  imgContainer: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    height: 500,
  },
  pic: {
    width: "100%",
    height: "100%",
    margin: 0,
  },
  textStyle: {
    padding: 1,
    color: "black",
  },
  buttonStyle: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "#DDDDDD",
    padding: 5,
  },
});
