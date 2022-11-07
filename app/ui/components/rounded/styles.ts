import { withTheme } from "hooks/useTheme"

export const useStyles = withTheme(theme => ({
  root: {
    backgroundColor: theme.colors.roundedIconBg,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6
  }
}))
