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

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >

            <Text style={styles.title}>Iniciar sesión</Text>
            {/* Campo de correo electrónico */}
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

            {/* Botón de inicio de sesión */}
            <TouchableOpacity
                style={styles.button}
                onPress={() => {
                    navigation.navigate('home')
                }}
            >
                <Text style={styles.buttonText}>Iniciar sesión</Text>
            </TouchableOpacity>

            {/* Enlace para registro o recuperar contraseña */}
            <View style={styles.footer}>
                <Text style={styles.footerText}>
                    ¿No tienes una cuenta?{' '}
                    <Text
                        style={styles.footerLink}
                        onPress={() => {
                            navigation.navigate('register')
                        }}
                    >
                        Regístrate
                    </Text>
                </Text>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eee',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 30,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 30,
    },
    logo: {
        width: 120,
        height: 120,
        marginBottom: 40,
        resizeMode: 'contain',
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
        elevation: 5,
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
