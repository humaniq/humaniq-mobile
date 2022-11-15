import { withTheme } from "hooks/useTheme"

export const useStyles = withTheme(theme => ({
  root: {
    flexDirection: "row",
    alignItems: "center",
  },
  textMedium: {
    color: theme.colors.primary,
    fontFamily: theme.fonts.medium,
    fontSize: 26,
    paddingRight: 12,
  },
}))
