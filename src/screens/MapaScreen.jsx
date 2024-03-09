import { View, Text, TextInput, Image, TouchableOpacity, ImageBackground } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import { customMapStyle } from '../utils/CustomStyle'
import { Feather, FontAwesome, FontAwesome5, Ionicons } from '@expo/vector-icons'
import * as Location from 'expo-location';
import Slider from '@react-native-community/slider';
import { MainContext } from '../contexts/MainScreen'
import axios from 'axios'
import { CONFIG } from '../../config'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Notifications from 'expo-notifications';

export default function MapaScreen({ navigation }) {

    const [searchActive, setSearchActive] = useState(false);
    const { setProgramado, destination, setDestination, setInitialPosition, radio, ruta, setRadio, setRuta, position, setPosition, region, setLlego, setRegion } = useContext(MainContext);
    const [results, setResults] = useState([])
    const [recientes, setRecientes] = useState([]);

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
    useEffect(() => {
        requestForegroundPermissions();
        requestBackgroundPermissions();
        getPosition();
        setDestination(null);
        setLlego(false);
        getRecientes();
        registerForPushNotificationsAsync();
    }, []);

    const getRecientes = async () => {
        const arr = await AsyncStorage.getItem('places');
        if (arr) {
            setRecientes(JSON.parse(arr));
        }
    }
    const saveReciente = async (place) => {
        let aux = [place, ...recientes].slice(0, 5);
        await AsyncStorage.setItem('places', JSON.stringify(aux));
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

    getSites = (value) => {
        if (value == "" || value.trim() == "" || value == null) return;

        const requestData = {
            input: value,
            locationBias: {
                circle: {
                    center: position,
                    radius: 20000.0
                }
            },
            languageCode: 'es'
        };

        const headers = {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': CONFIG.apiKey
        };

        axios.post(CONFIG.uriMap, requestData, { headers })
            .then(response => {
                setResults(response.data.suggestions);
            })
            .catch(error => {
                console.error('Error en la solicitud:', error.response.status);
                console.error(error.response.data);
            });
    }
    const positionDestination = (value) => {
        axios.get(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${value.placePrediction.placeId}&key=${CONFIG.apiKey}`)
            .then(response => {
                const { name, formatted_address, geometry } = response.data.result;
                const { lat, lng } = geometry.location;
                setDestination({ longitude: lng, latitude: lat });
                setSearchActive(false);
                setRuta({ latitude: lat, longitude: lng, name, address: formatted_address });
                saveReciente({ latitude: lat, longitude: lng, name, address: formatted_address });
                setRegion({
                    latitude: lat - 0.002,
                    longitude: lng,
                    latitudeDelta: 0.008,
                    longitudeDelta: 0.004,
                });
            })
            .catch(error => {
                console.log(error);
            })
    }
    const positionSaved = (place) => {
        const { latitude, longitude, name, address } = place;
        setDestination({ longitude, latitude });
        setSearchActive(false);
        setRuta({ latitude, longitude, name, address });
        setRegion({
            latitude: latitude - 0.002,
            longitude: longitude,
            latitudeDelta: 0.008,
            longitudeDelta: 0.004,
        });
    }

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
                <Marker coordinate={position && position.latitude && position.longitude ? position : null}>
                    <Image source={require('../assets/punto.png')} style={{ width: 50, height: 50 }} />
                </Marker>
                {
                    destination && destination.latitude && destination.longitude && (
                        <Marker coordinate={destination}>
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <ImageBackground style={{ width: 50, height: 50 }} source={require('../assets/parent.png')}></ImageBackground>
                                <Image source={require('../assets/child.png')} style={{ width: 15, height: 15, position: 'absolute' }} />
                            </View>
                        </Marker>
                    )
                }
            </MapView>
            <View style={{
                backgroundColor: '#202125', position: 'absolute', width: '100%', paddingVertical: 30,
                bottom: 0, paddingHorizontal: 10,
                borderTopRightRadius: 20, borderTopLeftRadius: 20
            }}>
                {
                    !destination && (
                        <TouchableOpacity onPress={() => setSearchActive(true)}>
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
            {
                searchActive && (
                    <View style={{ flex: 1, position: 'absolute', backgroundColor: 'white', height: '100%', width: '100%', paddingHorizontal: 10 }}>
                        <View style={{
                            flexDirection: 'row', padding: 13, paddingVertical: 5, marginTop: 10, borderRadius: 35, alignItems: 'center',
                            backgroundColor: '#F3F4F8', marginBottom: 15
                        }}>
                            <Ionicons name="chevron-back" size={27} color="black" onPress={() => setSearchActive(false)} />
                            <TextInput onChangeText={(value) => getSites(value)} style={{ width: '85%', fontSize: 17, padding: 5, paddingVertical: 15, paddingLeft: 10 }} placeholder='Av.' />
                            <Feather name="search" size={24} color="black" />
                        </View>
                        {
                            results.length > 0 && results.map((x, index) => (
                                <TouchableOpacity key={index}
                                    onPress={() => positionDestination(x)}
                                    style={{
                                        flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 25, borderBottomWidth: 1, borderBottomColor: '#EEEEEE'
                                    }}>
                                    <FontAwesome5 name="map-marker-alt" size={24} color="black" />
                                    <Text style={{ marginLeft: 20 }} numberOfLines={1}>{x.placePrediction.text.text}</Text>
                                </TouchableOpacity>
                            ))
                        }
                        {
                            results.length == 0 && recientes.length > 0 && (
                                <View>
                                    <Text style={{ fontSize: 16, marginTop: 10, marginLeft: 10, fontWeight: 'bold' }}>Recientes</Text>
                                    {
                                        recientes.map((x, index) => (
                                            <TouchableOpacity key={index}
                                                onPress={() => positionSaved(x)}
                                                style={{
                                                    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 25, borderBottomWidth: 1, borderBottomColor: '#EEEEEE'
                                                }}>
                                                <FontAwesome5 name="map-marker-alt" size={24} color="black" />
                                                <Text style={{ marginLeft: 20 }} numberOfLines={1}>{x.name}</Text>
                                            </TouchableOpacity>
                                        ))
                                    }
                                </View>
                            )
                        }
                    </View>
                )
            }
        </View>
    )
}