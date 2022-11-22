/**
 * @format
 */
import "node-libs-react-native/globals";
import { AppRegistry, TouchableOpacity } from "react-native";
import { expo } from "./app.json";
import { gestureHandlerRootHOC } from "react-native-gesture-handler";
import { App } from "App2";

TouchableOpacity.defaultProps = {
  ...TouchableOpacity.defaultProps,
  activeOpacity: 0.7,
};

AppRegistry.registerComponent(expo.name, () => gestureHandlerRootHOC(App));
