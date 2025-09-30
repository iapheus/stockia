import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, ActivityIndicator } from 'react-native';
import { colors } from '../../constants/colors';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link } from 'expo-router';
import {general} from '../../constants/general';

export default function App() {
	const [values, setValues] = useState({});
	const [favorites, setFavorites] = useState<string[]>([]);
	const [newsData, setNewsData] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchSettingsAndFavorites = async () => {
			try {
				const result = await AsyncStorage.multiGet([
					'baseCurrency',
					'marketCountry',
					'newsLanguage',
					'favorites',
				]);

				const settings = {
					baseCurrency: result[0][1],
					marketCountry: result[1][1],
					newsLanguage: result[2][1],
				};

				setValues(settings);

				const favs = result[3][1] ? JSON.parse(result[3][1]) : [];
				setFavorites(favs);

				if (favs.length > 0) {
					const baseUrl = general.API_ADDRESS
					const responses = await Promise.all(
					  favs.map((fav) =>
						fetch(`${baseUrl}/v1/stock/news?stockName=${fav}`).then((res) =>
						  res.json()
						)
					  )
					);

					setNewsData(responses);
				}
			} catch (err) {
				console.error('Error fetching data:', err);
			} finally {
				setLoading(false);
			}
		};

		fetchSettingsAndFavorites();
	}, []);

	if (loading) {
		return (
		  <View style={styles.loadingContainer}>
			  <ActivityIndicator size='large' color='#1E90FF' />
		  </View>
		);
	}

	return (
	  <ScrollView style={styles.container}>
		  {newsData.length > 0 ? (
			newsData.map((newsSet, idx) => (
			  <View key={idx} style={styles.card}>
				  <Text style={styles.stockTitle}>{favorites[idx]}</Text>
				  {newsSet?.data?.slice(0, 5).map((news, i) => (
					<View key={i} style={{ marginBottom: 10 }}>
						<Link href={`https://tradingview.com${news.storyPath}`}>
							<Text style={styles.newsTitle}>{news.title}</Text>
						</Link>
						<Text style={styles.newsText}>
							Published: {new Date(news.published * 1000).toLocaleDateString()}
						</Text>
					</View>
				  ))}
			  </View>
			))
		  ) : (
			<Text style={{ color: 'black' }}>No favorites found</Text>
		  )}

		  <StatusBar style='auto' translucent />
	  </ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.secondaryDarkBG,
		borderBottomRightRadius: 50,
		borderBottomLeftRadius: 50,
		padding: 20,
	},
	loadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: colors.secondaryDarkBG,
	},
	sectionTitle: {
		fontSize: 22,
		fontWeight: 'bold',
		marginVertical: 15,
		color: 'black',
	},
	card: {
		backgroundColor: '#fff',
		paddingHorizontal: 15,
		paddingTop:46,
		borderRadius: 12,
		marginBottom: 20,
	},
	stockTitle: {
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 10,
		color: '#19589b',
	},
	newsTitle: {
		fontSize: 16,
		fontWeight: '600',
		color: '#333',
	},
	newsText: {
		fontSize: 14,
		color: '#555',
	},
});
