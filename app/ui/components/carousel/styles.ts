import { withTheme } from "hooks/useTheme"

export const useStyles = withTheme(theme => ({
  root: {},
  header: {
    fontFamily: theme.fonts.regular,
    color: theme.colors.secondary,
    fontSize: 13,
    marginHorizontal: 20,
  },
  content: {},
}))
