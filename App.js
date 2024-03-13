import React, { useEffect, useState } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from './src/screens/HomeScreen';
import MapaScreen from './src/screens/MapaScreen';
import { MainScreen } from './src/contexts/MainScreen';
import SearchScreen from './src/screens/SearchScreen';
import PolicyScreen from './src/screens/PolicyScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Stack = createNativeStackNavigator();
export default function App() {

  const [isFirstLaunch, setIsFirstLaunch] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem('policyPermited').then(value => {
      if (!value) {
        setIsFirstLaunch(true);
      } else {
        setIsFirstLaunch(false);
      }
    });
  }, []);

  if (isFirstLaunch === null) {
    return null;
  }
  return (
    <MainScreen>
      <NavigationContainer >
        <Stack.Navigator initialRouteName={isFirstLaunch ? 'policy' : 'home'}>
          <Stack.Screen name='home' component={HomeScreen} options={{ title: 'CercaYa' }} />
          <Stack.Screen name='mapa' component={MapaScreen} options={{ title: 'Escoger ruta' }} />
          <Stack.Screen name='search' component={SearchScreen} options={{ title: 'Buscar ruta' }} />
          <Stack.Screen name='policy' component={PolicyScreen} options={{ title: 'Acerca de la aplicación' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </MainScreen>
  )
}