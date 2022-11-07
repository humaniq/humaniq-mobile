import { withTheme } from "hooks/useTheme"

export const useStyles = withTheme(theme => ({
  root: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24
  },
  middle: {
    flex: 1,
    marginLeft: 22,
  },
  title: {
    fontSize: 15,
    fontFamily: theme.fonts.semi,
    color: theme.colors.menuTitle,
  },
  subTitle: {
    fontSize: 14,
    fontFamily: theme.fonts.regular,
    color: theme.colors.menuSub,
  },
  comingSoon: {
    borderRadius: 8,
    backgroundColor: theme.colors.comingSoonBg,
    alignItems: "center",
    justifyContent: "center"
  },
  comingSoonText: {
    fontFamily: theme.fonts.regular,
    fontSize: 12,
    marginVertical: 4,
    marginHorizontal: 7,
    color: theme.colors.comingSoonText,
  }
}))
