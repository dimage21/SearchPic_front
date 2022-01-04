import React from 'react';
import { View, Button, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

const AddPlaceMain = ({navigation}) =>{
  return(
    <>
        <View style ={{
            alignItems : 'center',
            justifyContent : 'center'
        }}>
            <Text style ={{
                fontSize:30,
                marginBottom:10,
                marginTop:100,
                }}
            >
                써픽에 포토스팟이 없나요?
            </Text>
            <Text style ={{
                fontsize:25,
                margin: 10,
                marginBottom:30,
            }}>
                알고 있거나 새로 발견한 포토스팟이 써픽에 없다면 알려주세요.{"\n"}
                우리 함께 공유해요!
            </Text>
            <View>
            <TouchableOpacity 
                style ={{
                    backgroundColor: "#ffffff",
                    padding:16,
                    margin: 10,
                    }}
                onPress={()=>navigation.navigate("Upload")}
            >
                <Text style={{color:"#000000", fontsize: 20}}>
                신규 포토스팟 제보하기
                </Text>
            </TouchableOpacity>
            <TouchableOpacity style ={{
                backgroundColor: "#ffffff",
                padding:16,
                margin: 10,
                }}
                onPress={()=>navigation.navigate("MapMain")}
            >
                <Text style={{color:"#000000", fontsize: 20}}>
                다시 확인 해보기
                </Text>
            </TouchableOpacity>
            </View>
        </View>
    

    </>
   );
};

export default AddPlaceMain;
