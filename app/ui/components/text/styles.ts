import { withTheme } from "hooks/useTheme"

export const useTextStyles = withTheme(theme => ({
  root: {
    fontFamily: theme.fonts.regular,
    color: theme.colors.secondary,
    lineHeight: 25,
    fontSize: 16
  }
}))

export const useIconTextStyles = withTheme(theme => ({
  root: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 2,
  },
  text: {
    fontFamily: theme.fonts.regular,
    color: theme.colors.secondary,
    fontSize: 12,
    flex: 1,
    marginLeft: 20,
    lineHeight: 18
  }
}))

export const useLinkTextStyles = withTheme(theme => ({
  root: {
    alignSelf: "center",
    justifyContent: "center",
    marginTop: 24,
  },
  text: {
    fontFamily: theme.fonts.medium,
    color: theme.colors.text,
    fontSize: 13,
    textDecorationLine: "underline",
  }
}))
