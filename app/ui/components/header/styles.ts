import { withTheme } from "hooks/useTheme"

export const useStyles = withTheme(theme => ({
  root: {
    flexDirection: "row",
    alignItems: "center"
  },
  title: {
    fontFamily: theme.fonts.semi,
    fontSize: 20,
  }
}))
