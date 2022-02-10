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
  Alert,
} from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import preURL from "../../preURL/preURL";
import Icon from "react-native-vector-icons/FontAwesome5";
import * as tokenHandling from "../../constants/TokenErrorHandle";

const AnalysisMain = ({ navigation }) => {
  const [filePath, setFilePath] = useState({});
  const [token, setToken] = useState("");
  let [result, setResult] = useState({});
  const [loading, setLoading] = useState(false);
  const [process, setProcess] = useState(false);

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
  }, []);

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
        console.log("res.data: ", res.data);
        console.log("result: ", result);
        Alert.alert("이미지 분석", "분석을 진행하시려면 다음을 눌러주세요", [
          {
            text: "다시 선택",
            style: "cancel",
          },
          {
            text: "다음",
            onPress: () => {
              console.log("Result.data => params: ", result.data),
                navigation.navigate("Result", { result: res.data });
            },
          },
        ]);
      })
      .catch((err) => {
        console.log("에러 발생 ", err);
        tokenHandling.tokenErrorHandling();
      });

    return () => {
      isMount = false;
    };
  };

  const chooseFile = () => {
    requestExternalWritePermission();

    let options = {
      mediaType: "photo",
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
      setProcess(true);
    });
  };

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
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => chooseFile()}
          style={{
            width: "100%",
            height: "75%",
            displa: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Icon size={100} color="#001A72" name="upload" />
        </TouchableOpacity>
        {process ? (
          <Text style={{ textAlign: "center" }}>
            분석을 원하시면 다음을 눌러주세요{" "}
          </Text>
        ) : (
          <Text style={{ textAlign: "center" }}>
            위 아이콘을 클릭해 사진을 선택해주세요
          </Text>
        )}
        <TouchableOpacity
          onPress={() => {
            onClickHandler();
          }}
          style={{
            width: "70%",
            height: "8%",
            backgroundColor: "#001A72",
            borderRadius: 15,
            alignSelf: "center",
            marginTop: "3%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
            다음
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default AnalysisMain;

const styles = StyleSheet.create({
  textContainer: {
    left: "10%",
  },

  pic: {
    width: "100%",
    height: "100%",
    margin: 0,
  },
});
