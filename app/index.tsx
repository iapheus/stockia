import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { colors } from '../constants/colors';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [storage, setStorage] = useState();

  useEffect(() => {
    const fetchKeys = async () => {
      const keys = await AsyncStorage.getItem('favorites');
      setStorage(keys);
    };

    fetchKeys();
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <Text>{storage}</Text>
      <StatusBar style='dark' translucent />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.secondaryDarkBG,
    borderBottomRightRadius: 50,
    borderBottomLeftRadius: 50,
  },
});
