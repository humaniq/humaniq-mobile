import { withTheme } from "hooks/useTheme"

export const useStyles = withTheme(theme => ({
  root: {
    backgroundColor: theme.colors.background,
    flex: 1,
    paddingHorizontal: theme.spaces.h24,
    paddingBottom: 22,
  },
  content: {
    paddingLeft: theme.spaces.h24,
    paddingRight: theme.spaces.h24,
  },
  title: {
    fontFamily: theme.fonts.regular,
    color: theme.colors.secondary,
    lineHeight: 25,
    fontSize: 16,
    marginTop: 24,
  },
  input: {
    marginTop: theme.spaces.v40,
  },
  button: {
    marginTop: theme.spaces.v40,
  },
}))
