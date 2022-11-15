import { Props } from "./types"
import { useStyles } from "./styles"
import { ScrollView } from "react-native"
import { TokenItem } from "ui/components/carousel/item/TokenItem"

export const TokensCarousel = ({ containerStyle, contentStyle }: Props) => {
  const styles = useStyles()

  return (
    <ScrollView
      contentContainerStyle={ [styles.content, contentStyle] }
      showsHorizontalScrollIndicator={ false }
      horizontal={ true }>
      { [1, 2, 3, 4, 5, 6].map((item, index) => (
        <TokenItem key={ index } selected={ index === 0 }/>
      )) }
    </ScrollView>
  )
}
