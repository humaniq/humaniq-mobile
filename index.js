/**
 * @format
 */
import "node-libs-react-native/globals";
import { AppRegistry } from "react-native";
import { App } from "App";
import { expo } from "./app.json";
import { App2 } from "App2";

AppRegistry.registerComponent(expo.name, () => App2);
