import { withTheme } from "hooks/useTheme"

export const useStyles = withTheme(theme => ({
  root: {
  },
  input: {
    backgroundColor: theme.colors.tertiary,
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 14,
    fontFamily: theme.fonts.bold,
    fontSize: 15,
    color: "#A1A1A1"
  },
  title: {
    fontFamily: theme.fonts.regular,
    color: theme.colors.sub,
    marginBottom: 8,
    fontSize: 12,
  },
}))
