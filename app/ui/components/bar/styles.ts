import { withTheme } from "hooks/useTheme"

export const useStyles = withTheme(theme => ({
  root: {
    position: "absolute",
    bottom: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    alignSelf: "center",
    height: 50,
    borderRadius: 40,
    backgroundColor: theme.colors.tabBg,
    paddingHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 5,
  },
  tab: {
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    height: "100%",
    borderRadius: 40,
  }
}))
