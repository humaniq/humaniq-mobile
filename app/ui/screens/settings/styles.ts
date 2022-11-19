import { withTheme } from "hooks/useTheme"

export const useStyles = withTheme(theme => ({
  root: {
    backgroundColor: theme.colors.background,
    flex: 1,
    paddingHorizontal: 0,
  },
  language: {
    marginTop: theme.spaces.v40,
    marginLeft: theme.spaces.h24,
    marginRight: theme.spaces.h24,
  },
  button: {
    marginTop: theme.spaces.v40,
    marginHorizontal: theme.spaces.h24,
    backgroundColor: theme.colors.red,
  },
  avatar: {
    marginTop: theme.spaces.v40,
    marginLeft: theme.spaces.h24,
  },
  tag: {
    fontFamily: theme.fonts.regular,
    color: theme.colors.sub,
    fontSize: 14,
    marginLeft: theme.spaces.h24,
    marginTop: theme.spaces.v40,
  },
  tag2: {
    fontFamily: theme.fonts.semi,
    color: theme.colors.sub,
    fontSize: 24,
    marginLeft: theme.spaces.h24,
  },
  currency: {
    marginLeft: theme.spaces.h24,
    marginRight: theme.spaces.h24,
  },
}))
