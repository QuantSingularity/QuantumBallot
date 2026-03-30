import { Picker } from "@react-native-picker/picker";
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

// US States for American elections
const US_STATES = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
];

export function Registration() {
  const navigation = useNavigation();
  const { onRegister } = useAuth();

  const [electoralId, setElectoralId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [address, setAddress] = useState("");
  const [province, setProvince] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = () => {
    if (
      !electoralId ||
      !name ||
      !email ||
      !password ||
      !confirmPassword ||
      !address ||
      !province
    ) {
      Alert.alert("Error", "Please fill in all fields");
      return false;
    }

    // Validate electoral ID format (basic validation)
    if (electoralId.length < 5) {
      Alert.alert("Error", "Electoral ID must be at least 5 characters");
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return false;
    }

    // Password validation
    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return false;
    }

    return true;
  };

  const handleRegistration = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const result = await onRegister?.({
        electoralId: electoralId.trim(),
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: password,
        address: address.trim(),
        province: province,
      });

      if (result.success) {
        Alert.alert(
          "Success",
          result.message ||
            "Registration successful! Please check your email for further instructions.",
          [
            {
              text: "OK",
              onPress: () => (navigation as any).navigate("Login"),
            },
          ],
        );
      } else {
        Alert.alert(
          "Error",
          result.message || "Registration failed. Please try again.",
        );
      }
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.message || "An unexpected error occurred. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join QuantumBallot Voting System</Text>

        <View style={styles.formContainer}>
          <TextInput
            label="Electoral ID"
            value={electoralId}
            onChangeText={setElectoralId}
            mode="outlined"
            style={styles.input}
            autoCapitalize="none"
            autoCorrect={false}
            disabled={isLoading}
          />

          <TextInput
            label="Full Name"
            value={name}
            onChangeText={setName}
            mode="outlined"
            style={styles.input}
            autoCapitalize="words"
            disabled={isLoading}
          />

          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            disabled={isLoading}
          />

          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            style={styles.input}
            secureTextEntry={!showPassword}
            right={
              <TextInput.Icon
                icon={showPassword ? "eye-off" : "eye"}
                onPress={() => setShowPassword(!showPassword)}
              />
            }
            disabled={isLoading}
          />

          <TextInput
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            mode="outlined"
            style={styles.input}
            secureTextEntry={!showConfirmPassword}
            right={
              <TextInput.Icon
                icon={showConfirmPassword ? "eye-off" : "eye"}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            }
            disabled={isLoading}
          />

          <TextInput
            label="Address"
            value={address}
            onChangeText={setAddress}
            mode="outlined"
            style={styles.input}
            multiline
            numberOfLines={2}
            disabled={isLoading}
          />

          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>State</Text>
            <Picker
              selectedValue={province}
              onValueChange={(itemValue) => setProvince(itemValue)}
              style={styles.picker}
              enabled={!isLoading}
            >
              <Picker.Item label="Select your state" value="" />
              {US_STATES.map((state) => (
                <Picker.Item key={state} label={state} value={state} />
              ))}
            </Picker>
          </View>

          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleRegistration}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Register</Text>
            )}
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity
              onPress={() => (navigation as any).navigate("Login")}
              disabled={isLoading}
            >
              <Text style={styles.loginLink}>Login here</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.footer}>
          By registering, you agree to participate in secure blockchain-based
          elections
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
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2196F3",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
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
  pickerContainer: {
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  pickerLabel: {
    fontSize: 12,
    color: "#666",
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  picker: {
    height: 50,
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
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
    alignItems: "center",
  },
  loginText: {
    color: "#666",
    fontSize: 14,
  },
  loginLink: {
    color: "#2196F3",
    fontSize: 14,
    fontWeight: "bold",
  },
  footer: {
    textAlign: "center",
    color: "#999",
    fontSize: 12,
    marginTop: 20,
    paddingHorizontal: 20,
  },
});
