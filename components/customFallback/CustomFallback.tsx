import { Screen } from "../screen/screen";
import { Button, Colors, Text, View } from "react-native-ui-lib";
import { t } from "../../i18n";
import React from "react";
import ErrorImg from '../../assets/images/error.svg'
import { isDev } from "../../shim";

export const CustomFallback = (props: { error: Error, resetError: () => void }) => (
    <Screen preset={ "fixed" } style={ { minHeight: "100%" } } backgroundColor={ Colors.white }
            statusBarBg={ Colors.white }>
        <View flex centerH>
            <View flex paddingT-83>
                <ErrorImg/>
            </View>
            <View flex centerH>
                <Text text16 robotoM>{ t("errorBoundary.title") }</Text>
                <Text text14 textGrey marginT-10>{ t("errorBoundary.description") }</Text>
                { isDev && <Text marginT-30>{ props.error.toString() }</Text> }
            </View>
            <View flex bottom padding-16 width={ "100%" }>
                <Button br50 marginT-20 onPress={ props.resetError } label={ t("errorBoundary.tryAgain") }/>
            </View>

        </View>
    </Screen>
)