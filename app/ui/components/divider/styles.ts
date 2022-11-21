import { withTheme } from "hooks/useTheme"

export const useStyles = withTheme(theme => ({
  root: {
    backgroundColor: theme.colors.divider,
    height: 0.5,
  }
}))
