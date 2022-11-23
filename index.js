/**
 * @format
 */

import "node-libs-react-native/globals";
import { AppRegistry, Text, TouchableOpacity, View, FlatList } from "react-native";
import { gestureHandlerRootHOC } from "react-native-gesture-handler";
import { App } from "./App";
import { name as appName } from "./app.json";

TouchableOpacity.defaultProps = {
  ...TouchableOpacity.defaultProps,
  activeOpacity: 0.7,
};

AppRegistry.registerComponent(appName, () => gestureHandlerRootHOC(App));
