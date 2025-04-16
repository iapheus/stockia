import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { colors } from '../constants/colors';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
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
