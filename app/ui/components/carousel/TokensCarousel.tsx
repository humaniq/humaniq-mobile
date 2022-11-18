import { Props } from "./types"
import { useStyles } from "./styles"
import { CarouselItem } from "ui/components/carousel/item/CarouselItem"
import { ScrollView } from "react-native-gesture-handler"
import { networks } from "../../../references/networks"
import { memo, useCallback, useRef, useState } from "react"
import { NetworkInfo } from "../../../references/types"

export const TokensCarousel = memo(({
                                      containerStyle,
                                      contentStyle,
                                      onPress,
                                    }: Props) => {
  const styles = useStyles()
  const [ selectedChain, setSelectedChain ] = useState(1)
  const [ contentWidth, setContentWidth ] = useState(0)
  const scrollRef = useRef<ScrollView>(null)

  const scrollTo = useCallback((index: number) => {
    const length = Object.values(networks).length

    scrollRef?.current.scrollTo({
      x: contentWidth * index / length,
    })
  }, [ scrollRef, contentWidth, networks ])

  const networkClickHandle = useCallback((item: NetworkInfo, index: number) => {
    setSelectedChain(item.chainId)
    scrollTo(index)
    onPress?.(item)
  }, [ setSelectedChain, scrollTo ])

  return (
    <ScrollView
      ref={ scrollRef }
      style={ containerStyle }
      onContentSizeChange={ setContentWidth }
      contentContainerStyle={ [ styles.content, contentStyle ] }
      showsHorizontalScrollIndicator={ false }
      horizontal={ true }>
      { Object.values(networks).map((item, index) => (
        <CarouselItem
          onPress={ () => {
            networkClickHandle(item, index)
          } }
          item={ item }
          key={ index }
          selected={ item.chainId === selectedChain }
        />
      )) }
    </ScrollView>
  )
})
