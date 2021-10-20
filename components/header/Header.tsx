import React from "react";
import { observer } from "mobx-react-lite";
import { Button, Colors, Text, TouchableOpacity, View } from "react-native-ui-lib";
import FAIcon from "react-native-vector-icons/FontAwesome5";
import { RootNavigation } from "../../navigators";
import Ripple from "react-native-material-ripple";

export interface HeaderProps {
  title: string;
  backButton?: boolean;
  onPressMenu?: (any) => any | Promise<any>;
}

export const Header = observer<HeaderProps>((
  {
    title,
    backButton = true,
    onPressMenu = true
  }) => {
  return <View marginT-15 row center>
    <View flex-2 left marginR-20>
      <TouchableOpacity padding-10 paddingH-20 center onPress={ RootNavigation.goBack }>
        { backButton &&
        <FAIcon color={ Colors.primary } size={ 24 } name={ "angle-left" } /> }
      </TouchableOpacity>
    </View>
    <View flex-6 center>
      <Text h5 center primary>{ title }</Text>
    </View>
    <View flex-2 right marginR-20>
      { onPressMenu &&
      <Ripple onPress={ onPressMenu } rippleContainerBorderRadius={ 20 } rippleColor={ Colors.primary }>
        <Button style={ { height: 40, width: 40 } } round backgroundColor={ Colors.dark70 }>
          <FAIcon size={ 20 } color={ Colors.primary } name={ "ellipsis-v" } />
        </Button></Ripple> }
    </View>
  </View>;
});
