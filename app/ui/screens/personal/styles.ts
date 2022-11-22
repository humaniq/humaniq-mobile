import { withTheme } from "hooks/useTheme"

export const useStyles = withTheme(theme => ({
  root: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
  content: {
    paddingLeft: theme.spaces.h24,
    paddingRight: theme.spaces.h24,
    paddingBottom: theme.spaces.h24,
  },
  title: {
    marginTop: 24,
  },
  gender: {
    marginVertical: theme.spaces.v40,
  },
  input: {
    marginTop: 24,
  },
  button: {
    marginTop: theme.spaces.v40,
  },
}))
