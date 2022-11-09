import { withTheme } from "hooks/useTheme"

export const useStyles = withTheme(theme => ({
  root: {
    backgroundColor: theme.colors.bg,
    flex: 1,
    padding: 20,
  }
}))
