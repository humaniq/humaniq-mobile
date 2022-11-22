import { withTheme } from "hooks/useTheme"

export const useStyles = withTheme(theme => ({
  root: {
    width: 120,
    backgroundColor: theme.colors.tertiary,
    marginRight: 40,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 18,
    alignItems: "flex-end",
    ...theme.shadows
  },
  title: {
    fontFamily: theme.fonts.medium,
    fontSize: 16,
    alignSelf: "flex-start",
    marginTop: 4,
  }
}))
