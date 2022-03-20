import axios from "axios";
import React, { useEffect, useState, Component } from "react";
import {
  View,
  Text,
  Button,
  Alert,
  StyleSheet,
  Image,
  Modal,
  FlatList,
} from "react-native";
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from "react-native-maps";
import preURL from "../../preURL/preURL";
import * as tokenHandling from "../../constants/TokenErrorHandle";
import Icon from "react-native-vector-icons/FontAwesome5";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Searchbar } from "react-native-paper";
import Geolocation from "@react-native-community/geolocation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AutocompleteDropdown } from "react-native-autocomplete-dropdown";
import GestureRecognizer from "react-native-swipe-gestures";

const MapMain = ({ navigation }) => {
  const [token, setToken] = useState("");

  const [markers, setMarkers] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationSelected, setLocationSelected] = useState(null);
  const [nearPlace, setNearPlace] = useState(null);
  const [location, setLocation] = useState(null);
  const [nearPlaceInfo, setNearPlaceInfo] = useState(null);
  const [modal, setModal] = useState(false);

  console.log("======================[MapMain]===================");

  //get user info
  const getUserToken = async () => {
    const userToken = await AsyncStorage.getItem("userToken");
    setToken(userToken);
    console.log("userToken ", userToken);
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
    getNearPlaceInfo();
  }, [token]);

  //search bar Data
  const updateSearch = (searchQuery) => {
    setSearchQuery(searchQuery);
    console.log("🔍검색창 : ", searchQuery);

    if (searchQuery.length<2){
      return
    }
    console.log("length: "+searchQuery.length)
    axios
      .get(preURL.preURL + "/api/locations?query=" + searchQuery)
      .then((res) => {
        console.log("🔍지도검색 응답 받았다! ", res.data.data);
        setNearPlace(res.data.data);
      })
      .catch((err) => {
        console.log("🔍지도검색 에러 발생❗️ ", err);
      });
  };

  // select Location
  const updateLocation = (locationSelected) => {
    setLocationSelected(locationSelected);
    console.log("리스트 선택 : ", locationSelected);
  };

  // Region Change
  // const [updateRegion, setUpdateRegion] = useState(null);
  // const onRegionChange = () => {
  //   setUpdateRegion({
  //     latitude: setLocationSelected.y,
  //     longitude : setLocationSelected.x,
  //     latitudeDelta:0.2,
  //     longitudeDelta:0.2,
  //    })
  // }

  //load Location Data
  useEffect(() => {
    axios
      .get(preURL.preURL + "/locations/filter")
      .then((res) => {
        console.log("📍지도 응답 받았다! ", res.data.data);
        setMarkers(res.data.data);
      })
      .catch((err) => {
        console.log("📍지도 에러 발생❗️ ", err);
      });
  }, []);

  //Get User's Current Position
  useEffect(() => {
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
      },
      (error) => {
        console.log(error.code, error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  }, []);

  //Get Near Place Information
  const getNearPlaceInfo = () => {
    axios
      .get(
        preURL.preURL + "/locations/100?x=126.968778003094&y=37.5764986919736",
        config
      )
      .then((res) => {
        console.log("📍주변 장소 응답 받았다! ", res.data.data);
        setNearPlaceInfo(res.data.data);
      })
      .catch((err) => {
        console.log("📍주변 장소 에러 발생❗️ ", err);
        tokenHandling.tokenErrorHandling();
      });
  };

  const renderItem = ({ item }) => {
    console.log("📍주변 장소 정보 불러옴! ");
    return (
      <View style={{ margin: 10 }}>
        <Text style={{ fontWeight: "bold", alignSelf: "center", margin: 10 }}>
          주변 포토스팟
        </Text>
        {nearPlaceInfo &&
          nearPlaceInfo.map((nearPlaceInfo) => (
            <View style={styles.modalContentsBox}>
              <View style={styles.imageBox}>
                <Image
                  style={{
                    height: 100,
                    width: 100,
                    margin: 10,
                  }}
                  source={{
                    url: nearPlaceInfo.repImageUrl,
                  }}
                />
              </View>
              <View style={styles.textBox}>
                <Text
                  style={{
                    color: "black",
                    fontSize: 15,
                    margin: 10,
                    marginTop: 15,
                  }}
                >
                  {"<"}
                  {nearPlaceInfo.placeName}
                  {">"}
                </Text>
                <Text style={{ color: "black", fontSize: 12, marginLeft: 10 }}>
                  {nearPlaceInfo.address}
                </Text>
                <Text
                  style={{
                    color: "#c4c4c4",
                    fontSize: 10,
                    marginLeft: 10,
                    marginTop: 5,
                  }}
                >
                  관련태그 : {nearPlaceInfo.repTags}
                </Text>
                <Text
                  style={{
                    color: "#c4c4c4",
                    fontSize: 10,
                    marginLeft: 10,
                    marginTop: 5,
                  }}
                >
                  거리 : {nearPlaceInfo.distance} m
                </Text>
              </View>
            </View>
          ))}
      </View>
    );
  };

  //안드로이드용 현재위치 버튼 활성화
  const [mapWidth, setMapWidth] = useState("99%");
  const updateMapStyle = () => {
    setMapWidth("100%");
  };

  return (
    <>
      <View style={{ flex: 1 }}>
        {location && (
          <MapView
            style={[{ flex: 1 }, { width: mapWidth }]}
            provider={PROVIDER_GOOGLE}
            showsUserLocation={true}
            showsMyLocationButton={true}
            followsUserLocation={true}
            zoomEnabled={true}
            onPress={this.pickLocationHandler}
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 1,
              longitudeDelta: 1,
            }}
            // initialRegion={initialRegion}
            onMapReady={() => {
              updateMapStyle();
            }}
            // onRegionChangeComplete={()=> {
            //   onRegionChange()
            // }}
          >
            {markers &&
              markers.map((marker) => (
                <Marker
                  coordinate={{
                    id: marker.id,
                    latitude: marker.y,
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
                            url: marker.imageUrl,
                          }}
                        />
                      </View>
                      <View style={styles.arrowBorder} />
                      <View style={styles.arrow} />
                    </View>
                  </Callout>
                </Marker>
              ))}
          </MapView>
        )}

        {/* 상단 버튼 3개 */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={{
              backgroundColor: "#ffffff",
              borderColor: "#188716",
              borderWidth: 2,
              borderRadius: 10,
              margin: 5,
              padding: 8,
            }}
            onPress={() => navigation.navigate("MapMain")}
          >
            <Text>전체보기</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: "#ffffff",
              borderColor: "#2B49E4",
              borderWidth: 2,
              borderRadius: 10,
              margin: 5,
              padding: 8,
            }}
            onPress={() => navigation.navigate("UploadMarkers")}
          >
            <Text>내가 업로드한 장소</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: "#ffffff",
              borderColor: "#FE7D05",
              borderWidth: 2,
              borderRadius: 10,
              margin: 5,
              padding: 8,
            }}
            onPress={() => navigation.navigate("LikedMarkers")}
          >
            <Text>내가 좋아요한 장소</Text>
          </TouchableOpacity>
        </View>

        {/* 포토스팟 추가버튼 */}
        <View style={styles.addPhotoContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate("AddPlaceMain")}
            style={{
              width: "100%",
              height: "100%",
              displa: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Icon name="plus-circle" size={50} color="#001A72" />
          </TouchableOpacity>
        </View>

        {/* 주변정보 불러오기 버튼 */}
        <View style={styles.nearPlaceContainer}>
          <TouchableOpacity
            onPress={() => setModal(true)}
            style={{
              width: 120,
              height: 30,
              displa: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "white",
              borderRadius: 20,
              padding: 5,
            }}
          >
            <Text>내 주변 장소 보기</Text>
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
                paddingLeft: 18,
              },
            }}
            rightButtonsContainerStyle={{
              borderRadius: 15,
              right: 8,
              height: 30,
              top: 5,
              alignSelfs: "center",
              backgroundColor: "white",
            }}
            suggestionsListContainerStyle={{
              backgroundColor: "white",
            }}
            containerStyle={{ flexGrow: 1, flexShrink: 1 }}
            renderItem={(item, text) => (
              <Text style={{ color: "green", padding: 15 }}>
                {item.placeName}
              </Text>
            )}
            onSelectItem={updateLocation}
          />
        </View>
      </View>
      {modal ? (
        <View
          style={{
            display: "flex",
            justifyContent: "flex-end",
            backgroundColor: "transparent",
          }}
        >
          <GestureRecognizer onSwipeDown={() => setModal(false)}>
            <Modal visible={modal} transparent={true} animationType="slide">
              <View
                style={{
                  height: "50%",
                  marginTop: "auto",
                }}
              >
                <View style={styles.modalFooter}>
                  <FlatList
                    data={nearPlaceInfo}
                    renderItem={renderItem}
                    // numColumns={2}
                  />
                </View>
              </View>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => {
                  setModal(false);
                }}
              >
                <Text style={{ color: "white", fontSize: 15 }}>Close</Text>
              </TouchableOpacity>
            </Modal>
          </GestureRecognizer>
        </View>
      ) : (
        <View></View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  searchBar: {
    position: "absolute",
    top: "5%",
    alignSelf: "center",
    backgroundColor: "white",
    width: "95%",
    height: 0,
  },

  buttonContainer: {
    position: "absolute",
    top: "10%",
    flexDirection: "row",
    alignSelf: "center",
    backgroundColor: "transparent",
    margin: 5,
  },

  allPlaceButton: {
    backgroundColor: "#ffffff",
    borderColor: "#c4c4c4",
    borderRadius: 10,
    margin: 15,
    padding: 10,
  },
  uploadedButton: {
    backgroundColor: "#ffffff",
    borderColor: "#c4c4c4",
    borderRadius: 10,
    margin: 15,
    padding: 10,
  },
  likedButton: {
    backgroundColor: "#ffffff",
    borderColor: "#c4c4c4",
    borderRadius: 10,
    margin: 15,
    padding: 10,
  },

  addPhotoContainer: {
    position: "absolute",
    top: "83%",
    left: "84%",
  },
  nearPlaceContainer: {
    position: "absolute",
    bottom: "1%",
    alignContent: "center",
    alignSelf: "center",
  },

  bubble: {
    flexDirection: "column",
    alignSelf: "flex-start",
    backgroundColor: "#ffffff",
    borderRadius: 6,
    borderColor: "#C4C4C4",
    borderWidth: 0.5,
    padding: 15,
    width: 150,
  },
  name: {
    fontSize: 16,
    marginBottom: 5,
  },
  arrow: {
    backgroundColor: "transparent",
    borderColor: "transparent",
    borderTopColor: "#ffffff",
    borderWidth: 16,
    alignSelf: "center",
    marginTop: -32,
  },
  arrowBorder: {
    backgroundColor: "transparent",
    borderColor: "transparent",
    borderTopColor: "#007a87",
    borderWidth: 16,
    alignSelf: "center",
    marginTop: -0.5,
  },
  image: {
    width: 120,
    height: 80,
    marginTop: 5,
  },
  modalFooter: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 25,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  addButton: {
    position: "absolute",
    zIndex: 11,
    right: 20,
    bottom: 20,
    backgroundColor: "#001A72",
    width: 50,
    height: 50,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
  },
  modalContentsBox: {
    flexDirection: "row",
    width: "95%",
    height: 120,
    alignSelf: "center",
    borderRadius: 5,
    marginBottom: 10,
    overflow: "hidden",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    backgroundColor: "white",
    borderColor: "#c4c4c4",
    borderWidth: 0.5,
  },
  imageBox: {
    flex: 0.4,
    height: "100%",
    backgroundColor: "transparent",
    alignContent: "center",
    alignItems: "center",
  },
  textBox: {
    flex: 0.6,
    flexDirection: "column",
    height: "100%",
    backgroundColor: "transparent",
  },
});

export default MapMain;
