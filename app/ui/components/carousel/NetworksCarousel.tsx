import { Props } from "./types"
import { useStyles } from "./styles"
import { CarouselItem } from "ui/components/carousel/item/CarouselItem"
import { ScrollView } from "react-native-gesture-handler"
import { memo, useCallback, useRef, useState } from "react"
import { Network } from "../../../references/network"
import { Text, View } from "react-native"

export const NetworksCarousel = memo(({
                                        header,
                                        containerStyle,
                                        contentStyle,
                                        onPress,
                                        networks = [],
                                      }: Props) => {
  const styles = useStyles()
  const [ selectedChain, setSelectedChain ] = useState(Network.ethereum)
  const [ contentWidth, setContentWidth ] = useState(0)
  const scrollRef = useRef<ScrollView>(null)

  const scrollTo = useCallback((index: number) => {
    const length = networks.length

    scrollRef?.current.scrollTo({
      x: contentWidth * index / length,
    })
  }, [ scrollRef, contentWidth, networks ])

  const networkClickHandle = useCallback((item: Network, index: number) => {
    setSelectedChain(item)
    scrollTo(index)
    onPress?.(item)
  }, [ setSelectedChain, scrollTo, onPress ])

  return (
    <View>
      <Text style={ styles.header }>{ header }</Text>
      <ScrollView
        ref={ scrollRef }
        style={ containerStyle }
        onContentSizeChange={ setContentWidth }
        contentContainerStyle={ [ styles.content, contentStyle ] }
        showsHorizontalScrollIndicator={ false }
        horizontal={ true }>
        { networks.map((item, index) => (
          <CarouselItem
            onPress={ () => {
              networkClickHandle(item, index)
            } }
            item={ item }
            key={ item }
            selected={ item === selectedChain }
          />
        )) }
      </ScrollView>
    </View>
  )
})
