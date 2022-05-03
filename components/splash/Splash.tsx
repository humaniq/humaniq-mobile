import { Colors, LoaderScreen, Text, View } from "react-native-ui-lib";
import LogoBrandFull from "../../assets/images/logo-brand-full.svg";
import React from "react";
import * as Animatable from "react-native-animatable"
import { t } from "../../i18n";

export const Splash = ({ showLoader = false, text = "" }) => {
    return <View center flex>
        <View style={ { height: 310 } } top>
            <View center>
                <Animatable.View animation="pulse" iterationCount={ "infinite" }
                                 direction="alternate">
                    <LogoBrandFull width={ 160 } height={ 160 }/>
                </Animatable.View>
            </View>
            { showLoader && !text && <LoaderScreen messageStyle={ { color: Colors.textGrey } }/> }
            { showLoader && text &&
                <Text marginT-200 center textGrey numberOfLines={ 2 }>{ t("loadingText") }</Text> }
        </View>
    </View>

}
