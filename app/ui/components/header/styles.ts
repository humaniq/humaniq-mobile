import { withTheme } from "hooks/useTheme"

export const useStyles = withTheme(theme => ({
  root: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 16
  },
  title: {
    fontFamily: theme.fonts.medium,
    fontSize: 22,
    color: theme.colors.headerTitle
  },
  back: {
    ...theme.shadows,
    height: 42,
    width: 42,
    backgroundColor: theme.colors.headerCircle,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10
  },
  close: {
    ...theme.shadows,
    height: 42,
    width: 42,
    backgroundColor: theme.colors.headerCircle,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10
  },
  settings: {
    height: 42,
    width: 42,
    backgroundColor: theme.colors.settings,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center"
  }
}))
