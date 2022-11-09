import { withTheme } from "hooks/useTheme"
import { IS_IOS } from "utils/common"

export const useStyles = withTheme(theme => ({
  root: {
    backgroundColor: theme.colors.searchBg,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 24,
    paddingRight: 10,
    paddingTop: IS_IOS ? 10 : 0,
    paddingBottom: IS_IOS ? 10 : 0,
    borderRadius: 10
  },
  input: {
    flex: 1,
    fontFamily: theme.fonts.medium,
    color: theme.colors.searchIcon,
    marginLeft: 12,
    fontSize: 16,
  }
}))
