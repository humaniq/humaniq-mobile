import { withTheme } from "hooks/useTheme"

export const useStyles = withTheme(theme => ({
  root: {
    backgroundColor: theme.colors.tertiary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'space-between',
    marginBottom: 12
  },
  title: {
    fontFamily: theme.fonts.medium,
    color: theme.colors.headerTitle,
    fontSize: 14,
    flex: 1,
  },
}))
