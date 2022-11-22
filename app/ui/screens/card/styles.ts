import { withTheme } from "hooks/useTheme"

export const useStyles = withTheme(theme => ({
  root: {
    backgroundColor: theme.colors.background,
    flex: 1,
    paddingHorizontal: 0,
  },
  content: {
    paddingTop: 16,
    marginHorizontal: theme.spaces.h24,
  },
}))
