import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native';
import MapaScreen from './src/screens/MapaScreen';
import SearchScreen from './src/screens/SearchScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import { MainContextScreen } from './src/contexts/MainContextScreen';
import ReportScreen from './src/screens/ReportScreen';
import EmergencyScreen from './src/screens/EmergencyScreen';
import HomeScreen from './src/screens/HomeScreen';

const Stack = createNativeStackNavigator();
export default function App() {

  return (
    <MainContextScreen>
      <NavigationContainer >
        <Stack.Navigator initialRouteName='main'>
          <Stack.Screen name='main' component={HomeScreen} options={{ title: 'main', headerShown: false }} />
          <Stack.Screen name='login' component={LoginScreen} options={{ title: '' }} />
          <Stack.Screen name='register' component={RegisterScreen} options={{ title: 'Registro' }} />
          <Stack.Screen name='home' component={MapaScreen} options={{ title: 'Escoger ruta' }} />
          <Stack.Screen name='search' component={SearchScreen} options={{ title: 'Buscar ruta' }} />
          <Stack.Screen name='report' component={ReportScreen} options={{ title: 'Reporte de denuncias' }} />
          <Stack.Screen name='emergency' component={EmergencyScreen} options={{ title: '' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </MainContextScreen>
  )
}