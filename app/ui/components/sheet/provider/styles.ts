import { withTheme } from "hooks/useTheme"

export const useStyles = withTheme(theme => ({
  root: {
    backgroundColor: theme.colors.modalBackground
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 20,
  },
  title: {
    fontFamily: theme.fonts.bold,
    fontSize: 17,
    color: theme.colors.text,
    textAlign: "center"
  },
  sub: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20
  },
  subTitle: {
    fontFamily: theme.fonts.regular,
    fontSize: 14,
    color: theme.colors.text,
    lineHeight: 25,
    flex: 1,
    marginRight: 16
  },
  row: {
    backgroundColor: theme.colors.tertiary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'space-between',
    marginBottom: 12
  },
  rowTitle: {
    fontFamily: theme.fonts.medium,
    color: theme.colors.text,
    fontSize: 14,
    flex: 1,
  },
  footer: {
    marginTop: 8
  },
  footerRow: {
    marginTop: 16
  },
  terms: {
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
    textDecorationColor: theme.colors.text,
    fontFamily: theme.fonts.regular
  },
  handle: {
    backgroundColor: theme.colors.indicator,
    width: 36,
    height: 5,
    marginTop: -3
  },
}))
