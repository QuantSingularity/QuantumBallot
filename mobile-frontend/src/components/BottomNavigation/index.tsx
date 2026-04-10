import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { Candidates } from "@screens/Candidates";
import { Credentials } from "@screens/Credentials";
import { News } from "@screens/News";
import { useEffect } from "react";
import {
  MD3LightTheme as DefaultTheme,
  Provider as PaperProvider,
} from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useAuth } from "src/context/AuthContext";
import { loadImages } from "src/service/firebase";

const Tab = createMaterialBottomTabNavigator();

const theme_ = {
  ...DefaultTheme,
  dark: false,
  colors: {
    ...DefaultTheme.colors,
    primary: "#2196F3",
    background: "#ffffff",
    secondaryContainer: "rgba(33, 150, 243, 0.12)",
  },
};

export function BottomNavigation() {
  const { authState, isLoggedIn, setImageList } = useAuth();

  useEffect(() => {
    isLoggedIn?.();
    loadImages(setImageList);
  }, []);

  return (
    <PaperProvider theme={theme_}>
      <Tab.Navigator
        initialRouteName="News"
        activeColor="#2196F3"
        inactiveColor="#6b7280"
        barStyle={styles.tabBar}
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color }) => {
            const size = 23;
            const iconMap: Record<string, string> = {
              News: "newspaper-variant-outline",
              Candidates: "account-group",
              Data: "shield-key-outline",
            };
            return (
              <Icon
                name={iconMap[route.name] ?? "circle"}
                size={size}
                color={color}
              />
            );
          },
          headerShown: false,
        })}
      >
        <Tab.Screen name="News" component={News} />
        <Tab.Screen name="Candidates" component={Candidates} />
        <Tab.Screen name="Data" component={Credentials} />
      </Tab.Navigator>
    </PaperProvider>
  );
}

const styles = {
  tabBar: { backgroundColor: "#1a1a2e" },
};
