import { LinearGradient } from "expo-linear-gradient";
import { UsersFour } from "phosphor-react-native";
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  View,
} from "react-native";

type ItemProps = {
  title: string;
  timestamp: string;
  people: string;
  src: ImageSourcePropType;
};

export function NewsItem({ title, timestamp, people, src }: ItemProps) {
  return (
    <View style={styles.container}>
      <LinearGradient
        start={{ x: 0.1, y: 0.2 }}
        end={{ x: 0.9, y: 0.6 }}
        locations={[0.2, 0.1, 1]}
        colors={["#ddce71", "#EAD972", "#F56F6F"]}
        style={styles.background}
      />
      <View style={styles.item}>
        <View style={styles.halfMoon} />

        <View style={styles.imageView}>
          <Image source={src} style={styles.image} />
        </View>

        <View style={styles.rightContainer}>
          <View style={styles.topTitleContainer}>
            <Text style={styles.titleText}>{title}</Text>
          </View>

          <View style={styles.bottomContainer}>
            <Text style={styles.timestampText}>{timestamp}</Text>
            <View>
              <UsersFour size={16} color="#ffffff" />
            </View>
            <Text style={styles.peopleText}>{people}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    width: "100%",
    backgroundColor: "#fff",
    height: 100,
    marginBottom: 10,
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: "100%",
    borderRadius: 10,
  },
  item: {
    flexDirection: "row",
    backgroundColor: "transparent",
    paddingLeft: 0,
    width: "100%",
    marginVertical: 8,
    marginHorizontal: 0,
    flex: 1,
    borderRadius: 10,
    alignItems: "center",
  },
  halfMoon: {
    justifyContent: "flex-start",
    backgroundColor: "#ee6060",
    width: 50,
    height: "85%",
    alignContent: "center",
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    paddingLeft: 0,
    left: -38,
    position: "absolute",
  },
  imageView: {
    width: 60,
    marginLeft: 20,
    justifyContent: "center",
    backgroundColor: "transparent",
    alignSelf: "center",
    alignItems: "center",
    flex: 1,
    height: "90%",
    flexDirection: "row",
    borderRadius: 10,
    maxWidth: 60,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
    resizeMode: "cover",
  },
  rightContainer: {
    paddingLeft: 5,
    flex: 1,
    gap: 5,
    paddingRight: 10,
  },
  topTitleContainer: {
    justifyContent: "flex-start",
  },
  titleText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  bottomContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingTop: 5,
    gap: 5,
  },
  timestampText: {
    marginRight: 20,
    color: "#ffffff",
  },
  peopleText: {
    color: "#ffffff",
  },
});
