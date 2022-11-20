import { withTheme } from "hooks/useTheme"

export const useStyles = withTheme(theme => ({
  root: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
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
    color: theme.colors.secondary,
    includeFontPadding: false,
    marginTop: 4
  },
  comingSoon: {
    borderRadius: 8,
    backgroundColor: theme.colors.settings,
    alignItems: "center",
    justifyContent: "center",
  },
  comingSoonText: {
    fontFamily: theme.fonts.semi,
    fontSize: 10,
    marginVertical: 2,
    marginHorizontal: 5,
    color: theme.colors.comingSoonText,
  }
}))
