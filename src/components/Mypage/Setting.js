import React from "react";
import {
  SafeAreaView,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
} from "react-native";
import Icon from "react-native-vector-icons/AntDesign";

const Setting = ({ navigation }) => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <View style={{ padding: 15 }}>
        <TouchableOpacity onPress={() => navigation.navigate("MypageMain")}>
          <Icon size={40} color="black" name="close" />
        </TouchableOpacity>
      </View>
      <View
        style={{
          borderBottomColor: "gray",
          borderBottomWidth: 0.5,
          padding: 5,
        }}
      >
        <TouchableOpacity style={styles.line}>
          <Text style={styles.text}>프로필 수정</Text>
          <Icon size={40} color="black" name="right" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.line}>
          <Text style={styles.text}>로그아웃</Text>
          <Icon size={40} color="black" name="right" />
        </TouchableOpacity>
      </View>
      <View style={{ padding: 5 }}>
        <TouchableOpacity style={styles.line}>
          <Text style={styles.text}>도움말</Text>
          <Icon size={40} color="black" name="right" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.line}>
          <Text style={styles.text}>이용 약관</Text>
          <Icon size={40} color="black" name="right" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.line}>
          <Text style={styles.text}>버전 정보</Text>
          <Icon size={40} color="black" name="right" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Setting;

const styles = StyleSheet.create({
  line: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginLeft: 15,
    marginRight: 15,
    marginTop: 10,
    marginBottom: 10,
  },
  text: { fontSize: 18 },
});
