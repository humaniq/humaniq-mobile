import { withTheme } from "hooks/useTheme"

export const useStyles = withTheme(theme => ({
  root: {
    backgroundColor: theme.colors.bg,
    flex: 1,
    paddingHorizontal: 22,
    paddingBottom: 22,
  },
  title: {
    fontFamily: theme.fonts.regular,
    color: theme.colors.secondary,
    lineHeight: 25,
    fontSize: 16,
    marginTop: 24,
  },
  input: {
    marginTop: 40,
  },
  button: {
    marginTop: 40,
  }
}))
