import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

export default function ModalPermise({ setisModal, validateModal }) {
    const closeModal = async () => {
        setisModal(false);
        validateModal();
    }
    return (
        <View style={{ justifyContent: 'center', alignItems: 'center', height: '100%', position: 'absolute', width: '100%', zIndex: 3 }}>
            <View style={{ backgroundColor: '#262626', padding: 20, width: '80%' }}>
                <TouchableOpacity
                    onPress={closeModal}
                    style={{ position: 'absolute', top: -15, right: -15, backgroundColor: '#c34e46', borderRadius: 50, width: 48, height: 48, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: 'white', fontSize: 15 }}>X</Text>
                </TouchableOpacity>
                <Text style={{ color: 'white', fontSize: 15 }}>
                    <Text style={{ fontWeight: 'bold' }}>CercaYa</Text><Text> recolecta datos de tu ubicación para identificar si estas cerca a tu destino y ver en tiempo real tu ubicación, incluso cuando la aplicación esta cerrada o no este en uso.</Text>
                </Text>
                <Text style={{ color: 'white', marginTop: 10, fontSize: 15 }}>Estos datos también se utilizan para respaldar anuncios.</Text>
            </View>
        </View>
    )
}