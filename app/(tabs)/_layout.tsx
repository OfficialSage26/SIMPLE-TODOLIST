import { Tabs } from 'expo-router';
import { SvgUri } from 'react-native-svg';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: '#08d0d1',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontFamily: 'Fredoka-Regular',
        },
        tabBarActiveTintColor: '#08d0d1',
        tabBarInactiveTintColor: '#666',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#eee',
        },
      }}>

      <Tabs.Screen 
        name="index" 
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <SvgUri 
              uri={require('../../assets/icons/home.svg')} 
              width={size} 
              height={size} 
              fill={color}
            />
          ),
        }}
      />
      
      <Tabs.Screen 
        name="profile" 
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <SvgUri 
              uri={require('../../assets/icons/profile.svg')} 
              width={size} 
              height={size} 
              fill={color}
            />
          ),
        }}
      />
      
      <Tabs.Screen 
        name="settings" 
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <SvgUri 
              uri={require('../../assets/icons/setting-4.svg')} 
              width={size} 
              height={size} 
              fill={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}