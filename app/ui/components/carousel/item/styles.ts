import { withTheme } from "hooks/useTheme"

export const useStyles = withTheme(theme => ({
  root: {
    flexDirection: "row",
    alignItems: "center",
    padding: 9,
    borderRadius: 16,
    backgroundColor: theme.colors.secondaryBg,
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
    color: theme.colors.comingSoonText
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
