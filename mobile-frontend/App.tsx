import "react-native-gesture-handler";
import {
  Roboto_400Regular,
  Roboto_700Bold,
  useFonts,
} from "@expo-google-fonts/roboto";
import { NavigationContainer } from "@react-navigation/native";
import { AppRoutes } from "@routes/app.routes";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect, useState } from "react";
import { StatusBar, View } from "react-native";
import { MD3LightTheme as DefaultTheme } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "src/context/AuthContext";

SplashScreen.preventAutoHideAsync();

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
  const [fontsLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold });
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await getFonts();
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady && fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady, fontsLoaded]);

  if (!appIsReady || !fontsLoaded) {
    return null;
  }

  const theme_: Theme_ = {
    ...DefaultTheme,
    dark: false,
    colors: {
      ...DefaultTheme.colors,
      primary: "#2196F3",
      background: "transparent",
      card: "#ffffff",
      text: "#333333",
      border: "#dddddd",
      notification: "#f50057",
      secondaryContainer: "rgba(33, 150, 243, 0.12)",
    },
  };

  return (
    <AuthProvider>
      <NavigationContainer theme={theme_}>
        <SafeAreaProvider>
          <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
            <StatusBar
              barStyle="dark-content"
              backgroundColor="transparent"
              translucent
            />
            <AppRoutes />
          </View>
        </SafeAreaProvider>
      </NavigationContainer>
    </AuthProvider>
  );
}
