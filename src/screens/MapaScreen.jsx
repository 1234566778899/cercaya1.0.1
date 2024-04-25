import { View, Text, Image, TouchableOpacity, Alert } from 'react-native'
import React, { useContext, useEffect, useLayoutEffect, useState } from 'react'
import MapView, { Circle, Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import { customMapStyle } from '../utils/CustomStyle'
import { Feather, FontAwesome, } from '@expo/vector-icons'
import * as Location from 'expo-location';
import Slider from '@react-native-community/slider';
import { MainContext } from '../contexts/MainScreen'
import * as Notifications from 'expo-notifications';
import { useRewardedAd } from 'react-native-google-mobile-ads'
import { getDistance } from 'geolib'
import { useNavigation } from '@react-navigation/native'
import ModalPermise from './ModalPermise'

export default function MapaScreen({ navigation }) {
    const [isModal, setIsModal] = useState(true);
    const { isLoaded, isClosed, load, show } = useRewardedAd('ca-app-pub-7986550598269480~7377300632');
    const { setProgramado, destination, setDestination, setInitialPosition, radio, ruta, setRadio, position, setPosition, region, setLlego, setRegion } = useContext(MainContext);
    const navigate = useNavigation();

    useLayoutEffect(() => {
        navigate.setOptions({
            headerRight: () => (
                destination && <TouchableOpacity
                    onPress={() => navigate.navigate('search')}
                    style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#E8F0FE', borderRadius: 5, marginRight: 5, minHeight: 48, paddingHorizontal: 20 }}>
                    <Text style={{ color: 'black', fontSize: 15, color: '#1D5BA0', fontWeight: 'bold', marginLeft: 5 }}>Cancelar</Text>
                </TouchableOpacity>
            ),
        });
    }, [destination]);
    const requestPermissions = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permiso denegado', 'Se necesita permiso para acceder a la ubicación');
            navigation.goBack();
        } else {
            const { status } = await Location.requestBackgroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permiso denegado', 'Se necesita permiso para acceder a la ubicación en segundo plano');
                navigation.goBack();
            } else {
                getPosition();
            }
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

    const validateModal = async () => {
        setIsModal(false);
        requestPermissions();
    }

    useEffect(() => {
        setDestination(null);
        setLlego(false);
        registerForPushNotificationsAsync();
    }, []);

    useEffect(() => {
        changeRegion();
    }, [radio]);

    const changeRegion = () => {
        const baseDelta = 0.005;
        const factor = Math.log10(radio + 1);
        setRegion(rgn => ({
            ...rgn,
            latitudeDelta: baseDelta * factor,
            longitudeDelta: baseDelta * factor
        }));
    }
    const executeTrip = async () => {
        const taskName = 'background-location-task';
        if (getDistance(position, destination) <= radio) return alert('Usted se encuentra en el radio de su destino');
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
    useEffect(() => {
        load();
    }, [load]);

    useEffect(() => {
        if (isClosed) {
            executeTrip();
        }
    }, [isClosed, navigation]);

    if (!position && !isModal) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Cargando...</Text>
            </View>
        )
    }
    return (
        <View style={{ flex: 1 }}>
            {
                isModal && <ModalPermise setisModal={setIsModal} validateModal={validateModal} />
            }
            <MapView style={{ width: '100%', height: '100%' }}
                region={region.latitude ? region : null}
                provider={PROVIDER_GOOGLE}
                customMapStyle={customMapStyle}
            >
                {
                    position && (
                        <Marker coordinate={position} >
                            <Image source={require('../assets/punto.png')} style={{ width: 50, height: 50 }} />
                        </Marker>
                    )
                }
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
            {
                !isModal && (
                    <View style={{
                        backgroundColor: '#202125', position: 'absolute', zIndex: 2, width: '100%', paddingVertical: 30,
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
                                        accessibilityLabel="Seleccionar distancia de aviso"
                                        accessibilityHint="Ajusta el deslizador para establecer la distancia de aviso para la ruta."
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
                                        onPress={() => {
                                            if (isLoaded) {
                                                show();
                                            } else {
                                                executeTrip();
                                            }
                                        }}
                                        style={{ marginTop: 40, backgroundColor: '#1A73E8', paddingVertical: 15, borderRadius: 30 }}>
                                        <Text style={{ textAlign: 'center', fontSize: 16, color: 'white', fontWeight: 'bold' }}>Programar ruta</Text>
                                    </TouchableOpacity>
                                </View>
                            )
                        }
                    </View>
                )
            }
        </View>
    )
}