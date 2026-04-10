import { BottomNavigation } from "@components/BottomNavigation";
import CameraQR from "@components/CameraQR";
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";
import { CandidateDetails } from "@screens/CandidateDetails";
import { Login } from "@screens/Login";
import { Registration } from "@screens/Registration";
import ThankVote from "@screens/ThankVote";
import { TwoFactor } from "@screens/TwoFactor";
import { useEffect, useRef } from "react";
import { useAuth } from "src/context/AuthContext";

const { Navigator, Screen } = createStackNavigator();

export function AppRoutes() {
  const { authState, isLoggedIn } = useAuth();
  const hasCheckedAuth = useRef(false);

  useEffect(() => {
    if (!hasCheckedAuth.current) {
      hasCheckedAuth.current = true;
      isLoggedIn?.();
    }
  }, [isLoggedIn]);

  const initialRoute = authState?.authenticated ? "Menu" : "Login";

  return (
    <Navigator
      initialRouteName={initialRoute}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Screen name="Login" component={Login} />

      <Screen name="Menu" component={BottomNavigation} />

      <Screen name="Registration" component={Registration} />

      <Screen
        name="Thank Vote"
        component={ThankVote}
        options={{
          title: "Thank Vote",
          ...TransitionPresets.ScaleFromCenterAndroid,
        }}
      />

      <Screen name="TwoFactor" component={TwoFactor} />

      <Screen name="Candidate Details" component={CandidateDetails} />

      <Screen name="CameraQR" component={CameraQR} />
    </Navigator>
  );
}
