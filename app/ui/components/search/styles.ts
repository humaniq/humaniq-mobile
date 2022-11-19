import { withTheme } from "hooks/useTheme"

export const useStyles = withTheme(theme => ({
  root: {
    backgroundColor: theme.colors.tertiary,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 24,
    borderRadius: 8,
    height: 42,
  },
  input: {
    flex: 1,
    fontFamily: theme.fonts.medium,
    color: theme.colors.searchIcon,
    marginLeft: 12,
    marginRight: 12,
    fontSize: 14,
  },
}))
