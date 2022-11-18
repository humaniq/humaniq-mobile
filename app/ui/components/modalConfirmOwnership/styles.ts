import { withTheme } from "hooks/useTheme"

export const useStyles = withTheme(theme => ({
  root: {},
  description: {
    fontFamily: theme.fonts.regular,
    color: theme.colors.primary,
    lineHeight: 25,
    fontSize: 16,
    textAlign: "center",
  },
  title: {
    fontFamily: theme.fonts.bold,
    color: theme.colors.primary,
    lineHeight: 40,
    fontSize: 20,
    textAlign: "center",
  },
  indicator: {
    paddingTop: 50
  },
  button: {
    marginTop: 20
  }
}))
