import { useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { colors } from '../../constants/colors';

export default function index() {
  const { symbol } = useLocalSearchParams();
  return (
    <ScrollView style={styles.container}>
      <Text>{symbol}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 70,
    backgroundColor: colors.secondaryDarkBG,
  },
});
