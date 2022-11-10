import { withTheme } from "hooks/useTheme"

export const useStyles = withTheme(theme => ({
  root: {
    backgroundColor: theme.colors.bg,
    flex: 1,
    paddingHorizontal: 22,
    paddingBottom: 22,
  },
  content: {
    paddingTop: 16,
  }
}))
