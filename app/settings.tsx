import { StatusBar } from 'expo-status-bar';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Platform,
  ScrollView,
  Button,
  Pressable,
} from 'react-native';
import { colors } from '../constants/colors';
import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Settings() {
  const [baseCurrency, setBaseCurrency] = useState('default');
  const [marketCountry, setMarketCountry] = useState('default');
  const [newsLanguage, setNewsLanguage] = useState('en');

  async function handleSave() {
    try {
      await AsyncStorage.setItem('baseCurrency', baseCurrency);
      await AsyncStorage.setItem('marketCountry', marketCountry);
      await AsyncStorage.setItem('newsLanguage', newsLanguage);
      alert('Settings saved!');
    } catch (e) {
      console.error('Saving error: ', e);
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>Base Currency</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={baseCurrency}
            onValueChange={(itemValue) => setBaseCurrency(itemValue)}
            style={styles.picker}
            dropdownIconColor='#666'
          >
            <Picker.Item label='Default' value='default' />
            <Picker.Item label='USD' value='usd' />
            <Picker.Item label='EUR' value='eur' />
            <Picker.Item label='CHF' value='chf' />
            <Picker.Item label='TRY' value='try' />
            <Picker.Item label='JPY' value='jpy' />
          </Picker>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Market Country</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={marketCountry}
            onValueChange={(itemValue) => setMarketCountry(itemValue)}
            style={styles.picker}
            dropdownIconColor='#666'
          >
            <Picker.Item label='Default' value='default' />
            <Picker.Item label='USA' value='usa' />
            <Picker.Item label='Germany' value='germany' />
            <Picker.Item label='Turkey' value='turkey' />
            <Picker.Item label='Japan' value='japan' />
            <Picker.Item label='Hong Kong' value='hongkong' />
          </Picker>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>News Language</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={newsLanguage}
            onValueChange={(itemValue) => setNewsLanguage(itemValue)}
            style={styles.picker}
            dropdownIconColor='#666'
          >
            <Picker.Item label='English' value='en' />
            <Picker.Item label='Turkish' value='tr' />
            <Picker.Item label='German' value='de' />
          </Picker>
        </View>
      </View>

      <Pressable style={styles.saveSettingsButton}>
        <Button
          title='Save the changes'
          color='black'
          onPress={handleSave}
        ></Button>
      </Pressable>

      <StatusBar style='dark' translucent />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.secondaryDarkBG,
    paddingTop: Platform.OS === 'android' ? 40 : 75,
    paddingBottom: Platform.OS === 'android' ? 40 : 100,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#222',
    textAlign: 'center',
  },
  card: {
    backgroundColor: colors.lightBG,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  label: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  pickerWrapper: {
    borderRadius: 10,
    // backgroundColor: '#f2f2f2',
    overflow: Platform.OS === 'android' ? 'hidden' : 'visible',
  },
  picker: {
    height: Platform.OS === 'android' ? 44 : undefined,
    color: '#000',
    width: '100%',
  },
  saveSettingsButton: {
    marginBottom: 150,
    padding: 12,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 16,
  },
});
