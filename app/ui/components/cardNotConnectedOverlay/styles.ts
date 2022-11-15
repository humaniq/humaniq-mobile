import { withTheme } from "hooks/useTheme"

export const useStyles = withTheme(theme => ({
  notConnected: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 3,
    display: "flex",
    flex: 1,
    flexWrap: "nowrap",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: 200,
    borderRadius: 12,
  },
  description: {
    fontWeight: "400",
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
    paddingTop: 8
  },
  absolute: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  button: {
    width: 150
  }
}))
