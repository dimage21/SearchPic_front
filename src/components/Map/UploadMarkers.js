import axios from "axios";
import React, {useEffect, useState, Component} from "react";
import {View, Text, Button, Alert, StyleSheet, Image,Feather} from "react-native";
import MapView, {PROVIDER_GOOGLE, Marker, Callout} from "react-native-maps";
import preURL from "../../preURL/preURL";
import * as tokenHandling from "../../constants/TokenErrorHandle";
import Icon from 'react-native-vector-icons/FontAwesome5';
import { TouchableOpacity } from "react-native-gesture-handler";
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AutocompleteDropdown } from "react-native-autocomplete-dropdown";






const UploadMarkers=({navigation})=>{  
  const [token, setToken] = useState("");

  const [uploadmarkers, setUploadMarkers] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [nearPlace, setNearPlace] = useState(null);
  const [selectedLat, setSelectedLat] = useState('');
  const [selectedLong, setSelectedLong] = useState('');
  const [location, setLocation] = useState(null);
  
  console.log("======================[내가 좋아요한 장소]===================");

  const getUserToken = async () => {
    const userToken = await AsyncStorage.getItem("userToken");
    setToken(userToken);
    console.log("userToken ", userToken);
    setToken(
      "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwiaWF0IjoxNjQ1NTMwNDQ5LCJleHAiOjE2NDc2Nzc5MzN9.65q5K9uUUeCrXt7ZckdaKhheKPBROrSBrbX8TqdKVTk"
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


  //search bar Data
  const updateSearch = (searchQuery) => {
    setSearchQuery(searchQuery);
    console.log("🔍검색창 : ", searchQuery)
    axios
      .get(preURL.preURL + '/api/locations?query='+searchQuery)
      .then((res) => {
              console.log("🔍지도검색 응답 받았다! ", res.data.data);
              setNearPlace(res.data.data);
            })
      .catch((err) => {
               console.log("🔍지도검색 에러 발생❗️ ", err);
            });
    
  };
  

  //load Liked Location Data
  const getMemberInfo = () => {
    axios
      .get(preURL.preURL + "/locations/filter/member", config)
      .then((res) =>{
        console.log("📍업로드된 장소 응답 받았다! ", res.data.data);
        setUploadMarkers(res.data.data);
      })
      .catch((err)=>{
        console.log("📍업로드된 장소 에러 발생❗️ ", err);
        tokenHandling.tokenErrorHandling();
      });
  };



  //Get User's Current Position
  useEffect(() => { 
    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords
        setLocation({ latitude, longitude })
      },
      error => {
        console.log(error.code, error.message)
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    )
  }, [])

    //안드로이드용 현재위치 버튼 활성화
    const [mapWidth, setMapWidth] = useState('99%');
    const updateMapStyle = () => {
      setMapWidth('100%')
    }
  
  
    
  

  return(
    <>
    <View style = {{flex : 1}}>

        
        { location && (
        <MapView
        style={[{flex: 1}, {width : mapWidth} ]}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={true}
        showsMyLocationButton={true}
        followsUserLocation={true}
        zoomEnabled = {true}
        onPress={this.pickLocationHandler}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta:1,
          longitudeDelta:1,
        }}
        // initialRegion={initialRegion}
        onMapReady={()=> {
          updateMapStyle()
        }}
        >
          {uploadmarkers &&
            uploadmarkers.map((marker)=>(
              <Marker
                coordinate={{
                  id : marker.id,
                  latitude : marker.y,
                  longitude: marker.x,
                }}
              >
                <Callout tooltip>
                  <View>
                    <View style={styles.bubble}>
                      <Text style={styles.name}>{marker.placeName}</Text>
                      <Text>{marker.address}</Text>   
                      <Image
                        style={styles.image}
                        source={{
                          url : marker.imageUrl
                        }}
                      />                   
                    </View>
                    <View style={styles.arrowBorder}/>
                    <View style={styles.arrow}/>

                  </View>
                </Callout>
              </Marker>
            ))}
        
        </MapView>)}

        {/* 상단 버튼 3개 */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={{
              backgroundColor: "#ffffff",
              borderColor:"#188716",
              borderWidth:2,
              borderRadius:10,
              margin:5,
              padding:8,        
              }}
              onPress={()=>navigation.navigate("MapMain")}
          >
            <Text>전체보기</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: "#ffffff",
              borderColor:"#2B49E4",
              borderWidth:2,
              borderRadius:10,
              margin:5,
              padding:8,  }}
              onPress={()=>navigation.navigate("UploadMarkers")}
          >
            <Text>내가 업로드한 장소</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: "#ffffff",
              borderColor:"#FE7D05",
              borderWidth:2,
              borderRadius:10,
              margin:5,
              padding:8,  
            }}
            onPress={()=>navigation.navigate("LikedMarkers")}
          >
            <Text>내가 좋아요한 장소</Text>
          </TouchableOpacity>
        </View>
          
        {/* 포토스팟 추가버튼 */}
        <View style={styles.addPhotoContainer}>
          <TouchableOpacity
          onPress={()=>navigation.navigate("AddPlaceMain")}
          style={{
            width:"100%", height:"100%", displa: "flex", justifyContent:"center", alignItems:"center",}}
          >
            <Icon         
            name="plus-circle"
            size={50}
            color="#001A72"
            />
          </TouchableOpacity>

        </View>

        {/* 검색창 */}
        <View style={styles.searchBar}>
            <AutocompleteDropdown
              clearOnFocus={false}
              closeOnBlur={true}
              closeOnSubmit={false}
              dataSet={nearPlace}
              onChangeText={updateSearch}
              textInputProps={{
                placeholder: "위치검색",
                autoCorrect: false,
                autoCapitalize: "none",
                style: {
                  borderRadius: 15,
                  backgroundColor: "white",
                  color: "black",
                  paddingLeft: 18
                }
              }}
              rightButtonsContainerStyle={{
                borderRadius: 15,
                right: 8,
                height: 30,
                top: 5,
                alignSelfs: "center",
                backgroundColor: "white"
              }}
              suggestionsListContainerStyle={{
                backgroundColor: "white"
              }}
              containerStyle={{ flexGrow: 1, flexShrink: 1 }}
              renderItem={(item, text) => (
                <Text style={{ color: "black", padding: 15 }}>{item.placeName}</Text>
              )}
              onSelectItem={item =>{
                item && setSelectedLat(item.y);
                item && setSelectedLong(item.x);
              }}
            />
        </View>


    </View>
    </>
  );


}


