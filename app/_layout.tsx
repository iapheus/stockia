import { Tabs, useRouter } from 'expo-router';
import AntDesign from '@expo/vector-icons/AntDesign';
import { colors } from '../constants/colors';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Pressable, Text, TouchableOpacity } from 'react-native';
import Feather from '@expo/vector-icons/Feather';

export default function Layout() {
  const router = useRouter();

  return (
    <Tabs
      sceneContainerStyle={{
        backgroundColor: colors.darkBG,
      }}
      screenOptions={{
        tabBarStyle: {
          minHeight: 75,
          backgroundColor: colors.darkBG,
          borderTopColor: 'transparent',
        },
        headerTransparent: true,
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          headerTitle: '',
          headerRight: () => {
            return (
              <Pressable
                style={{
                  marginRight: 12,
                  flexDirection: 'row',
                  gap: 4,
                }}
              >
                <Feather
                  suppressHighlighting={true}
                  onPress={() => router.navigate('search')}
                  name='search'
                  size={26}
                  style={{ padding: 12 }}
                  color='#8E8E8F'
                />
                <Feather
                  onPress={() => router.navigate('settings')}
                  name='settings'
                  size={26}
                  style={{ padding: 12 }}
                  suppressHighlighting={true}
                  color='#8E8E8F'
                />
              </Pressable>
            );
          },
          title: 'Home',
          tabBarIcon: ({ color }) => {
            return <AntDesign name='home' size={28} color={color} />;
          },
          headerStyle: {
            backgroundColor: colors.secondaryDarkBG,
          },
          tabBarLabelStyle: { fontSize: 18 },
          tabBarActiveTintColor: 'white',
          tabBarShowLabel: false,
        }}
      />
      <Tabs.Screen
        name='news/index'
        options={{
          headerShown: false,
          title: 'News',
          tabBarIcon: ({ color }) => {
            return <FontAwesome name='newspaper-o' size={24} color={color} />;
          },
          tabBarLabelStyle: { fontSize: 18 },
          tabBarShowLabel: false,
          tabBarActiveTintColor: 'white',
        }}
      />
      <Tabs.Screen
        name='settings'
        options={{
          title: '',
          tabBarButton: (props) => null,
          tabBarStyle: { display: 'none' },
          headerTintColor: 'white',
          headerRight: () => (
            <Text style={{ marginRight: 12, fontSize: 24 }}>Settings</Text>
          ),
          headerLeft: () => {
            return (
              <Pressable
                style={{ marginLeft: 12 }}
                hitSlop={25}
                onPress={router.back}
              >
                <AntDesign name='back' size={28} color='black' />
              </Pressable>
            );
          },
        }}
      />
      <Tabs.Screen
        name='search'
        options={{
          title: '',
          tabBarButton: (props) => null,
          tabBarStyle: { display: 'none' },
          headerTintColor: 'white',
          headerRight: () => (
            <Text style={{ marginRight: 12, fontSize: 24 }}>Search</Text>
          ),
          headerLeft: () => {
            return (
              <Pressable
                style={{ marginLeft: 12 }}
                hitSlop={25}
                onPress={router.back}
              >
                <AntDesign name='back' size={28} color='black' />
              </Pressable>
            );
          },
        }}
      />
    </Tabs>
  );
}

// const styles = {
//   indexScreen: StyleSheet.create({
//     pressable: {
//       flex: 1,
//     },
//     svg: {
//       width: 100,
//       height: 100,
//     },
//   }),
// };
