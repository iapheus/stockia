import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, View, ScrollView } from 'react-native';
import { colors } from '../constants/colors';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link } from 'expo-router';
import { general } from '../constants/general';
import { Entypo } from '@expo/vector-icons';

export default function App() {
	const [storage, setStorage] = useState<string[]>([]);
	const [marketCountry, setMarketCountry] = useState<string>('turkey');
	const [symbols, setSymbols] = useState<any[]>([]);
	const [intervalReactive, setIntervalReactive] = useState(false);

	useEffect(() => {
		const fetchKeys = async () => {
			try {
				const keys = await AsyncStorage.getItem('favorites');
				const market = await AsyncStorage.getItem('marketCountry');
				const parsedKeys = keys ? JSON.parse(keys) : [];
				setStorage(parsedKeys);

				if (market) setMarketCountry(market);
			} catch (error) {
				console.warn('Error fetching storage:', error);
			}
		};
		fetchKeys();
	}, []);

	useEffect(() => {
		const fetchData = async () => {
			const fetchedSymbols: any[] = [];

			for (const item of storage) {
				try {
					let url = '';
					let currentMarket = marketCountry;

					if (!item.startsWith('FX_IDC')) {
						const stockName = item.includes(':') ? item.split(':')[1] : item;
						const stockPrefix = item.includes(':') ? item.split(':')[0] : '';
						if (stockPrefix.toUpperCase() === 'NASDAQ')
							currentMarket = 'america';
						else if (stockPrefix.toUpperCase() === 'NSE')
							currentMarket = 'india';
						else currentMarket = marketCountry;
						url = `${general.API_ADDRESS}/v1/stock/${currentMarket}/${stockName}`;
					} else {
						const currencyName = item.includes(':') ? item.split(':')[1] : item;
						url = `${general.API_ADDRESS}/v1/currency/${currencyName}`;
					}

					const resp = await fetch(url);
					const data = await resp.json();

					if (item.startsWith('FX_IDC')) {
						if (Array.isArray(data.data) && data.data.length > 0) {
							fetchedSymbols.push(data.data[0]);
						}
					} else {
						if (
							data.data?.items &&
							Array.isArray(data.data.items) &&
							data.data.items.length > 0
						) {
							fetchedSymbols.push(data.data.items[0]);
						}
					}
				} catch (error) {
					console.warn(`Error fetching data for ${item}:`, error);
				}
			}

			setSymbols(fetchedSymbols);
		};

		if (storage.length > 0) fetchData();

		const intervalId = setInterval(() => {
			setIntervalReactive((val) => !val);
			fetchData();
		}, 150000);

		return () => clearInterval(intervalId);
	}, [intervalReactive, storage, marketCountry]);

	if (storage.length === 0) {
		return (
			<SafeAreaView style={styles.container}>
				<Text style={styles.emptyText}>No favorite symbols found</Text>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView style={styles.scroll}>
				{symbols.length > 0 ? (
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
							<Link href={`/details/${item.symbolCode || item.currency}`}>
								<Entypo
									suppressHighlighting={true}
									name="chevron-with-circle-right"
									size={32}
									color="black"
								/>
							</Link>
						</View>
					))
				) : (
					<Text style={styles.emptyText}>Fetching data...</Text>
				)}
			</ScrollView>
			<StatusBar style="dark" translucent />
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
