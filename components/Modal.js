import { useNavigation } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { Image, ImageBackground, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import IconFontAwesome from 'react-native-vector-icons/FontAwesome'

const ModalLoading = ({ open, setOpen }) => {
    return <View style={styles.centeredView}>
        <Modal animationType={'none'} transparent={true} visible={open} >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.text}>
                        Aguardando balança...
                    </Text>
                    <Text style={styles.text}>
                        Verifique se a balança está ligada!
                    </Text>
                    <ImageBackground style={{ height: 55, width: 55 }} source={require('../assets/balance.png')}>
                        <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end', padding: 0, margin: 0 }}>
                            <IconFontAwesome name='remove' size={30} color='red' />
                        </View>
                    </ImageBackground>
                    <Text style={[styles.text1, { fontWeight: 'bold' }]}>
                        Dúvida?
                    </Text>
                    <Text style={styles.text}>
                        Consulte as instruções no botão abaixo.
                    </Text>
                    <TouchableOpacity
                        style={styles.containerButtonToInstructions}
                        onPress={setOpen}>
                        <Icon name='tooltip-text' size={30} color='#E9FFF9' />
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    </View>
}

const styles = StyleSheet.create({
    centeredView: {
        display: 'flex',
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: '#FFFFFF66'
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    text: {
        color: 'black'
    },
    text1: {
        color: 'black',
        paddingTop: 20
    },
    containerButtonToInstructions: {
        flexDirection: 'row',
        height: 50,
        elevation: 10,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 5,
        borderRadius: 10,
        backgroundColor: '#A2E8AE',
        marginTop: 8
    }
})

export default ModalLoading