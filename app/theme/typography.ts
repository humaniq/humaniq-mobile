import { Platform } from "react-native"
import { Typography } from "react-native-ui-lib"

Typography.loadTypographies({
  h1: { fontSize: 42, fontWeight: "300", lineHeight: 54 },
  h2: { fontSize: 36, fontWeight: "300", lineHeight: 42 },
  h3: { fontSize: 32, fontWeight: "300", lineHeight: 38 },
  h4: { fontSize: 26, fontWeight: "300", lineHeight: 38 },
  h5: { fontSize: 22, fontWeight: "600", lineHeight: 28 },
  h6: { fontSize: 18, fontWeight: "600", lineHeight: 24 },
  bold: { fontWeight: "bold" },
})

/**
 * You can find a list of available fonts on both iOS and Android here:
 * https://github.com/react-native-training/react-native-fonts
 *
 * If you're interested in adding a custom font to your project,
 * check out the readme file in ./assets/fonts/ then come back here
 * and enter your new font name. Remember the Android font name
 * is probably different than iOS.
 * More on that here:
 * https://github.com/lendup/react-native-cross-platform-text
 *
 * The various styles of fonts are defined in the <Text /> component.
 */
export const typography = {
  /**
   * The primary font.  Used in most places.
   */
  primary: Platform.select({ ios: "Helvetica", android: "normal" }),
  
  /**
   * An alternate font used for perhaps titles and stuff.
   */
  secondary: Platform.select({ ios: "Arial", android: "sans-serif" }),
  
  /**
   * Lets get fancy with a monospace font!
   */
  code: Platform.select({ ios: "Courier", android: "monospace" }),
}
