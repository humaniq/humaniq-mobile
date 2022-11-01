import { Colors, ThemeManager } from "react-native-ui-lib"

export const applyTheme = () => {
  ThemeManager.setComponentForcedTheme('Card', (props, context) => {
    return {
      enableShadow: false,
      ...props
    }
  })

  ThemeManager.setComponentForcedTheme('Checkbox', (props, context) => {
    return {
      color: props.value ? Colors.primary : Colors.textGrey,
      ...props
    }
  })

  ThemeManager.setComponentForcedTheme('Button', (props, context) => {
    return {
      backgroundColor: props.backgroundColor || Colors.primary,
      color: props.outlineColor ? props.outlineColor : props.link || props.outline ? Colors.primary : Colors.white,
      outlineColor: props.outlineColor ? props.outlineColor : props.outline ? Colors.primary : Colors.transparent,
      ...props
    }
  })

  ThemeManager.setComponentForcedTheme('Switch', (props, context) => {
    return {
      onColor: props.onColor || Colors.primary,
      ...props
    }
  })
}
