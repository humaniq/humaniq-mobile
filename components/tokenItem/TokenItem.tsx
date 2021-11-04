import { Avatar as Av, Colors, Text, View } from "react-native-ui-lib";
import { Avatar } from "../avatar/Avatar";
import { getDictionary } from "../../App";
import React from "react";
import Ripple from "react-native-material-ripple";

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
  single?: boolean
}

export const TokenItem = (props: TokenItemProps) => {
  return <Ripple onPress={ props.onPress } rippleColor={ Colors.primary }>
    <View padding-10 paddingH-16 paddingL-0
          key={ props.symbol }>
      <View row centerV>
        <View flex-2 center>
          {
            props.logo === "ethereum" &&
            <Av size={ 44 } source={ require("../../assets/images/ethereum-logo.png") }/>
          }
          {
            props.logo !== "ethereum" &&
            <Avatar address={ props.tokenAddress } size={ 44 }
                    source={ { uri: props.logo || getDictionary().ethToken.get(props.symbol)?.logoURI } }/>
          }
        </View>
        <View flex-5>
          <View>
            <Text numberOfLines={ 1 } textM grey20>{ props.name }</Text>
          </View>
          { !props.short && <View>
              <Text numberOfLines={ 1 } text90R grey40>{ props.symbol }</Text>
          </View>
          }
        </View>
        <View flex-3 right>
          <Text numberOfLines={ 1 } text16 robotoB grey20>
            { props.formatFiatBalance }
          </Text>
          { !props.short && <Text numberOfLines={ 1 } text90 grey40 bold>
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