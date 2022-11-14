import { withTheme } from "hooks/useTheme"

export const useStyles = withTheme(theme => ({
  root: {
    backgroundColor: theme.colors.settings,
    alignItems: "center",
    justifyContent: "center",
    width: 78,
    height: 78,
    borderRadius: 78
  }
}))
