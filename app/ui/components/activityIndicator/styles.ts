import { withTheme } from "hooks/useTheme"

export const useStyles = withTheme(theme => ({
  root: {
    color: theme.colors.primary,
  },
}))
