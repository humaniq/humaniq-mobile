import { withTheme } from "hooks/useTheme"
import { toRGBAColor } from "ui/components/theme/utils"


export const useStyles = withTheme(theme => ({
  card: {
    position: "relative",
    display: "flex",
    flexWrap: "nowrap",
    flexDirection: "column",
    alignItems: "center",
    maxWidth: 400,
    flex: 1,
    height: 240,
    borderRadius: 24,
    shadowColor: "#838482",
    borderColor: toRGBAColor(theme.colors.borderColor, 0.5),
    borderWidth: 1,
    padding: 0,
    margin: 0,
  },
  backGroundImg: {
    flexWrap: "nowrap",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    flex: 1,
  },
  cardNumber: {
    display: "flex",
    flexDirection: "row",
    paddingTop: 42,
  },
  data: {},
  holder: {
    display: "flex", flexDirection: "row",
    position: "absolute",
    left: 5,
    bottom: 24
  },
  textHolder: {
    paddingHorizontal: 5,
    color: theme.colors.primary,
    fontWeight: "500",
    fontSize: 28
  },
  textMedium: {
    color: theme.colors.primary,
    fontWeight: "500",
    fontSize: 42,
    lineHeight: 36,
    paddingHorizontal: 10,
  },
  logo: {
    position: "absolute",
    right: 5,
    bottom: 24,
    zIndex: 2,
  },
}))
