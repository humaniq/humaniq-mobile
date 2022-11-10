import { withTheme } from "hooks/useTheme"

export const useStyles = withTheme(theme => ({
  root: {
    alignItems: "flex-start",
    marginLeft: 24
  },
  header: {
    fontFamily: theme.fonts.regular,
    color: theme.colors.sub,
    fontSize: 12,
    marginBottom: 8
  },
  select: {
    ...theme.shadows,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: theme.colors.select,
    flexDirection: "row",
    alignItems: "center"
  },
  selectText: {
    fontFamily: theme.fonts.medium,
    fontSize: 16,
    color: theme.colors.headerTitle,
    marginRight: 10,
  },
  description: {
    fontFamily: theme.fonts.regular,
    color: theme.colors.secondary,
    lineHeight: 25,
    fontSize: 16,
    marginTop: 8,
  },
  dropdown: {
    backgroundColor: theme.colors.select,
  },
  dropdownText: {
    fontFamily: theme.fonts.regular,
    fontSize: 16,
    color: theme.colors.headerTitle,
  },
}))
