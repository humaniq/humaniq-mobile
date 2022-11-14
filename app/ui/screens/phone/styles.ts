import { withTheme } from "hooks/useTheme"

export const useStyles = withTheme(theme => ({
  root: {
    backgroundColor: theme.colors.bg,
    paddingHorizontal: 0,
  },
  content: {
    paddingHorizontal: theme.spaces.horizontal,
    paddingBottom: theme.spaces.horizontal
  },
  title: {
    marginTop: theme.spaces.vertical,
  },
  input: {
    marginTop: theme.spaces.vertical
  },
  button: {
    marginTop: theme.spaces.vertical
  }
}))
