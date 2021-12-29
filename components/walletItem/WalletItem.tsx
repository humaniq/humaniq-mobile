import React from "react";
import { Avatar, Colors, RadioButton, Text, View } from "react-native-ui-lib";
import { HIcon } from "../icon";
import { getWalletStore } from "../../App";
import { Wallet } from "../../store/wallet/Wallet";
import Ripple from "react-native-material-ripple";

export interface IWalletItemProps {
  wallet: Wallet
  index?: number
  onPressWallet?: (w: Wallet, i?: number) => void | Promise<void>
}

export const WalletItem: React.FC<IWalletItemProps> = (props) => {

  const showRadio = props.index !== undefined

  return <Ripple
      disabled={ !props.onPressWallet }
      key={ props.wallet.address }
      rippleColor={ Colors.primary }
      onPress={ () => props.onPressWallet(props.wallet, props.index) }>
    <View padding-10 paddingH-15 paddingR-20>
      <View row centerV>
        <View flex-2>
          {
            <Avatar size={ 44 } backgroundColor={ Colors.greyLight }>
              <HIcon name={ "wallet" } size={ 20 } style={ { color: Colors.primary } }/>
            </Avatar>
          }
        </View>
        <View flex-6>
          <Text numberOfLines={ 1 } textM text16 black>{ props.wallet.formatAddress }</Text>
          { showRadio &&
              <Text numberOfLines={ 1 } text14 robotoR textGrey>
                { props.wallet.formatTotalWalletFiatBalance }
              </Text>
          }
        </View>
        <View flex-2 right>
          { showRadio && <RadioButton size={ 20 }
                                      color={ getWalletStore().selectedWalletIndex !== props.index ? Colors.textGrey : Colors.primary }
                                      selected={ getWalletStore().selectedWalletIndex === props.index }/>
          }
          { !showRadio &&
              <Text numberOfLines={ 1 } text16 robotoM>
                { props.wallet.formatTotalWalletFiatBalance }
              </Text>
          }
        </View>
      </View>
      { props.index !== undefined && props.index !== 0 && <View absR style={ {
        borderWidth: 1,
        borderColor: Colors.grey,
        width: "90%",
        borderBottomColor: "transparent"
      } }/> }
    </View>
  </Ripple>
}