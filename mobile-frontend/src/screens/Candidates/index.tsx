import { CandidatesList } from "@components/CandidatesList";
import { HeaderElection } from "@components/HeaderElection";
import { LiveProjection } from "@components/LiveProjection";
import { StyleSheet, View } from "react-native";

export function Candidates({ navigation }: any) {
  return (
    <View style={styles.container}>
      <HeaderElection />
      <View style={styles.containerWrapper}>
        <LiveProjection />
        <CandidatesList navigation={navigation} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#ffffff",
    width: "100%",
    paddingTop: 60,
    gap: 5,
  },
  containerWrapper: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "transparent",
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    gap: 10,
  },
});
