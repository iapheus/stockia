import { StatusBar } from 'expo-status-bar';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
} from 'react-native';
import { colors } from '../constants/colors';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Link } from 'expo-router';

export default function App() {
  const [storage, setStorage] = useState<string[]>([]); // Dizi olarak tanımladık
  const [marketCountry, setMarketCountry] = useState<string | null>(null);
  const [symbols, setSymbols] = useState<any[]>([]); // Symbol verilerini dizi olarak tutuyoruz
  const [intervalReactive, setIntervalReactive] = useState(false);

  // AsyncStorage'den verileri al
  useEffect(() => {
    const fetchKeys = async () => {
      const keys = await AsyncStorage.getItem('favorites');
      const market = await AsyncStorage.getItem('marketCountry');
      const parsedKeys = keys ? JSON.parse(keys) : [];
      setStorage(parsedKeys);
      setMarketCountry(market);
    };
    fetchKeys();
  }, []);

  // API'den verileri al ve interval ile güncelle
  useEffect(() => {
    const fetchData = async () => {
      const fetchedSymbols: any[] = [];

      for (const item of storage) {
        try {
          let url = '';
          // Döviz verisi için
          if (item.startsWith('FX_IDC')) {
            url = `http://192.168.1.103:3000/api/v1/currency/${item.slice(
              item.indexOf(':') + 1
            )}`;
          }
          // Borsa verisi için
          else {
            url = `http://192.168.1.103:3000/api/v1/stock/${marketCountry}/${item.slice(
              item.indexOf(':') + 1
            )}`;
          }

          const resp = await fetch(url);
          const data = await resp.json();

          // Döviz verisi (FX_IDC) için gelen veriyi işle
          if (item.startsWith('FX_IDC')) {
            if (Array.isArray(data.data)) {
              fetchedSymbols.push(data.data[0]); // Tek bir nesne ise
            }
          }
          // Borsa verisi (BIST) için gelen veriyi işle
          else {
            if (Array.isArray(data.data.items)) {
              fetchedSymbols.push(data.data.items[0]); // Tek bir nesne ise
            }
          }
        } catch (error) {
          console.warn(`Error fetching data for ${item}:`, error);
        }
      }
      // Tüm gelen veriyi state'e kaydet
      setSymbols(fetchedSymbols);
    };

    if (storage.length > 0 && marketCountry) {
      fetchData();
    }

    const intervalId = setInterval(() => {
      setIntervalReactive((val) => !val);
      fetchData();
    }, 15000);

    return () => clearInterval(intervalId); // Cleanup interval
  }, [intervalReactive, storage, marketCountry]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scroll}>
        {symbols && symbols.length > 0 ? (
          symbols.map((item, index) => (
            <View key={index} style={styles.card}>
              <View style={{ flex: 1 }}>
                <Text style={styles.symbol}>
                  {item.symbolCode || item.currency}
                </Text>
                <Text style={styles.name}>{item.description}</Text>
                <Text style={styles.price}>Close: {item.close}</Text>
                <Text
                  style={[
                    styles.change,
                    { color: item.change > 0 ? 'green' : 'red' },
                  ]}
                >
                  Change: {item.change?.toFixed(2)}
                </Text>
              </View>
              <Link href={`/details/${item.symbolCode}`}>
                <AntDesign
                  name='rightcircleo'
                  size={32}
                  suppressHighlighting={true}
                  color='black'
                />
              </Link>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No data available</Text>
        )}
      </ScrollView>
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
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    borderColor: 'gray',
    borderWidth: 1,
    marginHorizontal: 10,
  },
  symbol: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  name: {
    fontSize: 14,
    color: '#555',
    marginVertical: 2,
  },
  price: {
    fontSize: 16,
    fontWeight: '500',
  },
  change: {
    fontSize: 14,
    marginTop: 2,
  },
  emptyText: {
    color: '#aaa',
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 20,
  },
  scroll: {
    marginVertical: 50,
    gap: 15,
  },
});
