import axios from "axios";
import React, {useEffect, useState, Component} from "react";
import {View, Text, Button, Alert, StyleSheet, Image,} from "react-native";
import MapView, {PROVIDER_GOOGLE, Marker, Callout} from "react-native-maps";
import preURL from "../../preURL/preURL";
import Icon from 'react-native-vector-icons/FontAwesome5';
import { TouchableOpacity } from "react-native-gesture-handler";
import { Searchbar } from "react-native-paper";
import Geolocation from '@react-native-community/geolocation';




const MapMain=({navigation})=>{
  

  const [markers, setMarkers] = useState(null);
  const [search, setSearch] = useState("");
  
  //search bar
  const updateSearch = (search) => {
    setSearch(search);
  };

  //load Data
  useEffect(() => {
    axios
      .get(preURL.preURL + "/locations/filter")
      .then((res) =>{
        console.log("📍지도 응답 받았다! ", res.data.data);
        setMarkers(res.data.data);
      })
      .catch((err)=>{
        console.log("📍지도 에러 발생❗️ ", err);
      });
      
      
  }, []);

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



  // const initialRegion = {
  //     latitude:{currentLaditude},
  //     longitude:{currentLongitude},
    
  // };

  
  const [initialRegion, setInitialRegion] = useState({
      
    // // latitude: 33.4099997,
    // // longitude: 126.4873745,
    // latitude : currentLaditude,
    // longitude : currentLongitude,
    // latitudeDelta: 1,
    // longitudeDelta: 1,
    
    
  })

  useEffect(()=>{setInitialRegion({
    latitude : currentLaditude,
    longitude : currentLongitude,
  })
  },[currentLaditude])

    //안드로이드용 현재위치 버튼 활성화
    const [mapWidth, setMapWidth] = useState('99%');
    const updateMapStyle = () => {
      setMapWidth('100%')
    }

  return(
    <>
      <View style = {{flex : 1}}>
        <View style={styles.searchBar}>
          <Searchbar
            placeholder="Type Here..."
            onChangeText={updateSearch}
            value={search}
          />
        </View>
        <MapView
        style={[{flex: 1}, {width : mapWidth} ]}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={true}
        showsMyLocationButton={true}
        followsUserLocation={true}
        zoomEnabled = {true}
        onPress={this.pickLocationHandler}
        // initialRegion={{
        //   latitude: initialRegion.latitude,
        //   longitude: initialRegion.longitude,
        //   latitudeDelta:1,
        //   longitudeDelta:1,
        // }}
        initialRegion={initialRegion}
        onMapReady={()=> {
          updateMapStyle()
        }}
        >
          {markers &&
            markers.map((marker)=>(
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
          
        </MapView>

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

      </View>
    </>
  );



}



const styles = StyleSheet.create({

searchBar:{
  marginLeft:15,
  marginRight:15,
  marginTop:10,
  marginBottom:45,
  top:'5%',
  backgroundColor:'transparent',

},

buttonContainer:{
  position: "absolute",
  top: '13%',
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

export default MapMain;


