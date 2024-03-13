import { View, Text, TouchableOpacity, Vibration } from 'react-native'
import React, { useContext, useEffect, useLayoutEffect } from 'react'
import * as TaskManager from 'expo-task-manager';
import { FontAwesome, FontAwesome5, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { MainContext } from '../contexts/MainScreen';
import { getDistance } from 'geolib';
import * as Notifications from 'expo-notifications';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = ({ navigation }) => {

    const navigate = useNavigation();

    useLayoutEffect(() => {
        navigate.setOptions({
            headerRight: () => (
                <TouchableOpacity
                    onPress={() => navigate.navigate('policy')}
                    style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
                    <MaterialIcons name="policy" size={24} color="black" />
                    <Text style={{ color: 'black', fontSize: 15, marginLeft: 5 }}>Política de privacidad</Text>
                </TouchableOpacity>
            ),
        });
    }, [navigate]);

    const { destination, position, initialPosition, setDestination, radio, ruta, programado, setProgramado } = useContext(MainContext);
    const stopTrip = async () => {
        Vibration.cancel();
        setDestination(null);
        setProgramado(false);
        await TaskManager.unregisterTaskAsync('background-location-task');
    }
    const getPercent = () => {
        const total = getDistance(initialPosition, destination);
        const actual = getDistance(position, destination);
        return 100 - (actual * 100 / total);
    }
    useEffect(() => {
        Notifications.addNotificationResponseReceivedListener(handleNotificationResponse);
        return () => {
            Notifications.removeNotificationSubscription();
        };
    }, []);

    const handleNotificationResponse = response => {
        const action = response.notification.request.content.data.action;
        if (action === 'stopTracking') {
            stopTrip();
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#1B1C20' }}>
            {
                programado && destination && (
                    <View>
                        <View style={{ paddingHorizontal: 15 }}>
                            <View style={{ marginTop: 30 }}>
                                <Text style={{ color: 'white', fontSize: 22, fontWeight: 'bold' }}>{ruta.name}</Text>
                                <View
                                    style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 5, backgroundColor: 'black', width: 90, borderRadius: 10, marginTop: 10 }}>
                                    <FontAwesome name="car" size={15} color="white" />
                                    <Text style={{ color: 'white', marginLeft: 10 }}>3.7Km</Text>
                                </View>
                                <Text style={{ color: '#BFC1C5', fontWeight: 'bold', marginTop: 5 }}>{ruta.address}</Text>

                            </View>
                            <View style={{ marginTop: 40 }}>
                                <FontAwesome5 name="car-side" size={24} color="white" style={{ marginLeft: `${getPercent() - 3}%` }} />
                                <View style={{ height: 4, backgroundColor: 'black', borderRadius: 4 }}>
                                    <View style={{ backgroundColor: '#32CCFE', width: `${getPercent() + 1}%`, height: '100%', borderRadius: 4 }}>
                                    </View>
                                </View>
                            </View>
                            <Text style={{ color: 'white', fontSize: 16, marginTop: 10, textAlign: 'center', fontWeight: 'bold' }}>Faltan {getDistance(position, destination)} m</Text>
                            <View
                                style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 50 }}>
                                <MaterialCommunityIcons name="bell-alert-outline" size={24} color="#32CCFE" />
                                <Text style={{ color: 'white', textAlign: 'center', marginLeft: 10 }}>Te notificaremos cuando estés
                                    <Text style={{ fontWeight: 'bold' }}> {radio.toFixed(0)} m </Text>
                                    del destino</Text>
                            </View>
                        </View>
                    </View>
                )
            }
            {
                !programado && (
                    <View style={{ paddingHorizontal: 5, marginTop: 20, alignItems: 'center', marginTop: 60 }}>
                        <MaterialIcons name="card-travel" size={35} color="white" />
                        <Text
                            style={{ textAlign: 'center', color: 'white', marginTop: 20, fontWeight: 'bold' }}>¿Listo para tu próxima aventura? Añade un destino ahora</Text>
                    </View>
                )
            }

            <View style={{ alignItems: 'center', position: 'absolute', bottom: 20, width: '100%', paddingHorizontal: 10 }}>
                {
                    !programado && (
                        <TouchableOpacity style={{ backgroundColor: '#32CCFE', width: '100%', paddingVertical: 15, borderRadius: 30 }} onPress={() => navigation.navigate('mapa')} >
                            <Text style={{ fontSize: 15, textAlign: 'center', fontWeight: 'bold' }}>
                                Toca para agregar destino
                            </Text>
                        </TouchableOpacity>
                    )
                }
                {
                    programado && (
                        <TouchableOpacity style={{ backgroundColor: '#32CCFE', width: '100%', paddingVertical: 15, borderRadius: 30 }} onPress={() => stopTrip()} >
                            <Text style={{ fontSize: 15, textAlign: 'center', fontWeight: 'bold' }}>Detener viaje</Text>
                        </TouchableOpacity>
                    )
                }
            </View>
        </View>
    )
}


export default HomeScreen;