import { withTheme } from "hooks/useTheme"

export const useStyles = withTheme(theme => ({
  container: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    maxWidth: 400,
  },
  actionsContainer: {},
  button: {
    fontSize: 24
  }
}))
