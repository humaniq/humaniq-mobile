/**
 * @format
 */
import "node-libs-react-native/globals";
import { AppRegistry } from "react-native";
import { App } from "./App";
import { App2 } from "./App2";
import { expo } from "./app.json";

AppRegistry.registerComponent(expo.name, () => App2);
