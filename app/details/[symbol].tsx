import React, { useEffect, useState } from 'react';
import { Link, useLocalSearchParams } from 'expo-router';
import {
	ScrollView,
	StyleSheet,
	Text,
	View,
	ActivityIndicator,
	Button,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { general } from '../../constants/general';

export default function Index() {
	const { symbol } = useLocalSearchParams();
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [visibleItemsCount, setVisibleItemsCount] = useState(5);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const marketCountry = await AsyncStorage.getItem('marketCountry');
				const lang = await AsyncStorage.getItem('newsLanguage');
				if (!marketCountry || !lang) {
					console.error('Keys not found in AsyncStorage');
					return;
				}

				const isCurrency = symbol.startsWith('FX_IDC');
				const baseUrl = general.API_ADDRESS;

				const urls = isCurrency
					? [
							`${baseUrl}/v1/currency/${symbol.slice(symbol.indexOf(':') + 1)}`,
							`${baseUrl}/v1/currency/events/${symbol.slice(
								symbol.indexOf(':') + 1
							)}`,
							`${baseUrl}/v1/currency/performance/${symbol.slice(
								symbol.indexOf(':') + 1
							)}`,
							`${baseUrl}/v1/currency/news/${symbol.slice(
								symbol.indexOf(':') + 1
							)}/${lang}`,
					  ]
					: [
							`${baseUrl}/v1/stock/${marketCountry}/${symbol.slice(
								symbol.indexOf(':') + 1
							)}`,
							`${baseUrl}/v1/stock/news?stockName=${symbol}`,
							`${baseUrl}/v1/stock/performance?stockName=${symbol}`,
					  ];

				const responsePromises = urls.map((url) =>
					fetch(url).then((res) => res.json())
				);
				const responses = await Promise.all(responsePromises);
				setData(responses);
			} catch (error) {
				console.error('Data fetching error:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [symbol]);

	const loadMore = () => {
		setVisibleItemsCount(visibleItemsCount + 5);
	};

	const isCurrency = symbol.startsWith('FX_IDC');

	if (loading) {
		return (
			<View style={styles.loadingContainer}>
				<ActivityIndicator size="large" color="#1E90FF" />
			</View>
		);
	}

	return (
		<ScrollView style={styles.container}>
			<View style={styles.dataSection}>
				<Text style={styles.sectionTitle}>General Information</Text>
				{data && data[0]?.data?.items ? (
					<View style={styles.dataItem}>
						<View key={0}>
							<Text style={styles.dataTitle}>{data[0].data.items[0].name}</Text>
							<Text style={styles.dataText}>
								{data[0].data.items[0].description}
							</Text>
							<Text style={styles.dataText}>
								Close: {data[0].data.items[0].close}
							</Text>
							<Text style={styles.dataText}>
								Change: {data[0].data.items[0].change.toFixed(2)}%
							</Text>
						</View>
					</View>
				) : (
					<Text style={{ marginBottom: 25 }}>No data available</Text>
				)}
			</View>

			<View style={styles.dataSection}>
				<Text style={styles.sectionTitle}>Performance</Text>
				{data && data[2]?.data ? (
					<View style={styles.dataItem}>
						{Object.entries(data[2].data).map(([key, value], index) => (
							<View key={index} style={{ flexDirection: 'row', gap: 10 }}>
								<Text style={styles.dataTitle}>{key}:</Text>
								<Text style={styles.dataText}>{value.toFixed(2)}%</Text>
							</View>
						))}
					</View>
				) : (
					<Text>No performance data available</Text>
				)}
			</View>

			{isCurrency ? (
				<View style={styles.dataSection}>
					<Text style={styles.sectionTitle}>Events</Text>
					{data && data[1]?.data ? (
						<View style={styles.dataItem}>
							{data[1].data.slice(0, visibleItemsCount).map((event, index) => (
								<View key={index}>
									<Text style={styles.dataTitle}>{event.title}</Text>
									{event.urgency && (
										<Text style={styles.dataText}>
											Urgency: {event.urgency}
										</Text>
									)}
									{event.published && (
										<Text style={styles.dataText}>
											Date:{' '}
											{new Date(event.published * 1000).toLocaleDateString()}
										</Text>
									)}
								</View>
							))}
							{data[1].data.length > visibleItemsCount && (
								<View style={styles.loadMoreButtonContainer}>
									<Button title="Load More" onPress={loadMore} color="black" />
								</View>
							)}
						</View>
					) : (
						<Text>No events available</Text>
					)}
				</View>
			) : (
				<View style={[styles.dataSection, { paddingBottom: 75 }]}>
					<Text style={styles.sectionTitle}>News</Text>
					{data && data[1]?.data ? (
						<View style={styles.dataItem}>
							{data[1]?.data.slice(0, visibleItemsCount).map((news, index) => (
								<View key={index}>
									<Link href={`https://tradingview.com${news.storyPath}`}>
										<Text style={styles.dataTitle}>{news.title}</Text>
									</Link>
									<Text style={styles.dataText}>
										Published:{' '}
										{new Date(news.published * 1000).toLocaleDateString()}
									</Text>
								</View>
							))}
							{data[1].data.length > visibleItemsCount && (
								<View style={styles.loadMoreButtonContainer}>
									<Button title="Load More" onPress={loadMore} color="black" />
								</View>
							)}
						</View>
					) : (
						<Text>No news available</Text>
					)}
				</View>
			)}

			{isCurrency && (
				<View style={[styles.dataSection, { paddingBottom: 75 }]}>
					<Text style={styles.sectionTitle}>News</Text>
					{data && data[3]?.data ? (
						<View style={styles.dataItem}>
							{data[3].data.slice(0, visibleItemsCount).map((news, index) => (
								<View key={index}>
									<Link href={`https://tradingview.com${news.storyPath}`}>
										<Text style={styles.dataTitle}>{news.title}</Text>
									</Link>
									<Text style={styles.dataText}>
										Published:{' '}
										{new Date(news.published * 1000).toLocaleDateString()}
									</Text>
								</View>
							))}
							{data[3].data.length > visibleItemsCount && (
								<View style={styles.loadMoreButtonContainer}>
									<Button title="Load More" onPress={loadMore} color="black" />
								</View>
							)}
						</View>
					) : (
						<Text>No news available</Text>
					)}
				</View>
			)}
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f4f4f9',
		paddingVertical: 75,
		paddingHorizontal: 15,
	},
	loadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#f4f4f9',
	},
	sectionTitle: {
		fontSize: 24,
		fontWeight: '600',
		color: '#333',
		marginBottom: 15,
	},
	dataItem: {
		backgroundColor: '#fff',
		padding: 18,
		borderRadius: 12,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 8,
		marginBottom: 20,
		gap: 20,
	},
	dataTitle: {
		fontSize: 20,
		fontWeight: 'bold',
		color: '#19589b',
		marginBottom: 8,
	},
	dataText: {
		fontSize: 16,
		color: '#666',
		marginBottom: 6,
	},
	loadMoreButtonContainer: {
		marginTop: 15,
		borderColor: 'black',
		borderWidth: 2,
		borderRadius: 8,
		paddingVertical: 12,
		paddingHorizontal: 20,
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 30,
	},
});
