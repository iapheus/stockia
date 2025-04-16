import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../constants/colors';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [values, setValues] = useState({});

  useEffect(() => {
    AsyncStorage.multiGet([
      'baseCurrency',
      'marketCountry',
      'newsLanguage',
    ]).then((result) => {
      const settings = {
        baseCurrency: result[0][1],
        marketCountry: result[1][1],
        newsLanguage: result[2][1],
      };
      console.log(settings);
      setValues(settings);
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={{ color: 'black' }}>Base: {values.baseCurrency}</Text>
      <Text style={{ color: 'black' }}>Market: {values.marketCountry}</Text>
      <Text style={{ color: 'black' }}>News: {values.newsLanguage}</Text>
      <StatusBar style='auto' translucent />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.secondaryDarkBG,
    borderBottomRightRadius: 50,
    borderBottomLeftRadius: 50,
    padding: 20,
    justifyContent: 'center',
  },
});
