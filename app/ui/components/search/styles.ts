import { withTheme } from "hooks/useTheme"

export const useStyles = withTheme(theme => ({
  root: {
    backgroundColor: theme.colors.searchBg,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 24,
    borderRadius: 10,
    height: 40,
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
