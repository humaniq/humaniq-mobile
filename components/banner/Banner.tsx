import React from "react";
import { Banner as B } from "../../store/banner/BannerStore";
import { Colors, Image, Text, View } from "react-native-ui-lib";
import Carousel from "react-native-snap-carousel";
import { Dimensions } from "react-native";
import { getBannerStore } from "../../App";
import LinearGradient from "react-native-linear-gradient";
import Ripple from "react-native-material-ripple";
import { HIcon } from "../icon";


export interface BannerProps extends B {
    index: number
    count: number
}

export const Banner: React.FC<BannerProps> = (
    banner) => {

    const baseStyle = { borderRadius: 12, color: Colors.white, display: "flex", flexDirection: "row" }
    return <LinearGradient
        start={ { x: 0, y: 0.5 } }
        end={ { x: 1, y: 0.5 } }
        locations={ banner.$.locations }
        key={ banner.$.id }
        colors={ banner.$.colors }
        style={ banner.count > 1 && banner.count - banner.index !== 1 ? {
            marginRight: 10,
            ...baseStyle
        } : baseStyle }>
        <Ripple onPress={ banner.onPress } style={ { display: "flex", flexDirection: "row", flex: 1, padding: 8, } }>
            <View flex-2 center>
                <Image width={ 40 } height={ 40 } source={ banner.image.default }/>
            </View>
            <View flex-8>
                <View><Text white text16 robotoM>{ banner.$.tittle }</Text></View>
                <View paddingT-8><Text white numberOfLines={ 2 }>{ banner.$.description }</Text></View>
            </View>
        </Ripple>
        <HIcon style={ { padding: 8 } } onPress={ () => banner.setSuggest(true) } size={ 18 } color={ Colors.white }
               name={ "circle-xmark-solid" }/>
    </LinearGradient>
}

const renderBanner = ({ item, index }) => <Banner { ...item } index={ index }
                                                  count={ getBannerStore().banners.length }/>

export interface BannersProps {
    banners: Array<BannerProps>
}

export const Banners: React.FC<BannersProps> = ({ banners }) => {

    const width = getBannerStore().banners.length > 1 ? Dimensions.get('window').width - 55 : Dimensions.get('window').width - 32

    if (!banners?.length) return <></>

    return <View row flex marginL-16 marginR-16 paddingB-8><Carousel
        data={ banners }
        sliderWidth={ width }
        itemWidth={ width }
        vertical={ false }
        inactiveSlideScale={ 1 }
        inactiveSlideOpacity={ 1 }
        renderItem={ renderBanner }
    /></View>
}