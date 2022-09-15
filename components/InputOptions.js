import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Yup from 'yup';
import { Formik } from 'formik';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import ButtonAgeCattle from './ButtonAgeCattle';
import RadioButton from './RadioButton';

// components
const InputOptions = ({ weight, focus }) => {
  const weightRef = React.useRef(null)
  const earingRef = React.useRef(null)

  const [editable, setEditable] = useState(true)

  const getFocusInputWeight = () => {
    weightRef.current.focus()
  }

  const getFocusInputEaring = () => {
    earingRef.current.focus()
  }

  React.useMemo(() => {
    setEditable(true)
    console.log(weightRef)
    console.log(weight)
    if (weightRef.current != null) {
      getFocusInputWeight()
    }
  }, [weight])

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

  const insertingInRealmDB = async (values) => {
    try {
      console.log(values + 'ss')
      // await gettingItem(earing.trim());

      // alert('passsou');
      // const objetToInsert = {
      //   fazenda: farm,
      //   brinco: earing.trim(),
      //   peso: parseFloat(weight),
      //   idade: age,
      //   raca: race,
      //   valorMedio: parseFloat(value),
      //   sexo: sex,
      // };

      // const jsonValue = JSON.stringify(objetToInsert);

      // await AsyncStorage.setItem(`${uuid.v4()}`, jsonValue);

      // const allk = await AsyncStorage.getAllKeys();
      // const ArrayOfJsonStr = await AsyncStorage.multiGet(allk);

      // ArrayOfJsonStr.map((item, index) => {
      //   console.log(JSON.parse(item[1]));
      // });
      // // await AsyncStorage.getItem()
      alert('Cadastrado com sucesso');
    } catch (e) {
      alert(e);
    }
  };

  const RegistrationSchema = Yup.object().shape({
    farm: Yup.string().max(50, 'Nome de empresa muito grande, máximo 50 letras').required('Required'),
    weight: Yup.number().required('Required'),
    earing: Yup.string().max(22, 'Valor maior do que 22').required('Required'),
    age: Yup.number().required('Required'),
    race: Yup.string().max(15).required('Required'),
    gender: Yup.string().required('Required'),
    averageCost: Yup.number().required('Required'),
  });

  return (
    <Formik
      initialValues={{ farm: "Fazenda Olhos D'agua", weight: weight, earing: '', age: '', race: '', gender: '', averageCost: '' }}
      onSubmit={values => insertingInRealmDB(values)}
      validationSchema={RegistrationSchema}
    >
      {({ handleChange, handleSubmit, values, errors, touched, setFieldValue }) => (
        <KeyboardAvoidingView>
          <View style={style.container}>
            <Text style={style.textColor}>Fazenda</Text>
            <View style={style.inputStyle}>
              <TextInput
                value={values.farm}
                placeholder={'Ex: Fazendinha'}
                keyboardType={'none'}
                editable={false}
              />
            </View>
            {errors.farm && touched.farm ? (
              <Text style={style.required}>{errors.farm}</Text>
            ) : null}
          </View>
          <View style={style.container}>
            <Text style={style.textColor}>Peso</Text>
            <View style={style.inputStyle}>
              <TextInput ref={weightRef} value={values.weight} onFocus={() => { setFieldValue('weight', weight), getFocusInputEaring(), setEditable(false), alert('Pegou foco')}} onChangeText={handleChange('weight')} keyboardType={'none'}/>
            </View>
            {errors.weight && touched.weight ? (
              <Text style={style.required}>{errors.weight}</Text>
            ) : null}
          </View>
          <View style={style.container}>
            <Text style={style.textColor}>Brincos</Text>
            <View style={style.inputStyle}>
              <TextInput ref={earingRef} onChangeText={handleChange('earing')} value={values.earing} numberOfLines={2} maxLength={22} />
            </View>
            {errors.earing && touched.earing ? (
              <Text style={style.required}>{errors.earing}</Text>
            ) : null}
          </View>
          <Text style={{ color: '#424242', paddingLeft: 3, marginLeft: 8 }}>
            Idade
          </Text>
          <ScrollView
            showsHorizontalScrollIndicator={false}
            horizontal={true}
            style={{ padding: 3, marginTop: 2 }}>
            <ButtonAgeCattle gettingValue={(value) => setFieldValue('age', value)} />
          </ScrollView>
          {errors.age && touched.age ? (
            <Text style={[{ padding: 3 }, style.required]} >{errors.age}</Text>
          ) : null}
          <View style={style.container}>
            <Text style={style.textColor}>Raça</Text>
            <View style={style.inputStyle}>
              <TextInput
                onChangeText={handleChange('race')}
                placeholder={'Ex: Nelore'}
              />
            </View>
            {errors.race && touched.race ? (
              <Text style={style.required}>{errors.race}</Text>
            ) : null}
          </View>
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
            <RadioButton getValue={(value) => setFieldValue('gender', value)} />
          </View>
          {errors.gender && touched.gender ? (
            <Text style={[{ padding: 3 }, style.required]}>{errors.gender}</Text>
          ) : null}
          <View style={style.container}>
            <Text style={style.textColor}>Custo médio</Text>
            <View style={style.inputStyle}>
              <TextInput
                value={values.averageCost}
                onChangeText={handleChange('averageCost')}
                placeholder={'Ex: 2000'}
                keyboardType="numeric"
              />
            </View>
            {errors.averageCost && touched.averageCost ? (
              <Text style={style.required}>{errors.averageCost}</Text>
            ) : null}
          </View>
          <View style={{ padding: 2, alignItems: 'flex-start', marginTop: 3 }}>
            <TouchableOpacity style={style.saveButton} onPress={handleSubmit}>
              <Icon name="cloud-upload" size={40} color={'#E9FFF9'} />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      )}
    </Formik>
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
  required: {
    color: 'red'
  }
});
