import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#08d0d1',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
        fontFamily: 'Fredoka-Regular',
        },
      }}>

      <Stack.Screen name="Home" options={{}}/>
    </Stack>
  );
}