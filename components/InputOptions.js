import AsyncStorage from '@react-native-async-storage/async-storage';
import * as React from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import uuid from 'react-native-uuid';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import ButtonAgeCattle from './ButtonAgeCattle';
import RadioButton from './RadioButton';

// components
const InputOptions = ({ weight }) => {
  const [farm, setFarm] = React.useState('Fazenda feliz');
  const [earing, setearing] = React.useState();
  const [age, setAge] = React.useState();
  const [race, setRace] = React.useState();
  const [value, setValue] = React.useState();
  const [sex, setSex] = React.useState();

  const gettingItem = async earing => {
    const allkeys = await AsyncStorage.getAllKeys();
    const dataFromAS = await AsyncStorage.multiGet(allkeys);

    if (dataFromAS !== null) {
      dataFromAS.map((item) => {
        if (item[0] != '@permissions') {
          console.log(item[1]);
          if (!item[1]) {
            return;
          }
          const hasDuplicate = JSON.parse(item[1]).brinco === earing;
          console.log(hasDuplicate);
          console.log(item[1].brinco);
          if (hasDuplicate) {
            alert('Já existe um animal cadastrado com esse brinco');
            throw new Error('Já existe um animal cadastrado com esse brinco');
          }
        }
      });
    } else {
      alert('nao deu');
    }
  };

  const insertingInRealmDB = async () => {
    try {
      await gettingItem(earing.trim());

      alert('passsou');
      const objetToInsert = {
        fazenda: farm,
        brinco: earing.trim(),
        peso: parseFloat(weight),
        idade: age,
        raca: race,
        valorMedio: parseFloat(value),
        sexo: sex,
      };

      const jsonValue = JSON.stringify(objetToInsert);

      await AsyncStorage.setItem(`${uuid.v4()}`, jsonValue);

      const allk = await AsyncStorage.getAllKeys();
      const ArrayOfJsonStr = await AsyncStorage.multiGet(allk);

      ArrayOfJsonStr.map((item, index) => {
        console.log(JSON.parse(item[1]));
      });
      // await AsyncStorage.getItem()
      alert('Cadastrado com sucesso');
    } catch (e) {
      alert(e);
    }
  };

  return (
    <>
      {/* farm */}
      <KeyboardAvoidingView>
        <View style={style.container}>
          <Text style={style.textColor}>Fazenda</Text>
          <View style={style.inputStyle}>
            <TextInput
              value={farm}
              placeholder={'Ex: Fazendinha'}
              keyboardType={'none'}
              editable={false}
            />
          </View>
        </View>
        {/* weight */}
        <View style={style.container}>
          <Text style={style.textColor}>Peso</Text>
          <View style={style.inputStyle}>{console.log('(' + weight + ')')}
            <TextInput value={weight} keyboardType={'none'} editable={false} />
          </View>
        </View>
        {/* earings */}
        <View style={style.container}>
          <Text style={style.textColor}>Brincos</Text>
          <View style={style.inputStyle}>
            <TextInput onChangeText={val => setearing(val)} numberOfLines={2} maxLength={22} />
          </View>
        </View>
        {/* age of cattle */}
        <Text style={{ color: '#424242', paddingLeft: 3, marginLeft: 8 }}>
          Idade
        </Text>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          horizontal={true}
          style={{ padding: 3, marginTop: 2 }}>
          <ButtonAgeCattle gettingValue={setAge} />
        </ScrollView>
        {/* raça */}
        <View style={style.container}>
          <Text style={style.textColor}>Raça</Text>
          <View style={style.inputStyle}>
            <TextInput
              onChangeText={val => setRace(val)}
              placeholder={'Ex: Nelore'}
            />
          </View>
        </View>
        {/*  radio button sex */}
        <Text style={{ color: '#424242', paddingLeft: 3, marginLeft: 8 }}>
          Sexo
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
            padding: 3,
          }}>
          <RadioButton getValue={setSex} />
        </View>
        {/* avarange coast */}
        <View style={style.container}>
          <Text style={style.textColor}>Custo médio</Text>
          <View style={style.inputStyle}>
            <TextInput
              onChangeText={val => setValue(val)}
              placeholder={'Ex: 2000'}
              keyboardType="numeric"
            />
          </View>
        </View>
      </KeyboardAvoidingView>
      <View style={{ padding: 2, alignItems: 'flex-start', marginTop: 3 }}>
        <TouchableOpacity style={style.saveButton} onPress={insertingInRealmDB}>
          <Icon name="cloud-upload" size={40} color={'#E9FFF9'} />
        </TouchableOpacity>
      </View>
    </>
  );
};

export default InputOptions;

const style = StyleSheet.create({
  container: {
    padding: 3,
    marginTop: 2,
  },
  textColor: {
    color: '#424242',
    marginLeft: 8,
    marginBottom: 1,
  },
  inputStyle: {
    elevation: 1,
    borderRadius: 999,
    paddingLeft: 8,
    backgroundColor: '#E9FFF9',
  },
  saveButton: {
    borderRadius: 999,
    width: 70,
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#424242',
  },
});
