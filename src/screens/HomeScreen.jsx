import { View, Text, TouchableOpacity, Vibration } from 'react-native'
import React, { useContext, useEffect } from 'react'
import * as TaskManager from 'expo-task-manager';
import { FontAwesome, FontAwesome5, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { MainContext } from '../contexts/MainScreen';
import { getDistance } from 'geolib';
import * as Notifications from 'expo-notifications';

export default function HomeScreen({ navigation }) {
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
                                <Text style={{ color: 'white', textAlign: 'center', marginLeft: 10 }}>Se enviará una alerta cuando falten
                                    <Text style={{ fontWeight: 'bold' }}> {radio.toFixed(0)} m </Text>
                                    de su destino</Text>
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
                            style={{ textAlign: 'center', color: 'white', marginTop: 20, fontWeight: 'bold' }}>Agrega un destino y disfruta de tu viaje</Text>
                    </View>
                )
            }
            <View style={{ alignItems: 'center', position: 'absolute', bottom: 20, width: '100%', paddingHorizontal: 10 }}>
                {
                    !programado && (
                        <TouchableOpacity
                            onPress={() => navigation.navigate('mapa')}
                            style={{ width: 60, height: 60, borderRadius: 60, backgroundColor: '#32CCFE', alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ fontSize: 30 }}>+</Text>
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