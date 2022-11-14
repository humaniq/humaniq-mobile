import { withTheme } from "hooks/useTheme"

export const useStyles = withTheme(theme => ({
  root: {
    backgroundColor: theme.colors.primaryButton,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center"
  },
  text: {
    fontFamily: theme.fonts.regular,
    color: theme.colors.white,
    fontSize: 15,
    marginVertical: 13,
    paddingHorizontal: 20,
  },
}))
