// import { render } from "matter-js";
import React, {Component} from "react";
import { 
  StyleSheet
 } from "react-native";
 import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';

 export default class MapMain extends Component(){
   
  render(){
    return(
      <MapView
      provider={PROVIDER_GOOGLE}
      style={styles.map}
    
      region={{
        latitude: 37.551399,
        longitude: 126.915423,
        latitudeDelta: 0.09,
        longitudeDelta: 0.035
      }}>

      </MapView>
    );
  }
      
 };


 const styles = StyleSheet.create({
   map: {
     height: '100%'
   }
 });


// const MapMain = () => {
//   return <Text>Map</Text>;
// };

// export default MapMain;