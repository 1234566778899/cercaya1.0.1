import React, { useContext, useEffect, useState, useRef } from 'react';
import { View, TouchableOpacity, Text, Alert, Modal, StyleSheet } from 'react-native';
import MapView, { Circle, Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import { customMapStyle } from '../utils/CustomStyle';
import { MainContext } from '../contexts/MainContextScreen';
import axios from 'axios';
import { CONFIG } from '../../config';
import polyline from '@mapbox/polyline';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { getDistance } from 'geolib'; // Importar correctamente getDistance desde geolib
import { dangerPlaces } from '../dangerPlaces'; // Asegúrate de ajustar la ruta según tu estructura de carpetas

export default function MapaScreen() {
    const { setPosition, position, destination } = useContext(MainContext);
    const [routeCoords, setRouteCoords] = useState([]);
    const [menuVisible, setMenuVisible] = useState(false);
    const [dangerMarkers, setDangerMarkers] = useState([]);
    const mapRef = useRef(null);
    const navigation = useNavigation();

    const getPosition = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permiso denegado', 'Se necesita permiso para acceder a la ubicación');
                navigation.goBack();
                return;
            }
            const location = await Location.getCurrentPositionAsync({});
            const { latitude, longitude } = location.coords;
            setPosition({ latitude, longitude });
        } catch (error) {
            navigation.goBack();
        }
    };

    const handleSearch = () => {
        navigation.navigate('search');
    };

    const getRouteDirections = async () => {
        if (!position || !destination) return;

        const origin = `${position.latitude},${position.longitude}`;
        const dest = `${destination.latitude},${destination.longitude}`;
        const apiKey = CONFIG.apiKey;
        const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${dest}&key=${apiKey}`;

        try {
            const response = await axios.get(url);
            if (response.data.routes && response.data.routes.length) {
                const points = polyline.decode(response.data.routes[0].overview_polyline.points);
                const routeCoordinates = points.map(([latitude, longitude]) => ({ latitude, longitude }));
                setRouteCoords(routeCoordinates);
            }
        } catch (error) {
            console.error('Error al obtener la ruta:', error);
        }
    };

    // Función para calcular los puntos de peligro cercanos a la ruta
    const calculateDangerMarkers = () => {
        if (routeCoords.length === 0) {
            setDangerMarkers([]);
            return;
        }
        const threshold = 500;
        const filteredDangerPlaces = dangerPlaces
            .map(([latitude, longitude]) => ({ latitude, longitude }))
            .filter((dangerPoint) => {
                const minDistance = routeCoords.reduce((min, routePoint) => {
                    const distance = getDistance(
                        { latitude: dangerPoint.latitude, longitude: dangerPoint.longitude },
                        { latitude: routePoint.latitude, longitude: routePoint.longitude }
                    );
                    return distance < min ? distance : min;
                }, Infinity);
                return minDistance <= threshold;
            });
        setDangerMarkers(filteredDangerPlaces);
    };

    useEffect(() => {
        getPosition();
    }, []);

    useEffect(() => {
        if (destination) {
            getRouteDirections();
        }
    }, [destination]);

    useEffect(() => {
        if (routeCoords.length > 0) {
            calculateDangerMarkers();
        }
    }, [routeCoords]);

    useEffect(() => {
        if (routeCoords.length > 0 && mapRef.current) {
            mapRef.current.fitToCoordinates(routeCoords, {
                edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
                animated: true,
            });
        }
    }, [routeCoords]);

    if (!position) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Cargando ubicación...</Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1 }}>
            <View style={{ position: 'absolute', zIndex: 1, padding: 10, width: '100%' }}>
                <TouchableOpacity
                    onPress={handleSearch}
                    style={{
                        backgroundColor: 'white',
                        borderRadius: 10,
                        paddingVertical: 20,
                        borderColor: '#CCCCCC',
                        borderWidth: 1
                    }}
                >
                    <Text style={{ paddingLeft: 10, color: 'gray' }}>¿A dónde quieres ir?</Text>
                </TouchableOpacity>
            </View>
            <MapView
                ref={mapRef}
                style={{ width: '100%', height: '100%' }}
                customMapStyle={customMapStyle}
                showsUserLocation={true}
                initialRegion={{
                    ...position,
                    latitudeDelta: 0.008,
                    longitudeDelta: 0.004
                }}
            >
                {routeCoords.length > 0 && (
                    <Polyline
                        coordinates={routeCoords}
                        strokeWidth={4}
                        strokeColor="blue"
                    />
                )}
                {destination && (
                    <Marker
                        coordinate={destination}
                        title={destination.name || 'Destino'}
                        description={destination.address || ''}
                    />
                )}
                {dangerMarkers.map((marker, index) => (
                    <Circle
                        key={`danger-circle-${index}`}
                        center={marker}
                        radius={100} // Radio en metros
                        strokeColor="rgba(255, 0, 0, 0.8)" // Color del borde del círculo
                        fillColor="rgba(255, 0, 0, 0.3)" // Color de relleno del círculo
                    />
                ))}

            </MapView>
            <TouchableOpacity
                onPress={() => setMenuVisible(true)}
                style={{ position: 'absolute', bottom: 20, right: 20, borderRadius: 10, backgroundColor: 'white', padding: 10, elevation: 5 }}>
                <MaterialIcons name="emergency-share" size={40} color="black" />
            </TouchableOpacity>
            <Modal
                visible={menuVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setMenuVisible(false)}
            >
                <TouchableOpacity style={styles.modalOverlay} onPress={() => setMenuVisible(false)}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity
                            style={styles.modalOption}
                            onPress={() => {
                                setMenuVisible(false);
                                navigation.navigate('report');
                            }}
                        >
                            <Text style={styles.modalText}>Realizar denuncia</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.modalOption}
                            onPress={() => {
                                setMenuVisible(false);
                                navigation.navigate('emergency');
                            }}
                        >
                            <Text style={styles.modalText}>Números de emergencia</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 10,
        width: '80%',
        paddingVertical: 20,
    },
    modalOption: {
        paddingVertical: 15,
        paddingHorizontal: 20,
    },
    modalText: {
        fontSize: 16,
        color: '#333',
    },
});
