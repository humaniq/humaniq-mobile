import { withTheme } from "hooks/useTheme"

export const useStyles = withTheme(theme => ({
  root: {
    backgroundColor: theme.colors.bg,
    flex: 1
  },
  content: {
    paddingLeft: theme.spaces.horizontal,
    paddingRight: theme.spaces.horizontal,
    paddingBottom: theme.spaces.horizontal
  },
  title: {
    marginTop: 24
  },
  gender: {
    marginVertical: theme.spaces.vertical,
  },
  input: {
    marginTop: 24
  },
  button: {
    marginTop: theme.spaces.vertical
  }
}))
