import { color, spacing, typography } from "../../theme"

export default {
  full: { flex: 1 },
  container:  {
    backgroundColor: color.transparent,
    paddingHorizontal: spacing[4],
  },
  text: {
    color: color.palette.white,
    fontFamily: typography.primary,
  },
  bold: { fontWeight: "bold" },
  header: {
    paddingTop: spacing[3],
    paddingBottom: spacing[4] + spacing[1],
    paddingHorizontal: 0,
  },
  headerTitle: {
    color: color.palette.white,
    fontFamily: typography.primary,
    fontWeight: "bold",
    fontSize: 12,
    lineHeight: 15,
    textAlign: "center",
    letterSpacing: 1.5,
  },
  continue: {
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[4],
    backgroundColor: color.palette.deepPurple,
  },
  continueText: {
    color: color.palette.white,
    fontFamily: typography.primary,
    fontWeight: "bold",
    lineHeight: 15,
    fontSize: 13,
    letterSpacing: 2,
  },
  footer: { backgroundColor: "#20162D" },
  footerContent: {
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[4],
  }
}
