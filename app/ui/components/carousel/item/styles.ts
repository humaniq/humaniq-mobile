import { withTheme } from "hooks/useTheme"

export const useStyles = withTheme(theme => ({
  root: {
    flexDirection: "row",
    alignItems: "center",
    padding: 9,
    borderRadius: 16,
    backgroundColor: theme.colors.secondaryBg,
    marginRight: 12,
  },
  icon: {
    width: 20,
    height: 20,
  },
  text: {
    fontFamily: theme.fonts.medium,
    fontSize: 13,
    marginLeft: 8
  },
  selected: {
    backgroundColor: theme.colors.white,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 0
    },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3
  }
}))
