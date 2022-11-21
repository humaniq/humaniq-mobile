/**
 * @format
 */

import "node-libs-react-native/globals";
import { AppRegistry, TouchableOpacity } from "react-native";
import { App } from "./App";
import { name as appName} from './app.json';
import { gestureHandlerRootHOC } from "react-native-gesture-handler";

TouchableOpacity.defaultProps = {
  ...TouchableOpacity.defaultProps,
  activeOpacity: 0.7,
};

AppRegistry.registerComponent(appName, () => gestureHandlerRootHOC(App));
