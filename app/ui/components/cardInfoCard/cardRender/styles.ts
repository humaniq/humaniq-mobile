import { withTheme } from "hooks/useTheme"
import { StyleSheet } from "react-native"

export const useStyles = withTheme(theme => ({
  root: {
    height: 230,
    borderRadius: 12,
    overflow: "hidden",
    margin: 4,
  },
  content: {
    height: "100%",
  },
  header: {
    position: "absolute",
    right: 24,
    top: 56,
    left: 24,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 12,
  },
  more: {
    backgroundColor: "#F1F1F1",
    borderRadius: 30,
    position: "absolute",
    right: 24,
    top: 24,
  },
  expirationDots: {
    flexDirection: "row",
    alignItems: "center",
  },
  textHolder: {
    paddingRight: 5,
    fontFamily: theme.fonts.medium,
    fontSize: 15,
  },
  holder: {
    color: theme.colors.primary,
    fontFamily: theme.fonts.medium,
    fontSize: 18,
  },
  textMedium: {
    color: theme.colors.primary,
    fontFamily: theme.fonts.medium,
    fontSize: 26,
    paddingRight: 12,
  },
  textSmall: {
    color: theme.colors.primary,
    fontFamily: theme.fonts.medium,
    fontSize: 15,
    paddingRight: 12,
    marginTop: 12,
  },
  bottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    position: "absolute",
    left: 24,
    right: 24,
    bottom: 24,
  },
}))
