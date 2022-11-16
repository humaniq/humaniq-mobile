import { Props } from "./types"
import { useStyles } from "./styles"
import { TokenItem } from "ui/components/carousel/item/TokenItem"
import { ScrollView } from "react-native-gesture-handler"
import { networks } from "../../../references/networks"
import { memo } from "react"

export const TokensCarousel = memo(({ containerStyle, contentStyle }: Props) => {
  const styles = useStyles()

  return (
    <ScrollView
      contentContainerStyle={ [ styles.content, contentStyle ] }
      showsHorizontalScrollIndicator={ false }
      horizontal={ true }>
      { Object.values(networks).map((item, index) => (
        <TokenItem
          onPress={ () => {} }
          item={ item }
          key={ index }
          selected={ index === 0 }
        />
      )) }
    </ScrollView>
  )
})