const styles = StyleSheet.create({

searchBar:{
  position : "absolute",
  top:"5%",
  alignSelf:'center',
  backgroundColor:'white',
  width: "95%",
  height:0,
},

buttonContainer:{
  position: "absolute",
  top: '10%',
  flexDirection: 'row',
  alignSelf:'center',
  backgroundColor: 'transparent',
  margin: 5,
},

allPlaceButton:{
  backgroundColor: "#ffffff",
  borderColor:"#c4c4c4",
  borderRadius:10,
  margin:15,
  padding:10,
},
uploadedButton:{
  backgroundColor: "#ffffff",
  borderColor:"#c4c4c4",
  borderRadius:10,
  margin:15,
  padding:10,
},
likedButton:{
  backgroundColor: "#ffffff",
  borderColor:"#c4c4c4",
  borderRadius:10,
  margin:15,
  padding:10,
},

addPhotoContainer:{
  position: "absolute",
  top: '83%',
  left:"84%",

},
bubble: {
  flexDirection: 'column',
  alignSelf: 'flex-start',
  backgroundColor:'#ffffff',
  borderRadius: 6,
  borderColor: "#C4C4C4",
  borderWidth: 0.5,
  padding: 15,
  width:150,
},
name:{
  fontSize:16,
  marginBottom:5,
},
arrow:{
  backgroundColor: 'transparent',
  borderColor: 'transparent',
  borderTopColor: '#ffffff',
  borderWidth:16,
  alignSelf:'center',
  marginTop:-32,
},
arrowBorder: {
  backgroundColor: 'transparent',
  borderColor: 'transparent',
  borderTopColor: '#007a87',
  borderWidth:16,
  alignSelf:'center',
  marginTop:-0.5,
},
image:{
  width:120,
  height:80,
  marginTop: 5,
}

})

export default UploadMarkers;