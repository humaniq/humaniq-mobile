import { withTheme } from "hooks/useTheme"

export const useStyles = withTheme(theme => ({
  root: {
    backgroundColor: theme.colors.bg,
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 2,
    marginTop: 40,
  },
  text: {
    fontFamily: theme.fonts.regular,
    color: theme.colors.secondary,
    fontSize: 12,
    flex: 1,
    marginLeft: 20,
    lineHeight: 18,
  }
}))
