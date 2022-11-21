import { withTheme } from "hooks/useTheme"

export const useStyles = withTheme(theme => ({
  root: {
    ...theme.shadows,
    position: "absolute",
    bottom: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    alignSelf: "center",
    height: 50,
    borderRadius: 40,
    backgroundColor: theme.colors.headerCircle,
    paddingHorizontal: 10,
  },
  tab: {
    alignItems: "center",
    justifyContent: "center",
    width: 58,
    height: "100%",
    borderRadius: 40
  }
}))
