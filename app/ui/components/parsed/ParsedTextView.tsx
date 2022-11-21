import ParsedText from "react-native-parsed-text"
import { ParseShape, Props } from "./types"
import { useStyles } from "./styles"

export const ParsedTextView = ({ text, style, customPatterns = [] }: Props) => {
  const styles = useStyles()

  return (
    <ParsedText
      selectionColor={ "transparent" }
      selectable={ false }
      style={ [ styles.root, style ] }
      parse={ [
        ...(customPatterns as ParseShape[]),
      ] }
    >
      { text }
    </ParsedText>
  )
}
