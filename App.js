import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native';
import MapaScreen from './src/screens/MapaScreen';
import SearchScreen from './src/screens/SearchScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';

const Stack = createNativeStackNavigator();
export default function App() {

  return (
    <NavigationContainer >
      <Stack.Navigator >
        <Stack.Screen name='login' component={LoginScreen} options={{ title: 'Login' }} />
        <Stack.Screen name='register' component={RegisterScreen} options={{ title: 'Registro' }} />
        <Stack.Screen name='home' component={MapaScreen} options={{ title: 'Escoger ruta' }} />
        <Stack.Screen name='search' component={SearchScreen} options={{ title: 'Buscar ruta' }} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}