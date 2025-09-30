import {
	FlatList,
	Pressable,
	StyleSheet,
	Text,
	TextInput,
	View,
	Alert,
} from 'react-native';
import { useEffect, useState } from 'react';
import { colors } from '../constants/colors';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { general } from '../constants/general';

export default function Search() {
	const [symbolInput, setSymbolInput] = useState('');
	const [showError, setShowError] = useState(false);
	const [selection, setSelection] = useState<'stock' | 'currency'>('stock');
	const [results, setResults] = useState<any[]>([]);
	const [favorites, setFavorites] = useState<string[]>([]);
	const [marketCountry, setMarketCountry] = useState<string>('turkey');

	useEffect(() => {
		const fetchMarket = async () => {
			const storedMarket = await AsyncStorage.getItem('marketCountry');
			if (storedMarket) setMarketCountry(storedMarket);
		};
		fetchMarket();
	}, []);

	const handleSymbolSearch = async () => {
		if (!symbolInput.trim()) {
			setShowError(true);
			setTimeout(() => setShowError(false), 3000);
			return;
		}

		try {
			let endpoint = '';
			let currentMarket = marketCountry;

			if (selection === 'stock') {
				const [prefix, name] = symbolInput.includes(':')
					? symbolInput.split(':')
					: ['', symbolInput];

				if (prefix.toUpperCase() === 'NASDAQ') currentMarket = 'america';
				else if (prefix.toUpperCase() === 'NSE') currentMarket = 'india';
				else currentMarket = marketCountry;

				endpoint = `${general.API_ADDRESS}/v1/stock/${currentMarket}/${name}`;
			} else {
				endpoint = `${general.API_ADDRESS}/v1/currency/${symbolInput}`;
			}

			const res = await fetch(endpoint);
			const data = await res.json();

			if (selection === 'stock' && data.data?.items) {
				setResults(data.data.items);
			} else if (selection === 'currency' && Array.isArray(data.data)) {
				setResults(data.data);
			} else {
				setResults([]);
				Alert.alert('No results found');
			}
		} catch (error) {
			console.error('API Error:', error);
			Alert.alert('API Error', 'Failed to fetch data. Try again.');
		}
	};

	const toggleFavorite = async (symbolCode: string) => {
		try {
			const storedFavorites = await AsyncStorage.getItem('favorites');
			let favoritesArray: string[] = storedFavorites
				? JSON.parse(storedFavorites)
				: [];

			if (!Array.isArray(favoritesArray)) favoritesArray = [];

			if (favoritesArray.includes(symbolCode)) {
				favoritesArray = favoritesArray.filter((item) => item !== symbolCode);
			} else {
				favoritesArray.push(symbolCode);
			}

			await AsyncStorage.setItem('favorites', JSON.stringify(favoritesArray));
			setFavorites(favoritesArray);
		} catch (error) {
			console.error('Error updating favorites:', error);
		}
	};

	const renderItem = ({ item }: any) => {
		const isFavorite = favorites.includes(item.symbolCode || item.currency);

		return (
			<View style={styles.card}>
				<View style={{ flex: 1 }}>
					<Text style={styles.symbol}>{item.symbolCode || item.currency}</Text>
					<Text style={styles.name}>{item.description || item.name}</Text>
					<Text style={styles.price}>Close: {item.close ?? '-'}</Text>
					<Text
						style={[
							styles.change,
							{ color: (item.change ?? 0) > 0 ? 'green' : 'red' },
						]}
					>
						Change: {(item.change ?? 0).toFixed(4)}
					</Text>
				</View>
				<Pressable
					onPress={() => toggleFavorite(item.symbolCode || item.currency)}
				>
					<Ionicons
						name={isFavorite ? 'heart' : 'heart-outline'}
						size={24}
						color={isFavorite ? 'red' : '#888'}
					/>
				</Pressable>
			</View>
		);
	};

	return (
		<View style={styles.container}>
			<View style={styles.searchArea}>
				<TextInput
					style={styles.input}
					placeholder="Symbol Name"
					placeholderTextColor="#888"
					value={symbolInput}
					onChangeText={setSymbolInput}
				/>
				<Pressable
					style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]}
					onPress={handleSymbolSearch}
				>
					<Text style={styles.btnText}>Search</Text>
				</Pressable>
			</View>

			<View style={styles.radioGroup}>
				{['stock', 'currency'].map((type) => (
					<Pressable
						key={type}
						style={styles.radioWrapper}
						onPress={() => setSelection(type as 'stock' | 'currency')}
					>
						<View style={styles.radioContainer}>
							<View
								style={[
									styles.radioOuter,
									selection === type && styles.radioOuterSelected,
								]}
							>
								{selection === type && <View style={styles.radioInner} />}
							</View>
							<Text style={styles.radioLabel}>
								{type.charAt(0).toUpperCase() + type.slice(1)}
							</Text>
						</View>
					</Pressable>
				))}
			</View>

			{showError && (
				<View style={styles.emptyInputText}>
					<Text style={{ color: 'red' }}>Input cannot be empty!</Text>
				</View>
			)}

			<FlatList
				data={results}
				keyExtractor={(_, index) => index.toString()}
				renderItem={renderItem}
				ListEmptyComponent={
					<View style={styles.emptyContainer}>
						<Text style={styles.emptyText}>No results yet</Text>
					</View>
				}
				contentContainerStyle={{ flexGrow: 1 }}
				keyboardShouldPersistTaps="handled"
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.secondaryDarkBG,
		paddingTop: 75,
		paddingHorizontal: 20,
	},
	searchArea: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 12,
		gap: 12,
	},
	input: {
		flex: 1,
		backgroundColor: '#f2f2f2',
		borderRadius: 10,
		paddingHorizontal: 16,
		paddingVertical: 12,
		fontSize: 16,
		color: '#333',
	},
	btn: {
		backgroundColor: '#2b768f',
		borderRadius: 10,
		paddingVertical: 12,
		paddingHorizontal: 18,
	},
	btnPressed: { opacity: 0.8 },
	btnText: { fontSize: 16, color: '#fff', fontWeight: '600' },
	radioGroup: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 20,
		gap: 24,
	},
	radioWrapper: { padding: 4 },
	radioContainer: { flexDirection: 'row', alignItems: 'center' },
	radioOuter: {
		width: 20,
		height: 20,
		borderRadius: 10,
		borderWidth: 2,
		borderColor: '#ccc',
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 8,
	},
	radioOuterSelected: { borderColor: '#4A90E2' },
	radioInner: {
		width: 10,
		height: 10,
		borderRadius: 5,
		backgroundColor: '#4A90E2',
	},
	radioLabel: { fontSize: 16, color: 'black' },
	emptyInputText: { alignItems: 'center', marginBottom: 10 },
	card: {
		backgroundColor: '#fff',
		borderRadius: 12,
		padding: 16,
		marginBottom: 12,
		flexDirection: 'row',
		alignItems: 'center',
		elevation: 2,
	},
	symbol: { fontSize: 18, fontWeight: 'bold', color: '#4A90E2' },
	name: { fontSize: 14, color: '#555', marginVertical: 2 },
	price: { fontSize: 16, fontWeight: '500' },
	change: { fontSize: 14, marginTop: 2 },
	emptyContainer: {
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 50,
	},
	emptyText: { color: '#aaa', fontSize: 16, fontStyle: 'italic' },
});
