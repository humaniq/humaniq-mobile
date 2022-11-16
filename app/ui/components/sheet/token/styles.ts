import { withTheme } from "hooks/useTheme"

export const useStyles = withTheme(theme => ({
  root: {
    backgroundColor: theme.colors.bg
  },
  content: {
  },
  indicator: {
    backgroundColor: theme.colors.searchIcon,
    width: 36,
    height: 5
  },
  title: {
    fontFamily: theme.fonts.bold,
    fontSize: 18,
    color: theme.colors.headerTitle,
    textAlign: "center",
    marginHorizontal: 18,
    marginTop: 10,
  },
  search: {
    marginTop: 20,
    marginBottom: 20,
    marginHorizontal: 18,
  },
  sub: {
    fontFamily: theme.fonts.regular,
    color: theme.colors.secondary,
    fontSize: 13,
    marginHorizontal: 18,
  },
  carousel: {
    paddingHorizontal: 18,
    marginBottom: 20,
    marginTop: 20,
  },
  divider: {
    marginHorizontal: 18,
  }
}))
