import { withTheme } from "hooks/useTheme"

export const useStyles = withTheme(theme => ({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spaces.h24,
  },
  content: {
    paddingLeft: theme.spaces.h24,
    paddingRight: theme.spaces.h24,
  },
  description: {
    marginTop: 20,
    marginBottom: theme.spaces.v40,
  },
  input: {
    marginTop: theme.spaces.v40,
  },
}))
