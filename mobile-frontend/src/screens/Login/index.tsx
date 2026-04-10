import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { TextInput } from "react-native-paper";
import { useAuth } from "../../context/AuthContext";

export function Login() {
  const navigation = useNavigation<any>();
  const { onLogin } = useAuth();

  const [electoralId, setElectoralId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async () => {
    setErrorMsg("");
    if (!electoralId.trim() || !password) {
      setErrorMsg("Electoral ID and password are required");
      return;
    }

    setLoading(true);
    try {
      const result = await onLogin?.(electoralId.trim(), password);

      if (result?.success) {
        navigation.navigate("Menu");
      } else {
        setErrorMsg(
          result?.message || "Invalid credentials. Please try again.",
        );
      }
    } catch (error: any) {
      setErrorMsg(
        error.message || "An unexpected error occurred. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const navigateToRegistration = () => {
    navigation.navigate("Registration");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.headerContainer}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>QB</Text>
          </View>
          <Text style={styles.title}>QuantumBallot</Text>
          <Text style={styles.subtitle}>Secure Blockchain Voting</Text>
        </View>

        <View style={styles.formContainer}>
          {errorMsg ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{errorMsg}</Text>
            </View>
          ) : null}

          <TextInput
            label="Electoral ID"
            value={electoralId}
            onChangeText={(t) => {
              setElectoralId(t);
              setErrorMsg("");
            }}
            mode="outlined"
            style={styles.input}
            autoCapitalize="none"
            autoCorrect={false}
            disabled={loading}
            left={<TextInput.Icon icon="card-account-details-outline" />}
          />

          <TextInput
            label="Password"
            value={password}
            onChangeText={(t) => {
              setPassword(t);
              setErrorMsg("");
            }}
            mode="outlined"
            style={styles.input}
            secureTextEntry={secureTextEntry}
            left={<TextInput.Icon icon="lock-outline" />}
            right={
              <TextInput.Icon
                icon={secureTextEntry ? "eye-off" : "eye"}
                onPress={() => setSecureTextEntry(!secureTextEntry)}
              />
            }
            disabled={loading}
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </TouchableOpacity>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Don't have an account? </Text>
            <TouchableOpacity
              onPress={navigateToRegistration}
              disabled={loading}
            >
              <Text style={styles.registerLink}>Register here</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.footer}>
          Your vote is secure, private, and verifiable on the blockchain
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4f8",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 36,
  },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#2196F3",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
    shadowColor: "#2196F3",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  logoText: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#1a1a2e",
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 15,
    color: "#6b7280",
  },
  formContainer: {
    width: "100%",
    maxWidth: 420,
    alignSelf: "center",
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },
  errorContainer: {
    backgroundColor: "#fef2f2",
    borderWidth: 1,
    borderColor: "#fca5a5",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: "#dc2626",
    fontSize: 13,
    textAlign: "center",
  },
  input: {
    marginBottom: 14,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#2196F3",
    height: 52,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    shadowColor: "#2196F3",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonDisabled: {
    backgroundColor: "#93c5fd",
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
    alignItems: "center",
  },
  registerText: {
    color: "#6b7280",
    fontSize: 14,
  },
  registerLink: {
    color: "#2196F3",
    fontSize: 14,
    fontWeight: "bold",
  },
  footer: {
    textAlign: "center",
    color: "#9ca3af",
    fontSize: 12,
    marginTop: 28,
    paddingHorizontal: 20,
    lineHeight: 18,
  },
});
