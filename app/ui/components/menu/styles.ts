import { withTheme } from "hooks/useTheme"

export const useStyles = withTheme(theme => ({
  root: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24
  },
  middle: {
    flex: 1,
    marginLeft: 22
  },
  title: {
    fontSize: 14,
    fontFamily: theme.fonts.semi,
    color: theme.colors.menuTitle,
    includeFontPadding: false
  },
  subTitle: {
    fontSize: 13,
    fontFamily: theme.fonts.regular,
    color: theme.colors.menuSub,
    includeFontPadding: false,
    marginTop: 2
  },
  comingSoon: {
    borderRadius: 8,
    backgroundColor: theme.colors.comingSoonBg,
    alignItems: "center",
    justifyContent: "center",
  },
  comingSoonText: {
    fontFamily: theme.fonts.regular,
    fontSize: 11,
    marginVertical: 4,
    marginHorizontal: 7,
    color: theme.colors.comingSoonText
  }
}))
