import { withTheme } from "hooks/useTheme"

export const useStyles = withTheme(theme => ({
  root: {
    backgroundColor: theme.colors.bg,
    flex: 1,
    paddingBottom: 22,
  },
  header: {
    paddingHorizontal: 22,
  },
  language: {
    marginTop: 40,
  }
}))
