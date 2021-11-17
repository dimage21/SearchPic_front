import React, { useEffect } from "react";
import { SafeAreaView, TouchableOpacity, Text, View } from "react-native";
import axios from "axios";

const Result = ({ navigation, route }) => {
  const Result = route.params;
  const Result1 = Result[0];
  const Result2 = Result[1];
  const Result3 = Result[2];

  return (
    <SafeAreaView>
      <TouchableOpacity>
        <Text>뒤로가기</Text>
      </TouchableOpacity>
      <View></View>
      <View>
        <Text>분석 결과</Text>
        <Text>Best</Text>
        <View>
          <Text>{Result1.placeName}</Text>
          <Text>{Result1.address}</Text>
        </View>
      </View>
      <View>
        <Text>비슷한 장소 더보기</Text>
        <View>
          <View>
            <Text>{Result2.placeName}</Text>
            <Text>{Result2.address}</Text>
          </View>
        </View>
        <View>
          <View>
            <Text>{Result3.placeName}</Text>
            <Text>{Result3.address}</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Result;
