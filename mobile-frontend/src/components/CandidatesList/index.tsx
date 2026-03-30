import { CandidateItem } from "@components/CandidateItem";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import axios from "src/api/axios";
import { useAuth } from "src/context/AuthContext";
import { Config } from "../../constants/config";

interface Candidate {
  id: number;
  code: number;
  name: string;
  party: string;
  acronym?: string;
  photo: any;
  src: any;
  status?: string;
}

export function CandidatesList({ navigation }: any) {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [xTexts, setXtexts] = useState<string[]>([]);
  const [selected, setSelected] = useState(-1);

  const { imageList } = useAuth();

  const onPressLoadCandidates = async () => {
    try {
      setLoading(true);
      const response = await axios.get(Config.ENDPOINTS.CANDIDATES);

      const candidatesData = response.data.candidates;
      if (candidatesData) {
        const newData: Candidate[] = candidatesData.map(
          (element: any, index: number) => {
            const candidatePhotoName = element.name
              .toLowerCase()
              .split(" ")
              .join(".");
            const partyPhotoName = element.party
              .toLowerCase()
              .split(" ")
              .join(".");

            return {
              id: index + 1,
              code: element.code,
              name: element.name,
              party: element.party,
              acronym: element.acronym,
              photo: imageList[candidatePhotoName] ?? "default",
              src: imageList[partyPhotoName],
              status: element.status,
            };
          },
        );

        setCandidates(newData);
      }
    } catch (error: any) {
      if (Config.APP.SHOW_LOGS) {
        console.error("Error loading candidates:", error);
      }
      Alert.alert(
        "Error",
        "Failed to load candidates. Please try again later.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    onPressLoadCandidates();
  }, [onPressLoadCandidates]);

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={{ marginTop: 10, color: "#666" }}>
          Loading candidates...
        </Text>
      </View>
    );
  }

  if (candidates.length === 0) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Text style={{ color: "#666", fontSize: 16 }}>
          No candidates available at this time.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.textCandidates}>Candidates</Text>

      <View style={styles.listContainer}>
        <FlatList
          data={candidates}
          renderItem={({ item, index }) => (
            <CandidateItem
              id={item.id}
              name={item.name}
              party={item.party}
              acronym={item.acronym}
              photo={item.photo}
              src={item.src}
              selected={selected}
              setSelected={setSelected}
              xTexts={xTexts}
              setXtexts={setXtexts}
              isFactor={false}
              key={index}
              navigation={navigation}
            />
          )}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          alwaysBounceVertical={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
    width: "100%",
    height: "auto",
    gap: 10,
    marginTop: 10,
  },
  textCandidates: {
    fontSize: 18,
    fontWeight: "600",
  },
  listContainer: {
    flex: 1,
    backgroundColor: "transparent",
    padding: 0,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    justifyContent: "flex-start",
  },
});
