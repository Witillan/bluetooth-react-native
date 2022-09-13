import React, { useEffect, useState } from 'react'
import { Modal, StyleSheet, Text, View } from 'react-native'

const ModalLoading = ({ open }) => {
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
    }
})

export default ModalLoading