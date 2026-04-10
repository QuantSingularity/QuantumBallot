import * as Clipboard from "expo-clipboard";
import { useEffect, useState } from "react";
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import theme from "src/theme";

const AUTO_NAV_DELAY = 10000;

export default function ThankVote() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const [copied, setCopied] = useState(false);
  const [progress] = useState(new Animated.Value(0));

  const transactionId =
    route.params?.data || route.params?.transactionHash || "tx_unavailable";

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: AUTO_NAV_DELAY,
      useNativeDriver: false,
    }).start();

    const timer = setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: "Menu" }],
      });
    }, AUTO_NAV_DELAY);

    return () => clearTimeout(timer);
  }, [navigation, progress]);

  const copyToClipboard = async () => {
    if (transactionId !== "tx_unavailable") {
      await Clipboard.setStringAsync(transactionId);
      setCopied(true);
    }
  };

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => {
        setCopied(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const handleReturnHome = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "Menu" }],
    });
  };

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={styles.container} testID="thank-vote-screen">
      <StatusBar barStyle="dark-content" />

      <View style={styles.successIconContainer} testID="confetti-animation">
        <Text style={styles.successIcon}>✓</Text>
      </View>

      <Text style={styles.title}>Thank You for Voting!</Text>
      <Text style={styles.subtitle}>Your vote has been securely recorded.</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Transaction Details</Text>
        <Text style={styles.label}>Transaction ID:</Text>
        <View style={styles.transactionContainer}>
          <Text
            style={styles.transactionId}
            numberOfLines={1}
            ellipsizeMode="middle"
          >
            {transactionId}
          </Text>
          <TouchableOpacity
            onPress={copyToClipboard}
            style={styles.copyButton}
            disabled={transactionId === "tx_unavailable"}
          >
            <Text style={styles.copyButtonText}>
              {copied ? "Copied!" : "Copy"}
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.info}>
          Your vote has been securely recorded on the blockchain. You can use
          this transaction ID to verify your vote at any time.
        </Text>
      </View>

      <View style={styles.autoNavContainer}>
        <Text style={styles.autoNavText}>Returning to home automatically…</Text>
        <View style={styles.progressBarBg}>
          <Animated.View
            style={[styles.progressBarFill, { width: progressWidth }]}
          />
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleReturnHome}>
        <Text style={styles.buttonText}>Return to Home</Text>
      </TouchableOpacity>
    </View>
  );
}

export { ThankVote };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: "center",
    padding: 20,
    justifyContent: "center",
  },
  successIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.success,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  successIcon: {
    fontSize: 40,
    color: "#fff",
    fontWeight: "bold",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: theme.colors.success,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginBottom: 30,
    textAlign: "center",
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginBottom: 6,
    fontWeight: "600",
  },
  transactionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  transactionId: {
    fontSize: 13,
    color: theme.colors.text,
    flex: 1,
    fontFamily: "monospace",
  },
  copyButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginLeft: 8,
  },
  copyButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  info: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  autoNavContainer: {
    width: "100%",
    marginBottom: 16,
  },
  autoNavText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginBottom: 6,
  },
  progressBarBg: {
    width: "100%",
    height: 4,
    backgroundColor: "#e0e0e0",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: theme.colors.primary,
    borderRadius: 2,
  },
  button: {
    backgroundColor: theme.colors.primary,
    width: "100%",
    height: 52,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
