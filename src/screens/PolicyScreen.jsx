import { ScrollView, Text, View, StyleSheet, TouchableOpacity, BackHandler } from 'react-native';
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PolicyScreen({ navigation }) {
    const aceptar = async () => {
        await AsyncStorage.setItem('policyPermited', 'true');
        navigation.navigate('home');
    }
    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Política de Privacidad y Uso de Datos</Text>
            <Text style={styles.text}>
                En CercaYa, nos tomamos muy en serio la privacidad y la seguridad de nuestros usuarios.
                Esta política detalla cómo recopilamos, usamos y protegemos la información personal y la ubicación en segundo plano.
            </Text>
            <Text style={styles.subtitle}>Uso de la Ubicación en Segundo Plano</Text>
            <Text style={styles.text}>
                Nuestra aplicación recopila datos de ubicación para habilitar las funciones de seguimiento en tiempo real, alertas de proximidad y
                recomendaciones personalizadas incluso cuando la aplicación está cerrada o no se está utilizando activamente.
                Este acceso nos permite ofrecerte una experiencia más personalizada y eficiente.
            </Text>
            <Text style={styles.text}>Por ejemplo, utilizamos estos datos para:</Text>
            <Text style={styles.text}>- Notificarte cuando estés cerca de un lugar de interés.</Text>
            <Text style={styles.text}>- Rastrear tu progreso en una ruta programada.</Text>
            <Text style={styles.text}>- Ofrecerte contenido y anuncios relevantes basados en tu ubicación actual.</Text>
            <Text style={styles.subtitle}>Consentimiento y Control</Text>
            <Text style={styles.text}>
                Antes de recopilar cualquier dato de ubicación, solicitaremos tu consentimiento explícito a través de un cuadro de diálogo destacado.
                Tienes el control total para revocar este permiso en cualquier momento desde las configuraciones de la aplicación o los ajustes del sistema de tu dispositivo.
            </Text>
            <Text style={styles.subtitle}>Seguridad de los Datos</Text>
            <Text style={styles.text}>
                La seguridad de tus datos es de suma importancia para nosotros. Implementamos medidas de seguridad técnicas y organizativas
                para proteger tus datos personales y de ubicación contra el acceso no autorizado, la alteración, la divulgación o la destrucción.
            </Text>
            <Text style={styles.text}>
                Si tienes preguntas sobre nuestra política de privacidad o cómo utilizamos los datos de ubicación, no dudes en contactarnos.
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30, marginTop: 10 }}>
                <TouchableOpacity style={{ paddingVertical: 15 }}
                    onPress={() => BackHandler.exitApp()} >
                    <Text style={{ fontSize: 15, textAlign: 'center', color: '#1A73E8', fontWeight: 'bold' }}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ backgroundColor: '#1A73E8', paddingVertical: 15, paddingHorizontal: 20, borderRadius: 5 }}
                    onPress={() => aceptar()} >
                    <Text style={{ fontSize: 15, textAlign: 'center', fontWeight: 'bold', color: 'white' }}>Acepto</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 15,
        backgroundColor: 'white'
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    subtitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 15,
    },
    text: {
        fontSize: 16,
        marginBottom: 10,
        lineHeight: 24,
    },
});
