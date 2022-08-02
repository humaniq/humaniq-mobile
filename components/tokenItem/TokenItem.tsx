import { Avatar as Av, Colors, Text, View } from "react-native-ui-lib";
import { Avatar } from "../avatar/Avatar";
import { getDictionary } from "../../App";
import React from "react";
import Ripple from "react-native-material-ripple";
import { NATIVE_COIN } from "../../config/network";
import { Area, Chart, Line } from "react-native-responsive-linechart";
import { CheckBtn } from "../checkBtn/CheckBtn";

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
    fiatOnTop?: boolean,
    showGraph?: boolean,
    showRadioBtn?: boolean
    uncheckedRadioColor?: string
    onPressRadioBtn?: any,
    hidden?: boolean
}

function renderToken(
    symbol: string,
    tokenAddress: string,
    logo: any,
    name: string,
    formatBalance: string,
    formatFiatBalance: string,
    index: number,
    short: boolean,
    single: boolean,
    graphData: Array<any>,
    fiatOnTop: boolean,
    showGraph: boolean,
    showRadioBtn: boolean,
    uncheckedRadioColor: string,
    onPressRadioBtn: any,
    hidden: boolean
) {
    return <View padding-10 paddingH-16 paddingL-0
                 key={ symbol }>
        <View row centerV>
            {
                showRadioBtn && <View flex-1 right><CheckBtn uncheckedColor={uncheckedRadioColor} checked={ !hidden } onPress={ onPressRadioBtn }/></View>
            }
            <View flex-2 center>
                {
                    logo === NATIVE_COIN.ETHEREUM &&
                    <Av size={ 44 } containerStyle={ { position: 'relative' } }
                        imageStyle={ { width: 36, height: 36, position: 'absolute', left: 4, top: 3 } }
                        source={ require(`../../assets/images/ethereum-logo.png`) }/>
                }
                {
                    logo === NATIVE_COIN.BINANCECOIN &&
                    <Av size={ 44 } source={ require(`../../assets/images/binancecoin-logo.png`) }/>
                }
                {
                    (logo !== NATIVE_COIN.ETHEREUM && logo !== NATIVE_COIN.BINANCECOIN) &&
                    <Avatar address={ tokenAddress } size={ 44 }
                            source={ { uri: logo || getDictionary().ethToken.get(symbol)?.logoURI } }/>
                }
            </View>
            <View flex-4>
                <View>
                    <Text numberOfLines={ 1 } robotoM black text16>{ name }</Text>
                </View>
                { !short && <View paddingT-4>
                    { !!(graphData && graphData?.length && showGraph) ?
                        <Chart data={ graphData } style={ { width: 100, height: 20 } }
                               padding={ { left: 0, bottom: 2, right: 0, top: 2 } }
                        >
                            <Area theme={ {
                                gradient: {
                                    from: { color: Colors.primary, opacity: 0.1 },
                                    to: { color: Colors.primary, opacity: 0.1 }
                                }
                            } }/>
                            <Line theme={ { stroke: { color: Colors.primary, width: 1 } } }/>
                        </Chart>
                        : <Text numberOfLines={ 1 } robotoR textGrey text14>{ symbol }</Text> }
                </View>
                }
            </View>
            <View flex-3 right>
                <Text numberOfLines={ 1 } text16 robotoM black>
                    { fiatOnTop ? formatFiatBalance : formatBalance }
                </Text>
                { !short && <Text numberOfLines={ 1 } robotoR textGrey text14 marginT-5>
                    { fiatOnTop ? formatBalance : formatFiatBalance }
                </Text>
                }
            </View>
        </View>
        { index !== 0 && !single && <View absR style={ {
            borderWidth: 1,
            borderColor: Colors.grey,
            width: "85%",
            borderBottomColor: "transparent"
        } }/> }
    </View>

}

export const TokenItem: React.FC<TokenItemProps> = (
    {
        onPress,
        formatBalance,
        formatFiatBalance,
        symbol,
        tokenAddress,
        logo,
        name,
        index,
        fiatOnTop = true,
        single = false,
        graphData,
        short = false,
        showGraph = false,
        showRadioBtn = false,
        uncheckedRadioColor,
        onPressRadioBtn,
        hidden = true
    }) => {
    if (onPressRadioBtn) return renderToken(symbol,
        tokenAddress,
        logo,
        name,
        formatBalance,
        formatFiatBalance,
        index,
        short,
        single,
        graphData,
        fiatOnTop,
        showGraph,
        showRadioBtn,
        uncheckedRadioColor,
        onPressRadioBtn,
        hidden)
    return <Ripple testID={ `tokenItem` } onPress={ onPress } rippleColor={ Colors.primary }>
        { renderToken(
            symbol,
            tokenAddress,
            logo,
            name,
            formatBalance,
            formatFiatBalance,
            index,
            short,
            single,
            graphData,
            fiatOnTop,
            showGraph,
            showRadioBtn,
            uncheckedRadioColor,
            onPressRadioBtn,
            hidden
        ) }
    </Ripple>
}