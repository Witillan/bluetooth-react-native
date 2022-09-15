import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'
import React, { useCallback, useEffect, useState } from 'react'
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, PermissionsAndroid } from 'react-native'
import { FloatingAction } from 'react-native-floating-action'
import Icon from 'react-native-vector-icons/FontAwesome'
import { useSelector } from 'react-redux'

// icons
// redux
const Home = () => {
  const navigation = useNavigation()
  const devicesResultFromStore = useSelector((state) => state.counter.devicesResult)

  const [dataToDisplayFromAS, setdataToDisplayFromAS] = React.useState([])

  const action = [
    {
      text: 'Home',
      icon: <Icon name='home' size={30} color='#E9FFF9' />,
      name: 'home',
      position: 1
    },
    {
      text: 'Cadastro',
      icon: <Icon name='archive' size={25} color='#E9FFF9' />,
      name: 'cadastro',
      position: 2
    },
    {
      text: 'instruções',
      icon: <Icon name='comments-o' size={25} color='#E9FFF9' />,
      name: 'instrucao',
      position: 3
    }

  ]

  const gettingItem = async () => {
    try {
      const allkeys = await AsyncStorage.getAllKeys()
      const dataFromAS = await AsyncStorage.multiGet(allkeys)

      if (dataFromAS !== null) {
        dataFromAS.map((item) => {
          if (item[0] != '@permissions') {
            console.log(item[1])
            const hasDuplicate = dataToDisplayFromAS.filter((weight) => weight.brinco == JSON.parse(item[1]).brinco)
            if (hasDuplicate.length == 0) {
              setdataToDisplayFromAS(oldValue => [...oldValue, JSON.parse(item[1])])
            }
          }
        })
      } else {
        alert('Ocorreu um erro ao carregar a lista de pesagens!')
      }
    } catch (e) {
      alert(e)
    }
  }

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
      await PermissionsAndroid.request(
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

  const permissions = async () => {
    await requestBLUETOOTH_ADMINPermission()
    await requestLocationPermission()
    await BLUETOOTH_ADVERTISErequestPermission()
  }

  React.useEffect(() => {
    gettingItem()
    const getPermissions = async () => {
      await permissions()
    }
    (!devicesResultFromStore) && getPermissions()
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <>
        <View style={styles.mainHeader}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

            <Text style={{ marginRight: 10, fontWeight: '800', color: '#E9FFF9', fontSize: 20, letterSpacing: 3 }}>SYMMETRY</Text>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity onPress={() => navigation.navigate('Home')} style={{ marginRight: 30 }}>
                <Icon name='file-text' size={30} color='#E9FFF9' />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('User')}>
                <Icon name='user' size={30} color='#E9FFF9' />
              </TouchableOpacity>
            </View>
          </View>

        </View>

        {/* the latest insertions */}
        <ScrollView showsVerticalScrollIndicator={false} style={{ width: '100%', padding: 10 }}>
          {dataToDisplayFromAS.map((item, index) => (
            <View key={index} style={{ borderWidth: 1, borderColor: 'blue', height: 150, borderRadius: 5, backgroundColor: '#E9FFF9', marginTop: 5, marginBottom: 15 }}>
              <View style={{
                width: '100%', height: 45, borderTopRightRadius: 3, borderTopLeftRadius: 3, backgroundColor: '#3F51B5',
                flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
              }}>
                <Text style={{ color: '#E9FFF9', fontSize: 16, marginLeft: 5 }}>Brinco: {item.brinco}</Text>
                <Text style={{ color: '#E9FFF9', fontSize: 13, marginBottom: 20, marginRight: 5 }}>{item.date}</Text>
              </View>
              <View style={{ flexDirection: 'row', height: '100%' }}>
                <View style={{ width: '50%', justifyContent: 'space-between', height: 108, alignItems: 'flex-start', padding: 5 }}>
                  <Text style={{ fontWeight: '700', letterSpacing: 1 }}>Peso(KG): {item.peso}</Text>
                  <Text style={{ fontWeight: '700', letterSpacing: 1 }}>Raça: {item.raca}</Text>
                  <Text style={{ fontWeight: '700', letterSpacing: 1 }}>Sexo: {item.sexo}</Text>
                  <Text style={{ fontWeight: '700', letterSpacing: 1 }}>Idade: {item.idade}</Text>
                  <Text style={{ fontWeight: '700', letterSpacing: 1 }}>valor médio: {item.valorMedio}</Text>
                </View>
                <View style={{ width: '50%', justifyContent: 'space-between', height: 108, alignItems: 'flex-end', padding: 5 }}>
                  <Text style={{ fontWeight: '700', letterSpacing: 1 }}>Fazenda: {item.fazenda}</Text>
                  <TouchableOpacity onPress={() => console.log(item.brinco)}>
                    <Icon name='remove' size={38} color='#ea7070' />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
        <FloatingAction
          actions={action}
          onPressItem={(item) => {
            if (item === 'home') {
              navigation.navigate('Home')
            } else if (item === 'cadastro') {
              navigation.navigate('Cadastro', { permissions: true })
            } else if (item === 'instrucao') {
              navigation.navigate('Instructions')
            }
          }}
        />
      </>
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
    backgroundColor: '#3F51B5',
    borderBottomColor: 'rgba(0, 0, 0, 0.3)',
    borderBottomWidth: 3
  },
  buttonsForActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    borderRadius: 5,
    backgroundColor: '#424242',
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
    backgroundColor: '#424242'
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

export default Home
