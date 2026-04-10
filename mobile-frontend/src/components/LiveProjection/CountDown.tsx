import {
  SpaceMono_400Regular,
  SpaceMono_700Bold,
} from "@expo-google-fonts/space-mono";
import { useFonts } from "expo-font";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

type CountDownProps = {
  remainingTime: number;
};

const Countdown = ({ remainingTime }: CountDownProps) => {
  const [sec, setSec] = useState<number>(remainingTime);
  const [fontsLoaded] = useFonts({
    SpaceMono_400Regular,
    SpaceMono_700Bold,
  });

  useEffect(() => {
    setSec(remainingTime);
  }, [remainingTime]);

  useEffect(() => {
    if (sec <= 0) return;

    const timer = setInterval(() => {
      setSec((prevSec) => {
        if (prevSec <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prevSec - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const days: number = Math.floor(sec / (3600 * 24));
  const hours: number = Math.floor((sec % (3600 * 24)) / 3600);
  const minutes: number = Math.floor((sec % 3600) / 60);
  const seconds: number = Math.floor(sec % 60);

  const dec = (x: number) => (x < 10 ? `0${x}` : String(x));

  const fontSize = 28;

  return (
    <View>
      <Text
        style={{
          flex: 1,
          fontSize,
          fontFamily: fontsLoaded ? "SpaceMono_400Regular" : undefined,
          fontWeight: "600",
          textAlign: "center",
        }}
      >
        {dec(days)}:{dec(hours)}:{dec(minutes)}:{dec(seconds)}
      </Text>
    </View>
  );
};

export default Countdown;
