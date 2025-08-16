import { StyleSheet, Text, View } from 'react-native';
import { useCustomFonts } from '../../hooks/useFonts';

export default function Profile() {
  const fontsLoaded = useCustomFonts();

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Fredoka-SemiBold',
    fontSize: 24,
  },
});