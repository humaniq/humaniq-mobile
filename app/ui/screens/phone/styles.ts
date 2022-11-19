import { withTheme } from "hooks/useTheme"

export const useStyles = withTheme(theme => ({
  root: {
    backgroundColor: theme.colors.background,
    paddingHorizontal: 0,
  },
  content: {
    paddingHorizontal: theme.spaces.h24,
    paddingBottom: theme.spaces.h24,
  },
  title: {
    marginTop: theme.spaces.v40,
  },
  input: {
    marginTop: theme.spaces.v40,
  },
  button: {
    marginTop: theme.spaces.v40,
  },
}))
