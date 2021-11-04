import { ThemeManager } from "react-native-ui-lib";

ThemeManager.setComponentForcedTheme('Button', (props, context) => {
  return {
    style: { borderRadius: 2 },
    labelStyle: {
      fontFamily: "Roboto-Regular"
    }
  };
});

ThemeManager.setComponentForcedTheme('Text', (props) => {
  return {
    fontFamily: props.bold ? "Roboto-Bold" : "Roboto-Regular"
  }
});