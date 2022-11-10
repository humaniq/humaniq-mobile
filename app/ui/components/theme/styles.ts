import { withTheme } from "hooks/useTheme"

export const useStyles = withTheme(theme => ({
  root: {
    alignItems: "flex-start",
    marginTop: 40,
    marginBottom: 40,
  },
  container: {
    paddingLeft: 24,
    paddingVertical: 8
  },
  header: {
    fontFamily: theme.fonts.regular,
    color: theme.colors.sub,
    fontSize: 12,
    marginLeft: 24
  }
}))
