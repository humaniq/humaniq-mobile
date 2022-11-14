import { withTheme } from "hooks/useTheme"

export const useStyles = withTheme(theme => ({
  root: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: theme.spaces.horizontal
  },
  title: {
    fontFamily: theme.fonts.medium,
    fontSize: 20,
    color: theme.colors.headerTitle,
    flex: 1,
  },
  back: {
    ...theme.shadows,
    height: 42,
    width: 42,
    backgroundColor: theme.colors.headerCircle,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16
  },
  close: {
    ...theme.shadows,
    height: 42,
    width: 42,
    backgroundColor: theme.colors.headerCircle,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
  closeWithShadows: {
    ...theme.shadows,
    backgroundColor: theme.colors.headerCircle,
  },
  settings: {
    height: 42,
    width: 42,
    backgroundColor: theme.colors.settings,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 16,
  }
}))
