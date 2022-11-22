/**
 * @format
 */

import "node-libs-react-native/globals";
import { AppRegistry, Text, TouchableOpacity, View, FlatList } from "react-native";
import { App } from "./App";
import { name as appName } from "./app.json";

TouchableOpacity.defaultProps = {
  ...TouchableOpacity.defaultProps,
  activeOpacity: 0.7,
};

const Test = ({}) => {
  return (
    <View>
      <FlatList data={[1, 2, 3]} renderItem={({ item }) => (
        <Text>{item}</Text>
      )} />
    </View>
  );
};

AppRegistry.registerComponent(appName, () => Test);
