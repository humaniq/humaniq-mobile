import { withTheme } from "hooks/useTheme"

export const useStyles = withTheme(theme => ({
  root: { flex: 1, padding: 20, marginTop: 10, backgroundColor: theme.colors.bg }
}))
