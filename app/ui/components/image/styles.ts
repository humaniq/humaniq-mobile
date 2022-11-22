import { withTheme } from "hooks/useTheme"

export const useStyles = withTheme(theme => ({
  root: {
    alignItems: "center",
    justifyContent: "center",
  },
  placeholder: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.tertiary
  },
  placeholderText: {
    fontFamily: theme.fonts.medium,
    color: theme.colors.text,
    paddingHorizontal: 4,
    fontSize: 11,
    alignSelf: "center",
  }
}))
