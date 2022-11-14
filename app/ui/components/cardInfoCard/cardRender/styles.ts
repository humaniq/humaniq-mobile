import { withTheme } from "hooks/useTheme"


export const useStyles = withTheme(theme => ({
  card: {
    position: "relative",
    display: "flex",
    flexWrap: "nowrap",
    flexDirection: "column",
    alignItems:"center",
    maxWidth: 400,
    flex: 1,
    height: 240,
    padding: 24,
    borderRadius: 12,
  },
  cardNumber: {},
  data: {},
  holder: {},
  textMedium: {
    color: theme.colors.primary,
    fontWeight: "500",
    fontSize: 16,
    lineHeight: 24,
  },
  logo: {
    position: "absolute",
    right: 24,
    bottom: 24,
    zIndex: 2,
  },
}))
