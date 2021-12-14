import axios from "axios";
import React, {useEffect, useState, Component} from "react";
import {View, Text, Button, Alert, StyleSheet} from "react-native";
import MapView, {PROVIDER_GOOGLE, Marker} from "react-native-maps";
import preURL from "../../preURL/preURL";
import Icon from 'react-native-vector-icons/FontAwesome5';
import { TouchableOpacity } from "react-native-gesture-handler";



function MapMain(){


    useEffect(() => {
      axios
        .get(preURL.preURL + "/locations/filter")
        .then((res) =>{
          console.log("지도 응답 받았다! ", res.data.data);
          setPData(res.data.data);
        })
        .catch((err)=>{
          console.log("지도 에러 발생❗️ ", err);
        });
    }, []);

    //initialRegion
    const [initialRegion, setInitalResion] = useState({
      latitude: 33.4099997,
              longitude: 126.4873745,
              latitudeDelta: 1,
              longitudeDelta: 1,
    })
    


    //안드로이드용 현재위치 버튼 활성화
    const [mapWidth, setMapWidth] = useState('99%');
    const updateMapStyle = () => {
      setMapWidth('100%')
    }
    return(
      <>
        <View style = {{flex : 1}}>
          <MapView
          style={[{flex: 1}, {width : mapWidth} ]}
          provider={PROVIDER_GOOGLE}
          showsUserLocation={true}
          showsMyLocationButton={true}
          followsUserLocation={true}
          zoomEnabled = {true}
          onPress={this.pickLocationHandler}
          initialRegion={initialRegion}
          onMapReady={()=> {
            updateMapStyle()
          }}
          >
            <Marker 
              coordinate={{latitude: 33.3668332375839, longitude: 126.8392976867628}}
              pinColor="green" />
            <Marker coordinate={{latitude: 33.4980830807144,
              longitude: 126.67895539907}} />
            <Marker coordinate={{latitude: 33.3448722920323,
              longitude: 126.177301119874}} />
            <Marker coordinate={{latitude: 33.5090070967958,
              longitude: 126.714410471388}} />
            <Marker coordinate={{latitude: 33.2277786011446,
              longitude: 126.303481143838}} />
            <Marker coordinate={{latitude: 33.5529420329351,
              longitude: 126.700002492755}} />

            <Marker coordinate={{latitude: 33.5091180133618,
              longitude: 126.471338444636}} />
            <Marker coordinate={{latitude: 33.3469077943428,
              longitude: 126.327959363756}} />
            <Marker coordinate={{latitude: 33.3469077943428,
              longitude: 126.418983291223}} />
            <Marker coordinate={{latitude: 33.5102135261307,
              longitude: 126.889154915199}} />
            <Marker coordinate={{latitude: 33.5177055816553,
              longitude: 126.523314612444}} />
            <Marker coordinate={{latitude: 33.3774305792331,
              longitude: 126.873289850307}} />
            <Marker coordinate={{latitude: 33.2619169247023,
              longitude: 126.60492147759021}} />
            <Marker coordinate={{latitude: 33.50183925461958,
              longitude: 126.45209747435574}} />
            <Marker coordinate={{latitude: 33.4303100265707,
            longitude: 126.45209747435574}} />

          </MapView>
          <View style={styles.addPhotoContainer}>
            <TouchableOpacity
            onPress={()=>Alert.alert('사진추가페이지로 이동')}
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

  addPhotoContainer:{
    position: "absolute",
    top: '83%',
    left:"84%",
   
  }

})

export default MapMain;

