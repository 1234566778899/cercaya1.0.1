import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from './src/screens/HomeScreen';
import MapaScreen from './src/screens/MapaScreen';
import { MainScreen } from './src/contexts/MainScreen';
import SearchScreen from './src/screens/SearchScreen';


const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <MainScreen>
      <NavigationContainer>
        <Stack.Navigator >
          <Stack.Screen name='home' component={HomeScreen} options={{ title: 'CercaYa' }} />
          <Stack.Screen name='mapa' component={MapaScreen} options={{ title: 'Escoger ruta' }} />
          <Stack.Screen name='search' component={SearchScreen} options={{ title: 'Buscar ruta' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </MainScreen>
  )
}