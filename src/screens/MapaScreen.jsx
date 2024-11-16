import React, { useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import MapView from 'react-native-maps';
import { customMapStyle } from '../utils/CustomStyle';

export default function MapaScreen({ navigation }) {
    const [destination, setDestination] = useState('');

    const handleSearch = () => {
        navigation.navigate('search');
    };

    return (
        <View style={{ flex: 1 }}>
            <View style={{ position: 'absolute', zIndex: 1, padding: 10, width: '100%' }}>
                <TouchableOpacity onPress={() => handleSearch()} style={{ backgroundColor: 'white', borderRadius: 10, paddingVertical: 20, borderColor: '#CCCCCC', borderWidth: 1 }}>
                    <Text style={{ paddingLeft: 10, color: 'gray' }}>¿A donde quieres ir?</Text>
                </TouchableOpacity>
            </View>
            <MapView
                style={{ width: '100%', height: '100%' }}
                customMapStyle={customMapStyle}
                initialRegion={{
                    latitude: -12.0464,
                    longitude: -77.0428,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
            />
        </View>
    );
}
