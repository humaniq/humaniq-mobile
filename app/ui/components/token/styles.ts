import { withTheme } from "hooks/useTheme"

export const useStyles = withTheme(theme => ({
  root: {
    flexDirection: "row",
    alignItems: "center",
    // marginBottom: 24
  },
  image: {
    alignItems: "center",
    justifyContent: "center",
  },
  imageMini: {

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
    marginTop: 2
  },
}))
