import { withTheme } from "hooks/useTheme"

export const useStyles = withTheme(theme => ({
  root: {
    backgroundColor: theme.colors.primaryButton,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  text: {
    fontFamily: theme.fonts.regular,
    color: theme.colors.white,
    fontSize: 15,
  },
}))
