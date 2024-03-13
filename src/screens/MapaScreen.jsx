import { View, Text, Image, TouchableOpacity, Alert } from 'react-native'
import React, { useContext, useEffect } from 'react'
import MapView, { Circle, Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import { customMapStyle } from '../utils/CustomStyle'
import { Feather, FontAwesome, } from '@expo/vector-icons'
import * as Location from 'expo-location';
import Slider from '@react-native-community/slider';
import { MainContext } from '../contexts/MainScreen'
import * as Notifications from 'expo-notifications';

export default function MapaScreen({ navigation }) {

    const { setProgramado, destination, setDestination, setInitialPosition, radio, ruta, setRadio, position, setPosition, region, setLlego, setRegion } = useContext(MainContext);

    const requestForegroundPermissions = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permiso denegado', 'Se necesita permiso para acceder a la ubicación');
            navigation.goBack();
        }
        return true;
    };

    const requestBackgroundPermissions = async () => {
        const { status } = await Location.requestBackgroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permiso denegado', 'Se necesita permiso para acceder a la ubicación en segundo plano');
            navigation.goBack();
        }
        return true;
    };

    const getPosition = async () => {
        try {
            let location = await Location.getCurrentPositionAsync({});
            const { latitude, longitude } = location.coords;
            setPosition({ latitude, longitude });
            setInitialPosition({ latitude, longitude });
            setRegion({ latitude, longitude, latitudeDelta: 0.008, longitudeDelta: 0.004 });
        } catch (error) {
            navigation.goBack();
        }
    }
    async function registerForPushNotificationsAsync() {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== 'granted') {
            navigation.goBack();
        }
    }
    const requestPermissions = async () => {
        Alert.alert(
            "Permiso de Ubicación Requerido",
            "Nuestra aplicación necesita acceso a tu ubicación para proporcionar navegación en tiempo real y alertas de proximidad. ¿Deseas continuar?",
            [
                {
                    text: "No",
                    onPress: () => navigation.goBack(),
                    style: "cancel"
                },
                {
                    text: "Sí", onPress: () => {
                        requestForegroundPermissions();
                        requestBackgroundPermissions();
                        getPosition();
                    }
                }
            ]
        );
    };
    useEffect(() => {
        requestPermissions();
        setDestination(null);
        setLlego(false);
        registerForPushNotificationsAsync();
    }, []);

    useEffect(() => {
        changeRegion();
    }, [radio]);

    const changeRegion = () => {
        const baseDelta = 0.005; // Valor base para deltas
        const factor = Math.log10(radio + 1); // Uso de logaritmo para suavizar el crecimiento
        setRegion(rgn => ({
            ...rgn,
            latitudeDelta: baseDelta * factor,
            longitudeDelta: baseDelta * factor
        }));
    }
    const startTravel = async () => {
        const hasForegroundPermissions = await requestForegroundPermissions();
        if (!hasForegroundPermissions) return;

        const hasBackgroundPermissions = await requestBackgroundPermissions();
        if (!hasBackgroundPermissions) return;

        const taskName = 'background-location-task';

        try {
            await Location.startLocationUpdatesAsync(taskName, {
                accuracy: Location.Accuracy.BestForNavigation,
                distanceInterval: 5
            });
            navigation.navigate('home');
            setProgramado(true);
        } catch (error) {
            console.error('Error al iniciar las actualizaciones de ubicación:', error);
            Alert.alert('Error', 'Hubo un error al iniciar el viaje. Por favor, inténtalo de nuevo.');
        }
    }
    const executeTrip = () => {

        startTravel();

    };

    if (!position) {
        return (
            <View style={{ flex: 1, justifyContent: 'center' }}>
                <Text style={{ textAlign: 'center' }}> Cargando..</Text>
            </View>
        )
    }
    return position && (
        <View style={{ flex: 1 }}>
            <MapView style={{ width: '100%', height: '100%' }}
                region={region}
                provider={PROVIDER_GOOGLE}
                customMapStyle={customMapStyle}
            >
                <Marker coordinate={position}>
                    <Image source={require('../assets/punto.png')} style={{ width: 50, height: 50 }} />
                </Marker>
                {destination && (
                    <Circle
                        key={radio}
                        center={destination}
                        radius={radio}
                        strokeWidth={0}
                        fillColor={'rgba(250,89,89,0.27)'}
                    >
                    </Circle>
                )}
                {destination && (
                    <Circle
                        center={destination}
                        radius={10}
                        strokeWidth={1}
                        fillColor={'#F95555'}
                        strokeColor={'#fff'}
                    >
                    </Circle>
                )}
            </MapView>
            <View style={{
                backgroundColor: '#202125', position: 'absolute', width: '100%', paddingVertical: 30,
                bottom: 0, paddingHorizontal: 10,
                borderTopRightRadius: 20, borderTopLeftRadius: 20
            }}>
                {
                    !destination && (
                        <TouchableOpacity onPress={() => navigation.navigate('search')}>
                            <View style={{
                                flexDirection: 'row', alignItems: 'center',
                                backgroundColor: '#3C4043', paddingHorizontal: 20, paddingVertical: 15, borderRadius: 20
                            }}>
                                <Feather name="search" size={30} color="#BDC1C9" />
                                <Text style={{ color: '#BDC1C9', fontSize: 17, marginLeft: 20 }}>¿A donde vas?</Text>
                            </View>
                        </TouchableOpacity>
                    )
                }
                {
                    destination && (
                        <View>
                            <Text style={{ color: 'white', fontSize: 22, fontWeight: 'bold' }}>{ruta ? ruta.name : ''}</Text>
                            <View
                                style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 5, backgroundColor: 'black', width: 90, borderRadius: 10, marginTop: 10 }}>
                                <FontAwesome name="car" size={15} color="white" />
                                <Text style={{ color: 'white', marginLeft: 10 }}>3.7Km</Text>
                            </View>
                            <Text style={{ color: '#BFC1C5', fontWeight: 'bold', marginTop: 5 }}>{ruta ? ruta.address : ''}</Text>
                            <Text style={{ marginTop: 40, fontSize: 20, color: 'white' }}>Distancia de aviso</Text>
                            <Slider
                                style={{ width: '100%', height: 40, marginTop: 10 }}
                                minimumValue={0}
                                maximumValue={2000}
                                value={radio}
                                onValueChange={setRadio}
                                minimumTrackTintColor="#FFFFFF"
                                maximumTrackTintColor="#000000"
                            />
                            <Text style={{ color: 'white', textAlign: 'center', fontSize: 15 }}>{(radio).toFixed(0)} m</Text>
                            <TouchableOpacity
                                onPress={() => executeTrip()}
                                style={{ marginTop: 40, backgroundColor: '#32CCFE', paddingVertical: 20, borderRadius: 30 }}>
                                <Text style={{ textAlign: 'center', fontSize: 16, fontWeight: 'bold' }}>Programar ruta</Text>
                            </TouchableOpacity>
                        </View>
                    )
                }
            </View>
        </View>
    )
}