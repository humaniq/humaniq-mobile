import { withTheme } from "hooks/useTheme"

export const useStyles = withTheme(theme => ({
  root: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 43,
    height: 43,
    borderRadius: 43,
  },
  imageMini: {
    width: 16,
    height: 16,
    borderRadius: 16,
    position: "absolute",
    bottom: 0,
    left: -8,
  },
  middle: {
    flex: 1,
    marginLeft: 16,
  },
  title: {
    fontSize: 15,
    fontFamily: theme.fonts.medium,
    color: theme.colors.menuTitle,
    includeFontPadding: false,
  },
  subTitle: {
    fontSize: 13,
    fontFamily: theme.fonts.regular,
    color: theme.colors.secondary,
    includeFontPadding: false,
    marginTop: 4,
  },
  cost: {
    fontFamily: theme.fonts.regular,
    color: theme.colors.text,
    fontSize: 14,
  },
}))
