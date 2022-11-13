import { withTheme } from "hooks/useTheme"

export const useStyles = withTheme(theme => ({
  root: {
    flex: 1,
    backgroundColor: theme.colors.bg,
    paddingHorizontal: theme.spaces.horizontal
  },
  content: {
    paddingLeft: theme.spaces.horizontal,
    paddingRight: theme.spaces.horizontal
  },
  description: {
    marginTop: 20,
    marginBottom: theme.spaces.vertical
  },
  input: {
    marginTop: theme.spaces.vertical
  }
}))
