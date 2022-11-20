import { withTheme } from "hooks/useTheme"

export const useStyles = withTheme(theme => ({
  root: {
    backgroundColor: theme.colors.modalBackground,
  },
  content: {
    paddingBottom: 30,
  },
  handle: {
    backgroundColor: theme.colors.indicator,
    width: 36,
    height: 5,
    marginTop: -3
  },
  title: {
    fontFamily: theme.fonts.bold,
    fontSize: 18,
    color: theme.colors.text,
    textAlign: "center",
    marginHorizontal: 20,
    marginTop: 10,
  },
  search: {
    marginTop: 20,
    marginBottom: 20,
    marginHorizontal: 20,
  },
  carousel: {
    paddingHorizontal: 20,
  },
  divider: {
    marginHorizontal: 20,
    marginBottom: 10,
  },
  empty: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  emptyTitle: {
    fontFamily: theme.fonts.regular,
    color: theme.colors.text,
    fontSize: 15,
    marginTop: 12,
  },
}))
