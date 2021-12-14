import React, {Component} from "react";
import {View, Text} from "react-native";

class AddPhoto extends React.Component {
    render() {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text>Seonoh Detail Screen</Text>
                <Button
                title = 'Go Home screen'
                onPress = {()=>this.props.navigation.navigate('Home')}/>
            </View>
        );
    }
}


export default AddPhoto;
