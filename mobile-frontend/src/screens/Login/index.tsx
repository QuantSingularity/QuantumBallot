import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
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
  const navigation = useNavigation();
  const { onLogin } = useAuth();

  const [electoralId, setElectoralId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const handleLogin = async () => {
    if (!electoralId || !password) {
      Alert.alert("Error", "Please enter both Electoral ID and password");
      return;
    }

    setLoading(true);
    try {
      const result = await onLogin?.(electoralId.trim(), password);

      if (result.success) {
        // Navigation will be handled by the auth state change
        (navigation as any).navigate("Menu");
      } else {
        Alert.alert(
          "Login Failed",
          result.message || "Invalid credentials. Please try again.",
        );
      }
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.message || "An unexpected error occurred. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const navigateToRegistration = () => {
    (navigation as any).navigate("Registration");
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
          <Text style={styles.title}>QuantumBallot</Text>
          <Text style={styles.subtitle}>Secure Blockchain Voting</Text>
        </View>

        <View style={styles.formContainer}>
          <TextInput
            label="Electoral ID"
            value={electoralId}
            onChangeText={setElectoralId}
            mode="outlined"
            style={styles.input}
            autoCapitalize="none"
            autoCorrect={false}
            disabled={loading}
          />

          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            style={styles.input}
            secureTextEntry={secureTextEntry}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#2196F3",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "#666",
  },
  formContainer: {
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#2196F3",
    height: 50,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: "#B0BEC5",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
    alignItems: "center",
  },
  registerText: {
    color: "#666",
    fontSize: 14,
  },
  registerLink: {
    color: "#2196F3",
    fontSize: 14,
    fontWeight: "bold",
  },
  footer: {
    textAlign: "center",
    color: "#999",
    fontSize: 12,
    marginTop: 30,
    paddingHorizontal: 20,
  },
});
