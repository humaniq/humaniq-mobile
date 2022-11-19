import { withTheme } from "hooks/useTheme"

export const useStyles = withTheme(theme => ({
  root: {
    flexDirection: "row",
    alignItems: "center",
    padding: 9,
    borderRadius: 16,
    backgroundColor: theme.colors.tertiary,
    marginRight: 12,
    marginVertical: 4,
  },
  icon: {
    width: 17,
    height: 17,
    borderRadius: 17,
  },
  text: {
    fontFamily: theme.fonts.medium,
    fontSize: 13,
    marginLeft: 8,
    color: theme.colors.text,
  },
  selected: {
    backgroundColor: theme.colors.white,
    ...theme.shadows,
  },
  selectedText: {
    color: theme.colors.black,
  },
}))
