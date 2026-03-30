import "react-native-gesture-handler";
import {
  Roboto_400Regular,
  Roboto_700Bold,
  useFonts,
} from "@expo-google-fonts/roboto";
import { NavigationContainer } from "@react-navigation/native";
import { AppRoutes } from "@routes/app.routes";
import * as Font from "expo-font";
import { useEffect, useState } from "react";
import { StatusBar } from "react-native";
import { MD3LightTheme as DefaultTheme } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "src/context/AuthContext";

const getFonts = () =>
  Font.loadAsync({
    "rubickglitch-regular": require("src/assets/fonts/RubikGlitch-Regular.ttf"),
    monospace: require("src/assets/fonts/digital_7_mono.ttf"),
  });

export declare type Theme_ = {
  dark: boolean;
  colors: {
    primary: string;
    background: string;
    card: string;
    text: string;
    border: string;
    notification: string;
    secondaryContainer: string;
  };
};

export default function App() {
  const [_fontLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold });
  const [_fontsLoaded, _setFontLoaded] = useState(false);

  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        await getFonts();
        // Artificially delay for two seconds to simulate a slow loading
        // experience. Please remove this if you copy and paste the code!
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  if (!appIsReady) {
    return null;
  }

  const theme_: Theme_ = {
    ...DefaultTheme,
    dark: false,
    colors: {
      ...DefaultTheme.colors,
      primary: "red",
      background: "transparent",
      card: "",
      text: "",
      border: "",
      notification: "",
      secondaryContainer: "rgba(40, 40, 40, 0.4)",
    },
  };

  return (
    <AuthProvider>
      <NavigationContainer theme={theme_}>
        <SafeAreaProvider>
          <StatusBar
            barStyle="dark-content"
            backgroundColor="transparent"
            translucent
          />

          <AppRoutes />
        </SafeAreaProvider>
      </NavigationContainer>
    </AuthProvider>
  );
}
