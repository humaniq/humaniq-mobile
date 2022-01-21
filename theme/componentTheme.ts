import { Colors, ThemeManager } from "react-native-ui-lib";


export const applyTheme = () => {

    ThemeManager.setComponentForcedTheme('Card', (props, context) => {
        return {
            ...props,
            enableShadow: false,
        };
    });

    ThemeManager.setComponentForcedTheme('Checkbox', (props, context) => {
        return {
            color: props.value ? Colors.primary : Colors.textGrey,
            ...props,
        };
    });
}