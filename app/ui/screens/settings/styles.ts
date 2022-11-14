import { withTheme } from "hooks/useTheme"

export const useStyles = withTheme(theme => ({
  root: {
    backgroundColor: theme.colors.bg,
    flex: 1,
    paddingHorizontal: 0,
  },
  language: {
    marginTop: theme.spaces.vertical,
    marginLeft: theme.spaces.horizontal,
    marginRight: theme.spaces.horizontal
  },
  button: {
    marginTop: theme.spaces.vertical,
    marginHorizontal: theme.spaces.horizontal,
    backgroundColor: theme.colors.red
  },
  avatar: {
    marginTop: theme.spaces.vertical,
    marginLeft: theme.spaces.horizontal,
  },
  tag: {
    fontFamily: theme.fonts.regular,
    color: theme.colors.sub,
    fontSize: 14,
    marginLeft: theme.spaces.horizontal,
    marginTop: theme.spaces.vertical,
  },
  tag2: {
    fontFamily: theme.fonts.semi,
    color: theme.colors.sub,
    fontSize: 24,
    marginLeft: theme.spaces.horizontal,
  },
  currency: {
    marginLeft: theme.spaces.horizontal,
    marginRight: theme.spaces.horizontal
  },
}))
