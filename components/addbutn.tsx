import { useCustomFonts } from "@/hooks/useFonts";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

interface AddButtonProps {
    onPress: () => void;
}

export default function Addbutn({ onPress }: AddButtonProps) {

    const fontsLoaded = useCustomFonts();

    if (!fontsLoaded) {
        return <ActivityIndicator />;
    }

    return(
        <View style={styles.container}>
            <Pressable
                onPress={onPress}
                style={({ pressed }) => [
                    styles.addbtn,
                    pressed && { backgroundColor: '#4FB3B3' },
                ]}
                >
                <Text style={styles.text}>Hop It!</Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {

    },
    text:{
        fontFamily: 'Fredoka-Regular',
        fontSize: 18,
    },
    addbtn: {
        alignItems: 'center',
        backgroundColor: '#5FC8C8',
        padding: 8,
        borderRadius: 20,
        marginHorizontal: 12,
    }
    
})
