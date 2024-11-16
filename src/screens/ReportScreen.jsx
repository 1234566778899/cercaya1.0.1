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
import { getDistance } from 'geolib';
import { dangerPlaces } from '../dangerPlaces';

export default function MapaScreen() {
    const { setPosition, position, destination } = useContext(MainContext);
    const [routes, setRoutes] = useState([]);
    const [safeRoutes, setSafeRoutes] = useState([]);
    const [dangerRoutes, setDangerRoutes] = useState([]);
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
            console.error('Error al obtener la posición:', error);
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
        const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${dest}&alternatives=true&key=${apiKey}`;

        try {
            const response = await axios.get(url);
            if (response.data.routes && response.data.routes.length) {
                const decodedRoutes = response.data.routes.map(route => {
                    if (route.overview_polyline && route.overview_polyline.points) {
                        const points = polyline.decode(route.overview_polyline.points);
                        const routeCoordinates = points.map(([latitude, longitude]) => ({ latitude, longitude }));
                        return routeCoordinates;
                    } else {
                        console.warn('Ruta sin polyline:', route);
                        return [];
                    }
                }).filter(route => route.length > 0); // Filtra rutas vacías
                setRoutes(decodedRoutes);
            } else {
                console.warn('No se encontraron rutas en la respuesta de la API');
            }
        } catch (error) {
            console.error('Error al obtener la ruta:', error);
        }
    };
    const evaluateRoutes = () => {
        const threshold = 500;
        const safe = [];
        const dangerous = [];

        routes.forEach(route => {
            const isSafe = !dangerPlaces.some(dangerPoint => {
                return route.some(routePoint => {
                    const distance = getDistance(
                        { latitude: dangerPoint.latitude, longitude: dangerPoint.longitude },
                        { latitude: routePoint.latitude, longitude: routePoint.longitude }
                    );
                    console.log(distance)
                    return distance <= threshold;
                });
            });
            if (isSafe) {
                safe.push(route);
            } else {
                dangerous.push(route);
            }
        });

        setSafeRoutes(safe);
        setDangerRoutes(dangerous);
    };

    const calculateDangerMarkers = () => {
        if (routes.length === 0) {
            setDangerMarkers([]);
            return;
        }
        const threshold = 500;
        const filteredDangerPlaces = dangerPlaces
            .map(({ latitude, longitude }) => ({ latitude, longitude }))
            .filter((dangerPoint) => {
                return routes.some(route => {
                    return route.some(routePoint => {
                        const distance = getDistance(
                            { latitude: dangerPoint.latitude, longitude: dangerPoint.longitude },
                            { latitude: routePoint.latitude, longitude: routePoint.longitude }
                        );
                        return distance <= threshold;
                    });
                });
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
        if (routes.length > 0) {
            evaluateRoutes();
            console.log('llego')
            calculateDangerMarkers();
        }
    }, [routes]);

    useEffect(() => {
        if ((safeRoutes.length > 0 || dangerRoutes.length > 0) && mapRef.current) {
            const allCoords = [...safeRoutes, ...dangerRoutes].flat();
            if (allCoords.length > 0) {
                mapRef.current.fitToCoordinates(allCoords, {
                    edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
                    animated: true,
                });
            }
        }
    }, [safeRoutes, dangerRoutes]);

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
                {safeRoutes.map((route, index) => (
                    <Polyline
                        key={`safe-route-${index}`}
                        coordinates={route}
                        strokeWidth={4}
                        strokeColor="green"
                    />
                ))}
                {dangerRoutes.map((route, index) => (
                    <Polyline
                        key={`danger-route-${index}`}
                        coordinates={route}
                        strokeWidth={4}
                        strokeColor="red"
                    />
                ))}
                {destination && (
                    <Marker
                        coordinate={destination}
                        title={destination.name ? destination.name.toString() : 'Destino'}
                        description={destination.address ? destination.address.toString() : ''}
                    />
                )}
                {dangerMarkers.map((marker, index) => (
                    <Circle
                        key={`danger-circle-${index}`} // Asegúrate de que los backticks estén correctos
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
