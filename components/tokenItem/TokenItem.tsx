import { Avatar as Av, Colors, Text, View } from "react-native-ui-lib";
import { Avatar } from "../avatar/Avatar";
import { getDictionary } from "../../App";
import React from "react";
import Ripple from "react-native-material-ripple";

export interface TokenItemProps {
  symbol: string
  tokenAddress: string
  logo: any
  name: string
  formatBalance: string
  formatFiatBalance: string
  onPress?: any
}

export const TokenItem = (props: TokenItemProps) => {
  return <Ripple onPress={ props.onPress } rippleColor={ Colors.primary }>
    <View padding-10 paddingH-20
          key={ props.symbol }>
      <View row centerV>
        <View flex-2>
          {
            props.logo === "ethereum" &&
            <Av size={ 40 } source={ require("../../assets/images/ethereum-logo.png") }/>
          }
          {
            props.logo !== "ethereum" &&
            <Avatar address={ props.tokenAddress } size={ 40 }
                    source={ { uri: props.logo || getDictionary().ethToken.get(props.symbol)?.logoURI } }/>
          }
        </View>
        <View flex-4>
          <View>
            <Text numberOfLines={ 1 } bold grey20>{ props.symbol }</Text>
          </View>
          <View>
            <Text numberOfLines={ 1 } text90R violet40>{ props.name }</Text>
          </View>
        </View>
        <View flex-3 right>
          <Text numberOfLines={ 1 } text60 bold grey20>
            { props.formatBalance }
          </Text>
        </View>
        <View flex-2 left center>
          <Text numberOfLines={ 1 } text90 primary bold>
            { props.formatFiatBalance }
          </Text>
        </View>
      </View>
    </View></Ripple>
}