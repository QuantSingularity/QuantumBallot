import { CaretLeft } from "phosphor-react-native";
import {
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export function CandidateDetails({ navigation, route }: any) {
  const { name, party, photo, src, acronym } = route.params ?? {};

  const onPressBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={onPressBack} style={styles.backButton}>
          <CaretLeft size={32} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.photoContainer}>
          {photo ? (
            <Image source={{ uri: photo }} style={styles.imgCandidate} />
          ) : (
            <View style={styles.photoPlaceholder}>
              <Text style={styles.photoPlaceholderText}>
                {name ? name.charAt(0).toUpperCase() : "?"}
              </Text>
            </View>
          )}
          {src ? <Image source={{ uri: src }} style={styles.imgParty} /> : null}
        </View>

        <Text style={styles.textCandidate}>{name ?? "Unknown"}</Text>
        <Text style={styles.textParty}>{party ?? ""}</Text>
        {acronym ? <Text style={styles.textAcronym}>{acronym}</Text> : null}

        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Party</Text>
          <Text style={styles.infoValue}>{party ?? "—"}</Text>
        </View>
        {acronym ? (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Acronym</Text>
            <Text style={styles.infoValue}>{acronym}</Text>
          </View>
        ) : null}

        <View style={styles.containerLevel}>
          <TouchableOpacity style={styles.buttonOK} onPress={onPressBack}>
            <Text style={styles.textOK}>Back</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    marginTop: Platform.OS === "android" ? (StatusBar.currentHeight ?? 0) : 45,
    paddingHorizontal: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 22,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  scrollContent: {
    alignItems: "center",
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 20,
  },
  photoContainer: {
    position: "relative",
    marginBottom: 20,
  },
  imgCandidate: {
    resizeMode: "contain",
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 3,
    borderColor: "#2196F3",
  },
  photoPlaceholder: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "#2196F3",
    justifyContent: "center",
    alignItems: "center",
  },
  photoPlaceholderText: {
    fontSize: 64,
    color: "#fff",
    fontWeight: "bold",
  },
  imgParty: {
    resizeMode: "contain",
    width: 50,
    height: 50,
    borderRadius: 25,
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#fff",
  },
  textCandidate: {
    textAlign: "center",
    fontSize: 28,
    fontWeight: "700",
    color: "#1a1a2e",
    marginBottom: 6,
  },
  textParty: {
    textAlign: "center",
    fontSize: 16,
    color: "#4b5563",
    marginBottom: 4,
  },
  textAcronym: {
    textAlign: "center",
    fontSize: 14,
    color: "#9ca3af",
    marginBottom: 4,
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "#e5e7eb",
    marginVertical: 20,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "600",
  },
  infoValue: {
    fontSize: 14,
    color: "#1a1a2e",
    fontWeight: "500",
    maxWidth: "65%",
    textAlign: "right",
  },
  containerLevel: {
    width: "100%",
    paddingTop: 24,
    alignItems: "center",
  },
  buttonOK: {
    width: "80%",
    alignItems: "center",
    backgroundColor: "#2196F3",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#2196F3",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  textOK: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
