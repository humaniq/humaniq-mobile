import { withTheme } from "hooks/useTheme"
import { StyleSheet } from "react-native"

export const useStyles = withTheme(theme => ({
  root: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  description: {
    fontFamily: theme.fonts.regular,
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
    paddingTop: 8,
  },
  blur: {
    ...StyleSheet.absoluteFillObject,
  },
}))
