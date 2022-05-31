import { Avatar as Av, Colors, Text, View } from "react-native-ui-lib";
import { Avatar } from "../avatar/Avatar";
import { getDictionary } from "../../App";
import React from "react";
import Ripple from "react-native-material-ripple";
import { NATIVE_COIN } from "../../config/network";
import { Chart, Line } from "react-native-responsive-linechart";


export interface TokenItemProps {
    symbol: string
    tokenAddress?: string
    logo?: any
    name?: string
    formatBalance?: string
    formatFiatBalance?: string
    onPress?: any,
    index: number,
    short?: boolean
    single?: boolean,
    graphData?: Array<any>
}

export const TokenItem = (props: TokenItemProps) => {
    return <Ripple testID={ `tokenItem` } onPress={ props.onPress } rippleColor={ Colors.primary }>
        <View padding-10 paddingH-16 paddingL-0
              key={ props.symbol }>
            <View row centerV>
                <View flex-2 center>
                    {
                        props.logo === NATIVE_COIN.ETHEREUM &&
                        <Av size={ 44 } containerStyle={ { position: 'relative' } }
                            imageStyle={ { width: 36, height: 36, position: 'absolute', left: 4, top: 3 } }
                            source={ require(`../../assets/images/ethereum-logo.png`) }/>
                    }
                    {
                        props.logo === NATIVE_COIN.BINANCECOIN &&
                        <Av size={ 44 } source={ require(`../../assets/images/binancecoin-logo.png`) }/>
                    }
                    {
                        (props.logo !== NATIVE_COIN.ETHEREUM && props.logo !== NATIVE_COIN.BINANCECOIN) &&
                        <Avatar address={ props.tokenAddress } size={ 44 }
                                source={ { uri: props.logo || getDictionary().ethToken.get(props.symbol)?.logoURI } }/>
                    }
                </View>
                <View flex-3>
                    <View>
                        <Text numberOfLines={ 1 } robotoM black text16>{ props.name }</Text>
                    </View>
                    { !props.short && <View paddingT-5>
                        <Text numberOfLines={ 1 } robotoR textGrey text14>{ props.symbol }</Text>
                    </View>
                    }
                </View>
                <View flex-2 centerV>
                    { !!(props.graphData && props.graphData.length) && <Chart data={props.graphData} style={{width: "100%", height: 20}}
                                                                              padding={{ left: 10, bottom: 0, right: 0, top: 0 }}
                    >
                        <Line  theme={{ stroke: { color: Colors.primary, width: 2 }} }   />
                    </Chart> }
                </View>
                <View flex-2 right>
                    <Text numberOfLines={ 1 } text16 robotoM black>
                        { props.formatFiatBalance }
                    </Text>
                    { !props.short && <Text numberOfLines={ 1 } robotoR textGrey text14 marginT-5>
                        { props.formatBalance }
                    </Text>
                    }
                </View>
            </View>
            { props.index !== 0 && !props.single && <View absR style={ {
                borderWidth: 1,
                borderColor: Colors.grey,
                width: "85%",
                borderBottomColor: "transparent"
            } }/> }
        </View></Ripple>
}