import { GenerateSaveAndLoad } from "@components/GenerateSaveAndLoad";
import { useCameraPermissions } from "expo-camera";
import { Eye, EyeClosed } from "phosphor-react-native";
import { useState } from "react";
import {
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import theme from "src/theme";

export function Credentials({ navigation }: any) {
  const [, requestPermission] = useCameraPermissions();
  const [secret, setSecret] = useState<string>("");
  const [eyeOn, setEyesOn] = useState<boolean>(false);

  const onPressEyes = () => {
    setEyesOn((prev) => !prev);
  };

  const onPressVerify = async () => {
    const permission = await requestPermission();
    if (permission.granted) {
      navigation.navigate("CameraQR", { secret });
    } else {
      // Permission denied — navigate anyway so user sees the camera screen with its own message
      navigation.navigate("CameraQR", { secret });
    }
  };

  const eyeSize = 40;

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <View style={styles.topBarRight}>
          <TouchableOpacity onPress={onPressEyes} style={styles.eyeButton}>
            {eyeOn ? (
              <Eye size={eyeSize} color="#333" />
            ) : (
              <EyeClosed size={eyeSize} color="#333" />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        <View>
          <Text style={styles.pageTitle}>Credentials</Text>
          <Text style={styles.pageSubtitle}>
            Load your certificate to verify your vote on the blockchain.
          </Text>

          <View style={styles.credentialsSection}>
            <GenerateSaveAndLoad
              secret={secret}
              setSecret={setSecret}
              eyeOn={eyeOn}
            />
          </View>
        </View>

        <View style={styles.verifyContainer}>
          <TouchableOpacity
            style={[styles.buttonStyleVerify, !secret && styles.buttonDisabled]}
            onPress={onPressVerify}
            disabled={!secret}
          >
            <Text style={styles.textButtonVerify}>📷 Scan QR & Verify</Text>
          </TouchableOpacity>
          {!secret && (
            <Text style={styles.hintText}>
              Load a certificate to enable verification
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f8fafc",
    flex: 1,
    flexDirection: "column",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "flex-end",
    backgroundColor: "transparent",
    paddingRight: 16,
    marginTop: Platform.OS === "android" ? (StatusBar.currentHeight ?? 0) : 40,
  },
  topBarRight: {
    alignItems: "flex-end",
    justifyContent: "center",
  },
  eyeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  content: {
    flex: 1,
    marginHorizontal: 16,
    marginTop: 8,
    justifyContent: "space-between",
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1a1a2e",
    marginBottom: 6,
  },
  pageSubtitle: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 20,
    marginBottom: 16,
  },
  credentialsSection: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  verifyContainer: {
    marginBottom: 24,
    alignItems: "center",
  },
  buttonStyleVerify: {
    width: "70%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1a1a2e",
    padding: 14,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonDisabled: {
    backgroundColor: "#9ca3af",
    shadowOpacity: 0,
    elevation: 0,
  },
  textButtonVerify: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
  },
  hintText: {
    marginTop: 8,
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
});
