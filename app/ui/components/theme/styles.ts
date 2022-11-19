import { withTheme } from "hooks/useTheme"

export const useStyles = withTheme(theme => ({
  root: {
    alignItems: "flex-start",
    marginTop: theme.spaces.v40,
    marginBottom: theme.spaces.v40
  },
  container: {
    paddingLeft: theme.spaces.h24,
    paddingVertical: 8
  },
  header: {
    fontFamily: theme.fonts.regular,
    color: theme.colors.sub,
    fontSize: 12,
    marginLeft: theme.spaces.h24
  }
}))
