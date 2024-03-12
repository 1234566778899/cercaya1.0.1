import React, { createContext, useEffect, useState } from 'react'
import * as TaskManager from 'expo-task-manager';
import { getDistance } from 'geolib';
import { Vibration } from 'react-native';
import * as Notifications from 'expo-notifications';
import mobileAds from 'react-native-google-mobile-ads';

mobileAds()
  .initialize()
  .then(adapterStatuses => {

  });

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export const MainContext = createContext();
export const MainScreen = ({ children }) => {
  const [destination, setDestination] = useState(null);
  const [initialPosition, setInitialPosition] = useState(null);
  const [radio, setRadio] = useState(50);
  const [ruta, setRuta] = useState({});
  const [position, setPosition] = useState(null);
  const [region, setRegion] = useState({});
  const [programado, setProgramado] = useState(false)
  const [llego, setLlego] = useState(false);
  TaskManager.defineTask('background-location-task', async ({ data, error }) => {
    if (error) {
      console.log(error);
      return;
    }
    if (data && destination && !llego) {
      const { locations } = data;
      const { latitude, longitude } = locations[0].coords;
      if (getDistance(position, destination) <= radio) {
        setLlego(true);
        Vibration.vibrate([0, 1000, 1000, 1000], true);
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Has llegado a tu destino",
            body: "Toca para detener el seguimiento.",
            data: { action: 'stopTracking' },
          },
          trigger: null,
        });
      }
      setPosition({ latitude, longitude });
    }
  });

  return (
    <MainContext.Provider value={{ destination, setDestination, initialPosition, setInitialPosition, radio, setRadio, setRuta, ruta, position, setPosition, setLlego, region, setRegion, programado, setProgramado }}>
      {children}
    </MainContext.Provider>
  )
}
