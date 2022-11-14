import { withTheme } from "hooks/useTheme"

export const useRoundIconStyles = withTheme(theme => ({
  root: {
    backgroundColor: theme.colors.secondaryBg,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6,
  }
}))
