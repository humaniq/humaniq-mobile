import { withTheme } from "hooks/useTheme"

export const useStyles = withTheme(theme => ({
  root: {
    alignItems: "flex-start",
    marginTop: theme.spaces.vertical,
    marginBottom: theme.spaces.vertical
  },
  container: {
    paddingLeft: theme.spaces.horizontal,
    paddingVertical: 8
  },
  header: {
    fontFamily: theme.fonts.regular,
    color: theme.colors.sub,
    fontSize: 12,
    marginLeft: theme.spaces.horizontal
  }
}))
