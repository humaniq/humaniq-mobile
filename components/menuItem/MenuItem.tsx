import { Colors, Text, View } from "react-native-ui-lib";
import { HIcon } from "../icon";
import React from "react";
import Ripple from "react-native-material-ripple";
import { Animated, StyleProp, ViewStyle } from "react-native";

export interface MenuItemProps {
  icon: string,
  iconStyle?: StyleProp<ViewStyle | Animated.AnimatedProps<ViewStyle>>
  name: string
  value?: string | JSX.Element,
  showArrow?: boolean
  onPress?: (props?: any) => any | Promise<any>
}

export const MenuItem = ({ icon, iconStyle, name, value, onPress, showArrow = true }: MenuItemProps) => {
  return <Ripple onPress={ onPress } rippleColor={ Colors.primary } style={ { padding: 10 } }>
    <View row center>
      <View flex-1>
        <View bg-greyLight padding-9 br100 style={ iconStyle }>
          <HIcon
              name={ icon }
              size={ 14 }
              color={ Colors.primary }/>
        </View>
      </View>
      <View flex-5 paddingL-10>
        <Text text16 numberOfLines={ 1 }>
          { name }
        </Text>
      </View>
      <View flex-3 right>
        { value }
      </View>
      <View flex-1>
        <View padding-9 style={ { transform: [ { rotate: '90deg' } ] } }>
          { showArrow && <HIcon
              name="up"
              size={ 14 }
              color={ Colors.black }/>
          }
        </View>
      </View>
    </View>
  </Ripple>
}