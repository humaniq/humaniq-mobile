import { withTheme } from "hooks/useTheme"

export const useStyles = withTheme(theme => ({
  root: {
    backgroundColor: theme.colors.bg,
    flex: 1,
    paddingHorizontal: theme.spaces.horizontal,
    paddingBottom: 22
  },
  title: {
    fontFamily: theme.fonts.regular,
    color: theme.colors.secondary,
    lineHeight: 25,
    fontSize: 16,
    marginTop: 24
  },
  input: {
    marginTop: theme.spaces.vertical
  },
  button: {
    marginTop: theme.spaces.vertical
  }
}))
