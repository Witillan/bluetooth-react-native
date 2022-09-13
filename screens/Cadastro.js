import AsyncStorage from '@react-native-async-storage/async-storage'
import { Buffer } from 'buffer'
import React, { useCallback, useState } from 'react'
import { Alert, PermissionsAndroid, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import base64 from 'react-native-base64'
import { BleManager, NativeDevice, Service } from 'react-native-ble-plx'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import Header from '../components/Header'
import InputOptions from '../components/InputOptions'
import ModalLoading from '../components/Modal'
import { useSelector } from 'react-redux'
import { useNavigation } from '@react-navigation/native'

// icons
// components
const Cadastro = () => {
  const navigation = useNavigation()
  const devicePermissions = useSelector((state) => state.counter.permissions)

  const manager = new BleManager()
  const serv = new Service(NativeDevice, manager)

  // States Of The Application
  const [weightt, setWeightt] = useState()
  const [devices, setDevices] = useState([])

  const [waitingConnect, setWaitingConnect] = useState(false)

  // permissions
  const requestLocationPermission = async () => {
    try {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
        title: 'permissão de localização para o bluetooth scanning',
        message: 'Nós precisamos dessa permissão para rodar o bluetooth',
        buttonNeutral: 'Perguntar depois',
        buttonNegative: 'Cancelar',
        buttonPositive: 'OK',
      },
      )
    } catch (err) {
      console.log(err)
    }
  }

  const requestBLUETOOTH_ADMINPermission = async () => {
    try {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT, {
        title: 'Location permission for bluetooth scanning',
        message: 'Nós precisamos dessa permissão para rodar o bluetooth',
        buttonNeutral: 'Perguntar depois',
        buttonNegative: 'Cancelar',
        buttonPositive: 'OK',
      },
      )
    } catch (err) {
      console.log(err)
    }
  }

  const BLUETOOTH_ADVERTISErequestPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN, {
        title: 'Location permission for bluetooth scanning',
        message: 'Nós precisamos dessa permissão para rodar o bluetooth',
        buttonNeutral: 'Perguntar depois',
        buttonNegative: 'Cancelar',
        buttonPositive: 'OK',
      },
      )
    } catch (err) {
      console.log(err)
    }
  }

  const permissions = useCallback(() => {
    console.log('--------------- Teste -----------------')
    requestLocationPermission()
    requestBLUETOOTH_ADMINPermission()
    BLUETOOTH_ADVERTISErequestPermission()
  }, [])
  // usar redux para fazer o dispatch do device, para nao precisar fazendo o scan sempre
  // ta dando erro nisso, tem que concertar
  // ou colocar no asyncStorage, já funciona
  const ScanAndConnect = () => {
    console.log(devicePermissions)
    permissions()
    manager.startDeviceScan(null, { allowDuplicates: false }, (error, listOfDevices) => {
      if (error) {
        // erro resolvido fazendo a request do ACCESS_FINE_LOCATION
        console.log(error)
        return
      }
      if (listOfDevices.id == "C7:C6:8B:C9:9F:2D") {
        setDevices(oldArray => [...oldArray, listOfDevices])
        manager.stopDeviceScan()
        setWaitingConnect(false)
      }
    })
  }

  React.useEffect(() => {
    const subscription = manager.onStateChange((state) => {
      if (state === 'PoweredOn') {
        console.log("Bluetooth ligado")
      } else {
        Alert.alert("Bluetooth desligado", "Você precisa ligar o bluetooth e conectar na balança", [
          {
            text: "Cancelar",
            onPress: () => console.log("apertou cancelar"),
            style: "cancel"
          },
          {
            text: "ok",
            onPress: () => console.log("apertou ok"),
          }
        ])
      }
    }, true)

    return () => {
      subscription.remove()
    }

  }, [manager])

  const getTheCurrentWeight = () => {
    devices[0]
      .connect()
      .then((deviceConnected) => {
        return deviceConnected.discoverAllServicesAndCharacteristics()
      })
      .then((data) => {

        let base64Stringg = Buffer.from("{RW}").toString('base64')

        data.writeCharacteristicWithoutResponseForService("6e400001-b5a3-f393-e0a9-e50e24dcca9e", "6e400002-b5a3-f393-e0a9-e50e24dcca9e", base64Stringg)
          .then(() => {
            data.monitorCharacteristicForService("6e400001-b5a3-f393-e0a9-e50e24dcca9e", "6e400003-b5a3-f393-e0a9-e50e24dcca9e", (err, cha) => {
              try {
                console.log(cha.value)
                let weightTransformed = base64.decode(cha.value)
                let weightString = weightTransformed.replace('[', '');
                let weight = weightString.replace(']', '');
                console.log(weightTransformed)
                Alert.alert("Peso", `Importar o peso: ${weightTransformed}`, [
                  {
                    text: "Errado",
                    onPress: () => console.log("apertou cancelar"),
                    style: "cancel"
                  },
                  {
                    text: "Correto",
                    onPress: () => setWeightt(weight),
                  }
                ])
              } catch (err) {
                if (err) {
                  console.log("error", err)
                  getTheCurrentWeight()
                }
              }
            })
          })
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => { })

    devices[0].onDisconnected((err, dev) => {
      console.log(dev)
    })
  }

  const action = [
    {
      text: "Home",
      icon: <Icon name="home" size={30} color={'#E9FFF9'} />,
      name: "home",
      position: 1
    },
  ]

  // pedir duas permisasões: BLUETOOTH_CONNECT, ACCESS_FINE_LOCATION
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainHeader}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ marginRight: 10, fontWeight: '800', color: '#E9FFF9', fontSize: 20 }}>Scan & connect</Text>
            <TouchableOpacity onPress={() => {
              ScanAndConnect(),
                setWaitingConnect(true)
            }}>
              <Icon name="clipboard-search" size={30} color={'#E9FFF9'} />
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity onPress={() => navigation.navigate("Home")}>
              <Icon name="home" size={30} color={'#E9FFF9'} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {devices.length > 0 ? (
          <View>
            <View style={styles.containerButtonsForAction}>
              <TouchableOpacity onPress={getTheCurrentWeight} style={styles.buttonsForActions}>
                <Text style={{ fontSize: 20, color: '#E9FFF9', marginRight: 5 }}>Peso</Text>
                <Icon name='cow' size={24} color={'#E9FFF9'} />
              </TouchableOpacity>
            </View>
            {/* Form */}
            <View>
              <Header theader={"Cadastro"} />
              <InputOptions weight={weightt} />
            </View>
          </View>
        ) : (
          <View style={styles.containerInstructions}>
            <View style={styles.instructions}>
              <Text style={{ color: '#424242', fontWeight: 'bold', fontSize: 18, textAlign: 'center' }}>Leia as instruções de como usar o App</Text>
            </View>
            <TouchableOpacity
              style={styles.containerButtonToInstructions}
              onPress={() => navigation.navigate('Instructions')}>
              <Text style={{ color: '#424242', fontWeight: 'bold', fontSize: 18, textAlign: 'center', marginRight: 5 }}>Leia aqui</Text>
              <Icon name="tooltip-text" size={30} color={'#E9FFF9'} />
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
      <ModalLoading open={waitingConnect} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#ffff'
  },
  line: {
    borderColor: 'grey',
    borderWidth: 2,
    width: '100%',
    elevation: 10
  },
  mainHeader: {
    width: '100%',
    padding: 12,
    backgroundColor: "#3F51B5",
    borderBottomColor: 'rgba(0, 0, 0, 0.3)',
    borderBottomWidth: 3
  },
  buttonsForActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    borderRadius: 5,
    backgroundColor: "#424242",
    width: 100,
  },
  containerButtonsForAction: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  saveButton: {
    borderRadius: 999,
    width: 70,
    alignItems: 'center',
    padding: 15,
    backgroundColor: "#424242"
  },
  instructions: {
    elevation: 10,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#ea7070',
  },
  containerInstructions: {
    width: 300,
    height: 550,
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerButtonToInstructions: {
    flexDirection: 'row',
    width: 150,
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

export default Cadastro
