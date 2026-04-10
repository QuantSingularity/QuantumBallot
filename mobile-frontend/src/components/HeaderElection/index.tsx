import { StyleSheet, Text, View } from "react-native";

export function HeaderElection() {
  return (
    <View style={styles.container}>
      <View style={styles.flagContainer}>
        <View style={styles.flagStripe1} />
        <View style={styles.flagStripe2} />
        <View style={styles.flagStripe3} />
      </View>
      <Text style={styles.title}>QuantumBallot</Text>
      <Text style={styles.subtitle}>Blockchain-based Voting System</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingVertical: 14,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    flexDirection: "column",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  flagContainer: {
    width: 48,
    height: 32,
    marginBottom: 8,
    flexDirection: "row",
    overflow: "hidden",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  flagStripe1: {
    flex: 1,
    backgroundColor: "#0057B7",
  },
  flagStripe2: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  flagStripe3: {
    flex: 1,
    backgroundColor: "#D62612",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1a1a2e",
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 2,
  },
});
