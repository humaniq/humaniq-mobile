import { LoaderScreen, View } from "react-native-ui-lib";
import LogoBrandFull from "../../assets/images/logo-brand-full.svg";
import React from "react";
import * as Animatable from "react-native-animatable"

export const Splash = ({ showLoader = false }) => {
    return <View center flex>
        <View style={ { height: 310 } } top>
            <View>
                <Animatable.View animation="pulse" iterationCount={ "infinite" }
                                 direction="alternate">
                    <LogoBrandFull width={ 160 } height={ 160 }/>
                </Animatable.View>
            </View>
            { showLoader && <LoaderScreen/> }
        </View>
    </View>

}