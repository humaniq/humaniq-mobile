import { withTheme } from "hooks/useTheme"

export const useStyles = withTheme(theme => ({
  root: {
    backgroundColor: theme.colors.white,
    padding: 24,
    borderRadius: 12,
    marginHorizontal: 51
  },
}))
