import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import preURL from "../preURL/preURL";

// Token Error Handling 함수
function tokenErrorHandling(err) {
  console.log("err : ", err);
  const errorCode = err.errorCode;
  console.log("errorCode : ", errorCode);
  const getUserToken = async () => {
    const userToken = await AsyncStorage.getItem("userToken");
    const refreshToken = await AsyncStorage.getItem("refreshToken");
    console.log("userToken ", userToken);
    console.log("refreshToken ", refreshToken);

    const config = {
      headers: {
        "refresh-token": refreshToken,
      },
    };
    console.log("config-test : ", config);
    if (errorCode == "T001" || "T002" || "T003") {
      axios
        .get(preURL.preURL + "/reissue/access-token", config)
        .then((res) => {
          console.log("응답 받았다! - 엑세스 토큰", res.data);
          AsyncStorage.setItem("userToken", res.data.accessToken);
          AsyncStorage.setItem("refreshToken", res.data.refreshToken);
        })
        .catch((err) => {
          console.log(
            "TokenErrorHandle 에러 발생❗️ - 엑세스 토큰 재발급",
            err.response.data
          );
        });
    }
  };
  getUserToken();
}
export { tokenErrorHandling };
