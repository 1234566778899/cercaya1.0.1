// RegisterScreen.js
import React, { useState } from 'react';
import {
    View,
    TextInput,
    TouchableOpacity,
    Text,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

export default function RegisterScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleRegister = () => {
        if (email === '' || password === '' || confirmPassword === '') {
            Alert.alert('Campos Vacíos', 'Por favor, rellena todos los campos.');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Contraseñas No Coinciden', 'Las contraseñas deben ser iguales.');
            return;
        }

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Registro exitoso
                const user = userCredential.user;
                console.log('Usuario registrado:', user);
                navigation.navigate('login');
            })
            .catch((error) => {
                console.error(error);
                Alert.alert('Error de Registro', error.message);
            });
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: 'white', padding: 20 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <Text style={{ fontSize: 30, fontWeight: 'bold', marginTop: 30 }}>Hello! Register to get started</Text>
            <TextInput
                style={{ paddingVertical: 20, paddingHorizontal: 15, borderColor: '#EEF1F7', borderWidth: 1, marginTop: 40, fontSize: 15, backgroundColor: '#F7F8F9' }}
                placeholder="Correo electrónico"
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
            />

            <TextInput
                style={{ paddingVertical: 20, paddingHorizontal: 15, borderColor: '#EEF1F7', borderWidth: 1, marginTop: 20, fontSize: 15, backgroundColor: '#F7F8F9' }}
                placeholder="Contraseña"
                secureTextEntry
                autoCapitalize="none"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
            />

            <TextInput
                style={{ paddingVertical: 20, paddingHorizontal: 15, borderColor: '#EEF1F7', borderWidth: 1, marginTop: 20, fontSize: 15, backgroundColor: '#F7F8F9' }}
                placeholder="Confirmar Contraseña"
                secureTextEntry
                autoCapitalize="none"
                placeholderTextColor="#999"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
            />

            <TouchableOpacity
                style={{ backgroundColor: '#1E232C', paddingVertical: 20, marginTop: 30, borderRadius: 5 }}
                onPress={handleRegister}>
                <Text style={{ textAlign: 'center', color: 'white', fontWeight: 'bold' }}>Registrarse</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => {
                    navigation.navigate('login');
                }}
                style={{ paddingVertical: 20, marginTop: 30 }}>
                <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>
                    ¿Ya tienes una cuenta?{'  '}
                    <Text style={{ color: '#35C2C1', textDecorationLine: 'underline' }}>
                        Inicia sesión
                    </Text>
                </Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>
    );
}
