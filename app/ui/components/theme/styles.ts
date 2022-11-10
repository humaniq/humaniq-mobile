import { withTheme } from "hooks/useTheme"

export const useStyles = withTheme(theme => ({
  root: {
    flexDirection: "row",
    alignItems: "center",
  },
  container: {
    paddingLeft: 24,
    paddingVertical: 10
  }
}))
