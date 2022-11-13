import { withTheme } from "hooks/useTheme"

export const useStyles = withTheme(theme => ({
  root: {
    marginTop: theme.spaces.vertical,
  },
  skin: {
    width: "100%",
    height: 220,
    borderRadius: 12
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    position: "absolute",
    bottom: 24,
    left: 24,
    right: 24,
  },
  tag: {
    fontFamily: theme.fonts.medium,
    fontSize: 16,
    color: theme.colors.white
  }
}))
