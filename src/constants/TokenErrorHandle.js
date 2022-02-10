// Token Error Handling 함수
export function tokenErrorHandling(err) {
  const errorCode = err.errorCode;
  const getUserToken = async () => {
    const userToken = await AsyncStorage.getItem("userToken");
    const refreshToken = await AsyncStorage.getItem("refreshToken");
    console.log("userToken ", token);
    const config = {
      headers: {
        "refresh-token": refreshToken,
      },
    };

    if (errorCode == "T001" || T001 || "T002" || T002 || "T003" || T003) {
      axios
        .get(preURL.preURL + "reissue/access-token", config)
        .then((res) => {
          console.log("응답 받았다! - 엑세스 토큰", res.data);
          AsyncStorage.setItem("userToken", res.data.accessToken);
          AsyncStorage.setItem("refreshToken", res.data.refreshToken);
        })
        .catch((err) => {
          console.log("에러 발생❗️ - 엑세스 토큰 재발급", err);
        });
    }
  };
  getUserToken();
}
