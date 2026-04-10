import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { TextInput } from "react-native-paper";

interface ErrorHash {
  secret?: string;
  committeePublicKey?: string;
}

export function GenerateSaveAndLoad({ secret, setSecret, eyeOn }: any) {
  const [committeePublicKey, setCommitteePublicKey] =
    useState<string>("pfjufh34o43nfkktj");
  const [directorySave, setDirectorySave] =
    useState<string>("certificate.cert");
  const [errors, setErrors] = useState<ErrorHash>({});

  const readFile = async (uri: string) => {
    try {
      const content = await FileSystem.readAsStringAsync(uri);
      setSecret(content.trim());
      setDirectorySave(uri);
      if (__DEV__) {
        console.log("Certificate loaded from:", uri);
      }
    } catch (error) {
      console.error("Error reading file:", error);
      setErrors({ secret: "Failed to read certificate file." });
    }
  };

  const onPressFindAndLoadCertificate = async () => {
    try {
      const document: any = await DocumentPicker.getDocumentAsync({
        copyToCacheDirectory: true,
      });

      if (document && document.assets && document.assets.length > 0) {
        const uri = document.assets[0].uri;
        readFile(uri);
      }
    } catch (error) {
      console.error("Error picking document:", error);
    }
  };

  const onPressLoadCertificate = async () => {
    try {
      const fileUri = `${FileSystem.documentDirectory}certificate.cert`;
      const info = await FileSystem.getInfoAsync(fileUri);
      if (info.exists) {
        readFile(fileUri);
      } else {
        setErrors({
          secret: "No saved certificate found. Please find and load one.",
        });
      }
    } catch (error) {
      console.error("Error loading certificate:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.containerLevel}>
        <TouchableOpacity
          style={styles.buttonTyle}
          onPress={onPressLoadCertificate}
        >
          <Text style={styles.textButton}>Load Saved</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonTyle}
          onPress={onPressFindAndLoadCertificate}
        >
          <Text style={styles.textButton}>Browse Files</Text>
        </TouchableOpacity>
      </View>

      <View style={{ gap: 5, paddingTop: 10 }}>
        <Text style={styles.textTitleInput}>Secret Key</Text>
        <TextInput
          mode="outlined"
          style={styles.textInput}
          placeholder="Ex.: 12345AVSDSDSER"
          onChangeText={(text) => {
            setSecret(text.trim());
            setErrors({});
          }}
          value={secret}
          secureTextEntry={!eyeOn}
          dense
        />
        {errors.secret ? (
          <Text style={styles.errorText}>{errors.secret}</Text>
        ) : null}

        <Text style={styles.textTitleInput}>Certificate Path</Text>
        <Text style={styles.textCertificate}>
          {eyeOn
            ? directorySave
            : "•".repeat(Math.min(directorySave.length, 20))}
        </Text>
      </View>

      <View style={{ gap: 5, paddingTop: 20 }}>
        <Text style={styles.textTitleInput}>Transaction Hash</Text>
        <TextInput
          mode="outlined"
          style={styles.textInput}
          placeholder="Enter transaction hash to verify"
          onChangeText={(text) => {
            setCommitteePublicKey(text.trim());
          }}
          value={committeePublicKey}
          secureTextEntry={!eyeOn}
          dense
        />
        {errors.committeePublicKey ? (
          <Text style={styles.errorText}>{errors.committeePublicKey}</Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    width: "100%",
    flexDirection: "column",
  },
  containerLevel: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: "transparent",
    gap: 8,
  },
  buttonTyle: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#1a1a2e",
    padding: 10,
    borderRadius: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  textButton: {
    color: "#ffffff",
    fontSize: 13,
    textAlign: "center",
    fontWeight: "700",
  },
  textTitleInput: {
    color: "#6b7280",
    fontWeight: "600",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  textInput: {
    backgroundColor: "#fff",
    fontSize: 14,
  },
  errorText: {
    color: "#dc2626",
    marginBottom: 8,
    fontSize: 12,
  },
  textCertificate: {
    color: "#4b5563",
    fontSize: 13,
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
});
