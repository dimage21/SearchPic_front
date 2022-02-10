import axios from 'axios';
import React, { useCallback, useState } from 'react';
import {Text, View, Button,StyleSheet, Image} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';


const Upload = () =>{

    const [filePath, setFilePath] = useState({});
    const [process, setProcess] = useState(false);
    const [callback, useCallback]= useState();

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
    
    // const TakePhoto = () => {
    //     let options = {
    //         mediaType: "photo",
    //         cameraType: "back",
    //         includeBase64: true,
    //         saveToPhotos: true,
    //     };
    //     launchCamera(options, useCallback);

    // }

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
                // console.log("asset:", assets);
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
            // console.log("asset:", assets);
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
            console.log("📸장소logitude:", response.longitude);
            console.log("📸장소latitude:", response.latitude);

        });
    };
    
    const onClickHandler = (event) =>{
        const formData = new FormData();

        const imageFormData = new FormData();

        let file = {
            uri : filePath.uri,
            type: filePath.type,
            name: filePath.fileName,
        };

        imageFormData.append("file", file,{ type: "application/octet-stream" });

        const config = {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
        };

        console.log("사진추가요청:", formData, config);
        console.log("imageFormData: ", imageFormData);

          
        
    }
    
    return(
        <>
        <View>
            <View>
                <Text style={{
                    fontSize:20,
                    color:"#000000",
                    margin:10,
                    marginTop:50,
                }}>
                    사진업로드 (필수)
                </Text>
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
                
                    <Image source={{ uri: filePath.uri }} style={styles.pic} >
                        
                    </Image>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style = {styles.button1}  
                                          onPress={TakePhoto}
                        >
                            <Text style={{color:"#000000", fontsize: 10}}>
                            사진 촬영
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style ={styles.button2}
                                          onPress={ImagePicker}
                        >
                            <Text style={{color:"#000000", fontsize: 10}}>
                            갤러리
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            
        </View>
        </>
    );
};

export default Upload;

const styles = StyleSheet.create({
    imgContainer: {
      alignItems: "center",
      flex:1,
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
  
  


