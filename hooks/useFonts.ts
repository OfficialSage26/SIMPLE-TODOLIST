import { useFonts } from "expo-font";

export function useCustomFonts(){
    const [fontsLoaded] = useFonts ({
        'Fredoka-Regular': require('../assets/fonts/Fredoka-Regular.ttf'),
        'Fredoka-Bold': require('../assets/fonts/Fredoka-Bold.ttf'),
        'Fredoka-SemiBold': require('../assets/fonts/Fredoka-SemiBold.ttf'),
    });

    return fontsLoaded;
}
