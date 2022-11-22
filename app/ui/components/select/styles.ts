import { withTheme } from "hooks/useTheme"

export const useStyles = withTheme(theme => ({
  root: {
    alignItems: "flex-start",
    marginHorizontal: 2
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
    fontSize: 15,
    color: theme.colors.text,
    marginRight: 10
  },
  icon: {
    fontSize: 15,
    marginRight: 8,
    includeFontPadding: false,
    textAlign: "center"
  },
  description: {
    fontFamily: theme.fonts.regular,
    color: theme.colors.secondary,
    lineHeight: 25,
    fontSize: 14,
    marginTop: 8
  },
  dropdown: {
    backgroundColor: theme.colors.select
  },
  dropdownText: {
    fontFamily: theme.fonts.regular,
    fontSize: 16,
    color: theme.colors.text
  }
}))
