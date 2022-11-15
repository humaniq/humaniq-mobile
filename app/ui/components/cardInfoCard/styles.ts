import { withTheme } from "hooks/useTheme"

export const useStyles = withTheme(theme => ({
  container: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 40
  },
  actionsContainer: {},
  button: {
    position: "absolute",
    top: 24,
    right: 24
  },
  iconStyles: {
    color: theme.colors.secondary
  }
}))
