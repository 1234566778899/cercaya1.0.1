import React, { useState } from 'react';
import {
    View,
    TextInput,
    TouchableOpacity,
    Text,
    StyleSheet,
    Image,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';

export default function RegisterScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            {/* Logo o imagen de encabezado */}
            {/* <Image
        source={require('../assets/logo.png')} // Reemplaza con la ruta de tu imagen
        style={styles.logo}
      /> */}

            {/* Título de registro */}
            <Text style={styles.title}>Crear una cuenta</Text>

            {/* Campo de correo electrónico */}
            <TextInput
                style={styles.input}
                placeholder="Nombre de usuario"
                autoCapitalize="none"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                style={styles.input}
                placeholder="Correo electrónico"
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
            />

            {/* Campo de contraseña */}
            <TextInput
                style={styles.input}
                placeholder="Contraseña"
                secureTextEntry
                autoCapitalize="none"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
            />

            {/* Botón de registro */}
            <TouchableOpacity
                style={styles.button}
                onPress={() => {
                    navigation.navigate('login')
                }}
            >
                <Text style={styles.buttonText}>Registrarse</Text>
            </TouchableOpacity>

            {/* Enlace para iniciar sesión si ya tiene una cuenta */}
            <View style={styles.footer}>
                <Text style={styles.footerText}>
                    ¿Ya tienes una cuenta?{' '}
                    <Text
                        style={styles.footerLink}
                        onPress={() => {
                            navigation.navigate('login')
                        }}
                    >
                        Inicia sesión
                    </Text>
                </Text>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EFEFF4',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 30,
    },
    logo: {
        width: 120,
        height: 120,
        marginBottom: 20,
        resizeMode: 'contain',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 30,
    },
    input: {
        width: '100%',
        height: 50,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: 15,
        fontSize: 16,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5, // Para Android
    },
    button: {
        width: '100%',
        height: 50,
        backgroundColor: '#5568FE',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        shadowColor: '#5568FE',
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 5, // Para Android
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    footer: {
        marginTop: 25,
    },
    footerText: {
        color: '#999',
        fontSize: 14,
    },
    footerLink: {
        color: '#5568FE',
        fontWeight: 'bold',
    },
});
