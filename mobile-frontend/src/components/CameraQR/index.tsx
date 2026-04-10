import { Camera, CameraView, useCameraPermissions } from "expo-camera";
import { CaretLeft } from "phosphor-react-native";
import { useState } from "react";
import {
  Alert,
  Button,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function CameraQR({ navigation, route }: any) {
  const { secret } = route.params ?? {};
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  const handleBarCodeScanned = ({ type, data }: any) => {
    setScanned(true);

    if (data === secret) {
      Alert.alert("Verified ✓", "Your vote certificate is valid.", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } else {
      Alert.alert(
        "Verification Failed",
        "The QR code does not match your certificate. Please try again.",
        [
          { text: "Try Again", onPress: () => setScanned(false) },
          {
            text: "Cancel",
            onPress: () => navigation.goBack(),
            style: "cancel",
          },
        ],
      );
    }
  };

  const onPressBack = () => {
    navigation.goBack();
  };

  if (permission === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.messageText}>Requesting for camera permission</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.messageText}>No access to camera</Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={requestPermission}
        >
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.backLink} onPress={onPressBack}>
          <Text style={styles.backLinkText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr", "pdf417"],
        }}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={styles.overlay}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={onPressBack} style={styles.backButton}>
            <CaretLeft size={36} color="white" />
          </TouchableOpacity>
          <Text style={styles.titleText}>Scan QR Code</Text>
        </View>

        <View style={styles.scanArea}>
          <View style={styles.scanFrame}>
            <View style={[styles.corner, styles.cornerTL]} />
            <View style={[styles.corner, styles.cornerTR]} />
            <View style={[styles.corner, styles.cornerBL]} />
            <View style={[styles.corner, styles.cornerBR]} />
          </View>
          <Text style={styles.scanHint}>
            Align the QR code within the frame
          </Text>
        </View>

        {scanned && (
          <View style={styles.rescanContainer}>
            <Button
              title="Tap to Scan Again"
              onPress={() => setScanned(false)}
            />
          </View>
        )}
      </View>
    </View>
  );
}

const CORNER_SIZE = 24;
const CORNER_WIDTH = 3;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f4f8",
    padding: 24,
  },
  messageText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: "#2196F3",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  permissionButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
  backLink: {
    padding: 12,
  },
  backLinkText: {
    color: "#2196F3",
    fontSize: 14,
  },
  overlay: {
    flex: 1,
    backgroundColor: "transparent",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop:
      Platform.OS === "android" ? (StatusBar.currentHeight ?? 20) : 50,
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  backButton: {
    padding: 4,
  },
  titleText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 12,
  },
  scanArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scanFrame: {
    width: 240,
    height: 240,
    position: "relative",
  },
  corner: {
    position: "absolute",
    width: CORNER_SIZE,
    height: CORNER_SIZE,
    borderColor: "#fff",
  },
  cornerTL: {
    top: 0,
    left: 0,
    borderTopWidth: CORNER_WIDTH,
    borderLeftWidth: CORNER_WIDTH,
    borderTopLeftRadius: 4,
  },
  cornerTR: {
    top: 0,
    right: 0,
    borderTopWidth: CORNER_WIDTH,
    borderRightWidth: CORNER_WIDTH,
    borderTopRightRadius: 4,
  },
  cornerBL: {
    bottom: 0,
    left: 0,
    borderBottomWidth: CORNER_WIDTH,
    borderLeftWidth: CORNER_WIDTH,
    borderBottomLeftRadius: 4,
  },
  cornerBR: {
    bottom: 0,
    right: 0,
    borderBottomWidth: CORNER_WIDTH,
    borderRightWidth: CORNER_WIDTH,
    borderBottomRightRadius: 4,
  },
  scanHint: {
    color: "#fff",
    marginTop: 20,
    fontSize: 14,
    opacity: 0.8,
  },
  rescanContainer: {
    padding: 20,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
});
