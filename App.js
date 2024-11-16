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

const Stack = createNativeStackNavigator();
export default function App() {

  return (
    <MainContextScreen>
      <NavigationContainer >
        <Stack.Navigator initialRouteName='home'>
          <Stack.Screen name='login' component={LoginScreen} options={{ title: 'Login' }} />
          <Stack.Screen name='register' component={RegisterScreen} options={{ title: 'Registro' }} />
          <Stack.Screen name='home' component={MapaScreen} options={{ title: 'Escoger ruta' }} />
          <Stack.Screen name='search' component={SearchScreen} options={{ title: 'Buscar ruta' }} />
          <Stack.Screen name='report' component={ReportScreen} options={{ title: 'Reporte de denuncias' }} />
          <Stack.Screen name='emergency' component={EmergencyScreen} options={{ title: 'Números de emergencia' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </MainContextScreen>
  )
}