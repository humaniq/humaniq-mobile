import { withTheme } from "hooks/useTheme"

export const useStyles = withTheme(theme => ({
  root: {},
  input: {
    backgroundColor: theme.colors.tertiary,
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 16,
    fontFamily: theme.fonts.bold,
    fontSize: 15,
    color: theme.colors.placeholder,
  },
  title: {
    fontFamily: theme.fonts.regular,
    color: theme.colors.sub,
    marginBottom: 8,
    fontSize: 12,
  },
}))

export const useMaskedInputStyles = withTheme(theme => ({
  root: {},
  input: {
    fontFamily: theme.fonts.bold,
    fontSize: 15,
    color: theme.colors.text,
    paddingVertical: 16,
    backgroundColor: theme.colors.tertiary,
    borderRadius: 8,
    paddingLeft: 24,
    paddingRight: 12,
  },
  title: {
    fontFamily: theme.fonts.regular,
    color: theme.colors.sub,
    marginBottom: 8,
    fontSize: 12,
  },
  loading: {
    position: "absolute",
    right: 12,
    bottom: 0,
    top: 0,
  },
}))
