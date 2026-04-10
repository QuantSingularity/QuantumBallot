import "@testing-library/jest-native/extend-expect";
import { mockAxios } from "./__tests__/fixtures/mockAxios";
import { mockSecureStore } from "./__tests__/fixtures/mockSecureStore";

// Mock expo-secure-store
jest.mock("expo-secure-store", () => mockSecureStore);

// Mock axios
jest.mock("src/api/axios", () => mockAxios);

// Mock react-native-gesture-handler
jest.mock("react-native-gesture-handler", () =>
  require("__mocks__/react-native-gesture-handler"),
);

// Mock expo-camera
jest.mock("expo-camera", () => ({
  Camera: {
    requestCameraPermissionsAsync: jest
      .fn()
      .mockResolvedValue({ status: "granted" }),
    Constants: { Type: { back: "back", front: "front" } },
  },
  CameraView: "CameraView",
  useCameraPermissions: jest
    .fn()
    .mockReturnValue([
      { granted: true, status: "granted" },
      jest.fn().mockResolvedValue({ granted: true }),
    ]),
}));

// Mock expo-barcode-scanner
jest.mock("expo-barcode-scanner", () => ({
  BarCodeScanner: {
    Constants: { Type: { back: "back" } },
  },
}));

// Mock expo-font
jest.mock("expo-font", () => ({
  loadAsync: jest.fn().mockResolvedValue(undefined),
  isLoaded: jest.fn().mockReturnValue(true),
}));

// Mock expo-splash-screen
jest.mock("expo-splash-screen", () => ({
  preventAutoHideAsync: jest.fn(),
  hideAsync: jest.fn(),
}));

// Mock expo-file-system
jest.mock("expo-file-system", () => ({
  documentDirectory: "/mock/documents/",
  writeAsStringAsync: jest.fn().mockResolvedValue(undefined),
  readAsStringAsync: jest.fn().mockResolvedValue("mock-content"),
  getInfoAsync: jest.fn().mockResolvedValue({ exists: true }),
}));

// Mock expo-document-picker
jest.mock("expo-document-picker", () => ({
  getDocumentAsync: jest.fn().mockResolvedValue({
    assets: [{ uri: "/mock/certificate.cert", name: "certificate.cert" }],
  }),
}));

// Mock expo-clipboard
jest.mock("expo-clipboard", () => ({
  setStringAsync: jest.fn().mockResolvedValue(undefined),
  getStringAsync: jest.fn().mockResolvedValue(""),
}));

// Mock expo-linear-gradient
jest.mock("expo-linear-gradient", () => ({
  LinearGradient: "LinearGradient",
}));

// Mock react-native-vector-icons
jest.mock("react-native-vector-icons/MaterialCommunityIcons", () => "Icon");

// Mock phosphor-react-native
jest.mock("phosphor-react-native", () => ({
  CaretLeft: "CaretLeft",
  Eye: "Eye",
  EyeClosed: "EyeClosed",
  SignOut: "SignOut",
  UserFocus: "UserFocus",
  WarningCircle: "WarningCircle",
  UsersFour: "UsersFour",
}));

// Mock react-native-progress
jest.mock("react-native-progress", () => ({
  Bar: "ProgressBar",
  Circle: "ProgressCircle",
}));

// Mock @react-navigation/native
jest.mock("@react-navigation/native", () => ({
  ...jest.requireActual("@react-navigation/native"),
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
    reset: jest.fn(),
  }),
  useRoute: () => ({
    params: { id: "1" },
  }),
}));

// Silence Animated NativeDriver warning
jest.mock("react-native/Libraries/Animated/NativeAnimatedHelper");

// Silence console.error and console.warn in tests to keep output clean
const originalError = console.error;
console.error = (...args) => {
  if (
    typeof args[0] === "string" &&
    (args[0].includes("Warning:") || args[0].includes("Each child"))
  ) {
    return;
  }
  originalError(...args);
};
