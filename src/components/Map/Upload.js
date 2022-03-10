import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {Text, View, StyleSheet, Image, SafeAreaView, Alert, TextInput, ScrollView} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import Tags from "react-native-tags";
import preURL from "../../preURL/preURL";
import * as tokenHandling from "../../constants/TokenErrorHandle";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Exif from '@notech/react-native-exif';
import Geolocation from '@react-native-community/geolocation';

const Upload = ({navigation}) =>{
    const [token, setToken] = useState("");

    const [filePath, setFilePath] = useState({});
    const [picSelected, setPicSelected] = useState("");
    const [memo, setMemo] = useState("");
    const [keyWord, setKeyWord] = useState([]);
    const [process, setProcess] = useState(false);
    const [result, setResult] = useState([]);


    // filePath (이미지데이터),  picSelected, memo, tags, token

    console.log("======================[새로운 장소 등록]===================");

    const getUserToken = async () => {
        const userToken = await AsyncStorage.getItem("userToken");
        setToken(userToken);
        console.log("userToken ", userToken);
        setToken(
          'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwiaWF0IjoxNjQ1NTMwNDQ5LCJleHAiOjE2NDc2Nzc5MzN9.65q5K9uUUeCrXt7ZckdaKhheKPBROrSBrbX8TqdKVTk'
        );
    };
    
    const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
    };
    
    useEffect(() => {
        getUserToken();
        console.log("토큰: ", token);
    }, []);

    
    useEffect(() => {
        console.log("config: ", config);
        getMemberInfo();
    }, [token]);
    
    const getMemberInfo = () => {
        axios
          .get(preURL.preURL + "/profile", config)
          .then((res) =>{
            console.log("📍유저정보 받았다! ", res.data.data);
            // setUploadMarkers(res.data.data);
          })
          .catch((err)=>{
            console.log("📍유저정보 에러 발생❗️ ", err);
            tokenHandling.tokenErrorHandling();
          });
    };

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
    
    
    const TakePhoto = () => {
        

            
        let options = {
            mediaType: "photo",
            cameraType: "back",
            includeBase64: true,
            saveToPhotos: true,
            storageOptions: {
                    skipBackup: true,
                    path: 'images',
            },
        };
        launchCamera(options, (response) => {
            // console.log('📸사진업로드 사진촬영 : ', response);
            const assets = response.assets[0];
            Exif.getExif(assets.uri)
                .then((msg) => {
                    console.log('이미지정보: ' + JSON.stringify(msg));
                    setPicSelected(msg);
                })
                .catch(msg => console.log('ERROR: ' + msg));

            // Exif.getLatLong(picSelected)
            //     .then(({latitude, longitude}) => {
            //         console.log('OK(LatLong): ' + latitude + ', ' + longitude);
            //     })
            //     .catch(msg=>console.warn('ERROR : '+msg))

            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error){
                console.log('ImagePicker Error: ', response.error);
            } else if (response.custonButton){
                console.log('User tapped custom button: ', response.customButtom);
                alert(response.customButton);
            } 
              
            setFilePath(assets);
            // console.log(assets);
            // console.log("filePath:", filePath);
            setProcess(true);
            console.log("📸장소uri:", assets.uri);

            

        });

    }
    
    const ImagePicker = () => {
        requestExternalWritePermission();
        
        // let launchImageLibrary = require('react-native-image-picker');
        let options = {
          mediaType: "photo",
          cameraType : 'back',
          maxWidth: 300,
          maxHeight: 550,
          quality: 1,
          allowsEditing: false,
          noData : true,
        };
        launchImageLibrary(options, (response) => {
            // console.log("Response = ", response);
            const assets = response.assets[0];
            Exif.getExif(assets.uri)
                .then(msg => console.log('이미지정보: ' + JSON.stringify(msg)))
                .catch(msg => console.log('ERROR: ' + msg));
            
            // Exif.getLatLong(picSelected)
            //     .then(({latitude, longitude}) => {
            //         console.log('OK(LatLong): ' + latitude + ', ' + longitude);
            //     })
                // .catch(msg=>console.warn('ERROR : '+msg))
            // Exif.getLatLong(assets.uri)
            //     .then(({latitude, longitude}) => {
            //         console.warn('OK(LatLong): ' + latitude + ', ' + longitude
            //         )})
            //     .catch(msg => console.warn('ERROR: ' + msg))

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
            // console.log(assets);
            // console.log("filePath:", filePath);
            setProcess(true);

            console.log("📸장소uri:", assets.uri);
            
            // console.log("📸장소logitude:", response.longitude);
            // console.log("📸장소latitude:", response.latitude);

        });
        
        
    };


    
    const [currentLaditude, setCurrentLaditude] = useState();
    const [currentLongitude, setCurrentLongitude] = useState();

  
    useEffect(()=> {
        Geolocation.getCurrentPosition((info) => {
            console.log('현재 위치 정보', info);
            console.log('현재 latitude 정보 : ',info.coords.latitude);
            console.log('현재 longitude 정보 : ',info.coords.longitude);
            setCurrentLaditude(info.coords.latitude);
            setCurrentLongitude(info.coords.longitude);
    });
    
  },[]);
    
    const onClickHandler = (event) =>{
        const imageFormData = new FormData();
        
        let image = {
            uri : filePath.uri,
            type: filePath.type,
            name: filePath.fileName,
            latitude : currentLaditude,
            longitude : currentLongitude,
        };

        console.log("image 출력 ", image)

        imageFormData.append("image", image,{ type: "application/octet-stream" });

        const config = {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
        };

        let data = {
            memo : memo,
            tags : keyWord,
        };
        // console.log("memo = ", memo);
        // console.log("tags = ", keyWord);

        console.log ("data 출력 ", data)
        console.log ("data stringify ", JSON.stringify(data))
        imageFormData.append("data", {
            string: JSON.stringify(data),
            type: "application/json",
        });
        
        console.log("long = "+currentLongitude + " lat: "+currentLaditude)
        console.log("imageFormData : ", imageFormData);
        console.log("post : ", preURL.preURL + "/post?x="+currentLongitude+"&y="+currentLaditude)
        axios
            .post(preURL.preURL + "/post?x="+currentLongitude+"&y="+currentLaditude, imageFormData, config)
            .then((res)=>{
                console.log("새로운 장소 정보 보냈다!");
                console.log(res);
                Alert.alert("새로운 장소를 등록하였습니다");
                navigation.navigate("MapMain");
            })
            .catch((err)=>{
                console.log("장소 등록 에러 발생 ");
                console.log(err)
                tokenHandling.tokenErrorHandling();
            });
    };

    return(
        <>
        <SafeAreaView style={{ flex: 1, padding: 15, backgroundColor: "#ffffff" }}>
            <View
                style={{
                height: 50,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                }}
            >
                <Text style={{ fontSize: 18, fontWeight: "bold", paddingTop: 10}}>
                    새로운 장소 등록
                </Text>
            </View>

            <ScrollView>
            <View  style={{ paddingLeft: "5%", paddingRight: "5%" }}>
                <View>
                    <Text style={{ fontSize: 15, fontWeight: "bold" }}>사진업로드(필수)</Text>
                    <Text style={{
                        fontsize:5,
                        color:'#c4c4c4',
                        margin:10,
                    }}>
                    업로드하는 사진은 반드시 포토스팟에서 찍은 사진이어야합니다. {"\n"}
                    다운로드한 사진을 사용할 경우 잘못된 위치정보가 표시 될 수 있습니다.{"\n"}
                    포토스팟을 촬영한 장소에서 업로드하시는 것을 권장해드립니다.
                    </Text>
                </View>
                <View>
                    <View style={styles.imgContainer}>
                    
                        <Image 
                            source={{ uri: filePath.uri }} style={styles.pic}
                        />
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style = {styles.button1}  
                                            onPress={TakePhoto}
                            >
                                <Text style={{color:'black', fontsize: 10}}>
                                사진 촬영
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style ={styles.button2}
                                            onPress={ImagePicker}
                            >
                                <Text style={{color:'black', fontsize: 10}}>
                                갤러리
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
            
   
            <View  style={{ paddingLeft: "5%", paddingRight: "5%", marginTop:30 }}>
                <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                    해시태그 (필수)
                </Text>
                <View style={styles.imgContainer}>
                    <Tags
                        initialText="태그 ..."
                        textInputProps={{
                        placeholder: "검색하실 태그를 입력해주세요",
                        }}
                        onChangeTags={(tags) => {
                        console.log(tags);
                        setKeyWord(tags);
                        // setResultPage(true);
                        if (tags == "") {
                            setResult([]);
                        }
                        }}
                        onTagPress={(index, tagLabel, event, deleted) =>
                        console.log(
                            index,
                            tagLabel,
                            event,
                            deleted ? "deleted" : "not deleted"
                        )
                        }
                        containerStyle={{ justifyContent: "center" }}
                        inputStyle={{
                        backgroundColor: "white",
                        borderBottomColor: "#000",
                        borderBottomWidth: 1,
                        }}
                        maxNumberOfTags={5}
                        renderTag={({ tag, index, onPress, deleteTagOnPress, readonly }) => (
                        <TouchableOpacity
                            key={`${tag}-${index}`}
                            onPress={onPress}
                            style={{
                            padding: 7,
                            backgroundColor: "#D0DBFB",
                            borderRadius: 10,
                            margin: 2,
                            }}
                        >
                            <Text>{tag}</Text>
                        </TouchableOpacity>
                        )}
                    />
                    
                </View>
            </View>
            <View  style={{ paddingLeft: "5%", paddingRight: "5%", marginTop:30 }}>
                <Text style={{ fontSize: 15, fontWeight: "bold"}}>
                    기타 기록사항
                </Text>
                <View style={styles.imgContainer}>
                    <TextInput 
                        style={{width: 300,
                            height: 100,
                            margin: 10,
                            borderWidth: 1,
                            borderColor: "#c4c4c4",
                            textAlignVertical: 'top',}}
                        value={memo}
                        multiline={true}
                        onChange={(event)=>{
                            const { eventCount, target, text }= event.nativeEvent;
                            setMemo(text);
                            console.log(memo);
                        }}/>
                    
                </View>
            </View>
            <View
                style={{
                // display: "flex",
                flexDirection : 'row',
                justifyContent: "center",
                alignItems: "center",
                marginTop: "10%",
                }}>
                <TouchableOpacity
                    onPress={() => {
                        onClickHandler()
                    }}
                    style={{
                    width: 100,
                    height: 50,
                    backgroundColor: "#001A72",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 15,
                    margin: 10,
                    }}
                >
                    <Text style={{ color: "white", fontSize: 17 }}>저장하기</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate('MapMain')
                    }}
                    style={{
                    width: 100,
                    height: 50,
                    backgroundColor: "#c4c4c4",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 15,
                    margin : 10,
                    }}
                >
                    <Text style={{ color: "black", fontSize: 17 }}>취소하기</Text>
                </TouchableOpacity>
            </View>
            </ScrollView>
        </SafeAreaView>
        </>
    );
};

export default Upload;

const styles = StyleSheet.create({
    imgContainer: {
      alignItems: "center",
    //   flex:1,
    },
    pic: {
      width: 300,
      height: 200,
      margin: 10,
      borderWidth: 1,
      borderColor: "#c4c4c4",
      
      
    },    
    buttonContainer:{
        flexDirection: 'row',
        height: 50,
    },

    button1: {
        width : 120,
        flex: 1,
        backgroundColor: "#c4c4c4",
        margin: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },

    button2: {
        width : 120,
        flex: 1,
        backgroundColor: "#c4c4c4",
        margin: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
  });